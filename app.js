// app.js
const state = { lang: "tr" };
let currencyNamesLoaded = false;
const translationCache = new Map();
async function translateBatch(texts, targetLang) {
  if (!Array.isArray(texts) || !texts.length) return [];
  if (!["tr", "en"].includes(targetLang)) return texts;
  const results = [];
  for (const txt of texts) {
    const key = `${targetLang}::${txt}`;
    if (translationCache.has(key)) {
      results.push(translationCache.get(key));
      continue;
    }
    try {
      const body = new URLSearchParams({ q: txt, source: "auto", target: targetLang, format: "text" });
      const res = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      });
      const json = await res.json();
      const tr = json?.translatedText || txt;
      translationCache.set(key, tr);
      results.push(tr);
    } catch (e) {
      results.push(txt);
    }
  }
  return results;
}
let currencyNames = {
  USD: "US Dollar",
  EUR: "Euro",
  TRY: "Turkish Lira",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  CNY: "Chinese Yuan",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  CHF: "Swiss Franc",
  DKK: "Danish Krone",
  SEK: "Swedish Krona",
  NOK: "Norwegian Krone",
  RUB: "Russian Ruble",
  PLN: "Polish Zloty",
  CZK: "Czech Koruna",
  HUF: "Hungarian Forint",
  RON: "Romanian Leu",
  BGN: "Bulgarian Lev",
  INR: "Indian Rupee",
  BRL: "Brazilian Real",
  MXN: "Mexican Peso",
  ZAR: "South African Rand",
  KRW: "South Korean Won",
  HKD: "Hong Kong Dollar",
  NZD: "New Zealand Dollar",
  SGD: "Singapore Dollar"
};
// TCMB verisi Google Sheet'e append_sheet.py ile 1FhNtmqu7ngaOA92QAg6olNQkFONX5kcG9Sn2SAWSX2I ID'li tabloya yazılıyor
// Widget'ın doğru kaynağı okuduğundan emin olmak için aynı sheet ID kullanıyoruz.
const TCMB_REMOTE_CSV_URL = "https://docs.google.com/spreadsheets/d/1FhNtmqu7ngaOA92QAg6olNQkFONX5kcG9Sn2SAWSX2I/export?format=csv";
// Gist/raw veya başka bir statik linki window.__TCMB_JSON_URL__ ile geçebilirsiniz
const TCMB_RAW_JSON_URL =
  (typeof window !== "undefined" && window.__TCMB_JSON_URL__) ||
  "https://gist.githubusercontent.com/MehmetFarukAkbulut/5eb4f828e0bb173ecc59ce159eaa19d3/raw/tcmb.json";
const TCMB_FALLBACK_JSON_URL = "./tcmb.json"; // statik fallback (aynı dizinde barınan JSON)
const TCMB_CODE_NAMES = {
  USD: "ABD DOLARI",
  EUR: "EURO",
  AUD: "AVUSTRALYA DOLARI",
  DKK: "DANIMARKA KRONU",
  GBP: "INGILIZ STERLINI",
  CHF: "ISVICRE FRANGI",
  SEK: "ISVEC KRONU",
  CAD: "KANADA DOLARI",
  KWD: "KUVEYT DINARI",
  NOK: "NORVEC KRONU",
  SAR: "SUUDI ARABISTAN RIYALI",
  JPY: "JAPON YENI",
  BGN: "BULGAR LEVASI",
  RON: "RUMEN LEYI",
  RUB: "RUS RUBLESI",
  CNY: "CIN YUANI",
  PKR: "PAKISTAN RUPISI",
  QAR: "KATAR RIYALI",
};
// USD ve EUR ilk sırada, diğerleri verilen listede
const TCMB_CODES = ["USD", "EUR", "AUD", "DKK", "GBP", "CHF", "SEK", "CAD", "KWD", "NOK", "SAR", "JPY", "BGN", "RON", "RUB", "CNY", "PKR", "QAR"];
const API_FOOTBALL_KEY = "4263454336cf9f35d8aef752fd4db60b";
const EVDS_KEY = "en4QTIAZ0F";

async function ensureCurrencyNames() {
  if (currencyNamesLoaded) return;
  try {
    const res = await fetch("https://open.er-api.com/v6/codes");
    const json = await res.json();
    const codes = json?.supported_codes || [];
    codes.forEach(([code, name]) => { currencyNames[code] = name; });
    currencyNamesLoaded = true;
  } catch (e) {
    // silent fallback; keep defaults
  }
}

const copy = {
  tr: {
    title: "MFA API's",
    subtitle: "Mehmet Faruk Akbulut's Website",
    search: "Ara",
    placeholders: {
      weather: "Sehir veya koordinat (orn: Istanbul)",
      currency: "Baz para birimi (USD, EUR...)",
      news: "Konu (orn: bitcoin)",
      recipes: "Yemek adi / malzeme (orn: tavuk)",
      movies: "Dizi/film (orn: Lost)",
      books: "Kitap / yazar (orn: Kuyucaklı Yusuf)",
      space: "Uzay konusu (orn: galaxy)",
      jobs: "Pozisyon / sirket (orn: frontend)",
      travel: "Nereden -> Nereye (orn: Istanbul -> Berlin)",
      maps: "Adres veya yer (orn: Berlin)",
      sports: "Lig veya takim (orn: Super Lig)",
      tcmb: "Kur kodu (orn: USD/TRY)"
    },
    detail: {
      weather: "Bugun ve yarin",
      currency: "Doviz donusumleri",
      news: "Son basliklar",
      recipes: "Tarif listesi",
      movies: "Dizi / film",
      books: "Kitap sonuclari",
      space: "Uzay gorseli",
      travel: "Rota / uzaklik",
      maps: "Konumlar",
      sports: "Maclar",
      calc: "Hesaplamalar",
      tcmb: "TCMB kurlari"
    },
    labels: {
      wind: "Ruzgar",
      rain: "Yagis olasiligi",
      city: "Sehir",
      base: "Baz",
      read: "oku",
      recipe: "Tarif",
      source: "kaynak",
      open: "ac",
      map: "harita",
      capital: "Baskent",
      currency: "Para",
      loading: "Yukleniyor...",
      from: "Nereden",
      to: "Nereye",
      drive: "Arac",
      fly: "Ucak",
      bus: "Otobus",
      train: "Tren",
      today: "Bugun",
      tomorrow: "Yarin",
      distance: "Mesafe",
      duration: "Sure",
      date: "Tarih"
    }
  },
  en: {
    title: "MFA API's",
    subtitle: "Mehmet Faruk Akbulut's Website",
    search: "Search",
    placeholders: {
      weather: "City or coords (e.g. Istanbul)",
      currency: "Base currency (USD, EUR...)",
      news: "Topic (e.g. launch)",
      recipes: "Meal / ingredient (e.g. chicken)",
      movies: "Show (e.g. Lost)",
      books: "Book / author (e.g. Dostoyevski)",
      space: "Space topic (e.g. galaxy)",
      jobs: "Role / company (e.g. frontend)",
      travel: "From -> To (e.g. Paris -> Berlin)",
      maps: "Address or place (e.g. Berlin)",
      sports: "League or team (e.g. EPL)",
      tcmb: "Pair code (e.g. USD/TRY)"
    },
    detail: {
      weather: "Today and tomorrow",
      currency: "FX rates",
      news: "Headlines",
      recipes: "Recipes",
      movies: "Shows / movies",
      books: "Books",
      space: "Space image",
      travel: "Route / distance",
      maps: "Locations",
      sports: "Matches",
      calc: "Calculators",
      tcmb: "TCMB rates"
    },
    labels: {
      wind: "Wind",
      rain: "Rain chance",
      city: "City",
      base: "Base",
      read: "read",
      recipe: "Recipe",
      source: "source",
      open: "open",
      map: "map",
      capital: "Capital",
      currency: "Currency",
      loading: "Loading...",
      from: "From",
      to: "To",
      drive: "Driving",
      fly: "Flight",
      bus: "Bus",
      train: "Train",
      today: "Today",
      tomorrow: "Tomorrow",
      distance: "Distance",
      duration: "Duration",
      date: "Date"
    }
  }
};

const apps = [
  
  
      {
        id: "tcmb",
        title: { tr: "TCMB Kurlari", en: "TCMB Rates" },
        subtitle: { tr: "Populer: Bugun", en: "Popular: Today" },
        image: "https://albyatirim.com.tr/uploads/analyzes/1744872383_31dcd3cf19fa010ecb20.jpg",
        popularQuery: "",
          fetcher: async () => {
            const appRef = apps.find(a => a.id === "tcmb");
            const formatTcmbDate = (val) => {
              const d = val instanceof Date ? val : new Date(val);
              if (isNaN(d.getTime())) return "";
              const dd = String(d.getDate()).padStart(2, "0");
              const mm = String(d.getMonth() + 1).padStart(2, "0");
              const yy = d.getFullYear();
              return `${dd}-${mm}-${yy}`;
            };
            const dateSelIso = appRef?._date ? localDateStr(new Date(appRef._date)) : "";
            const dateSel = dateSelIso ? dateSelIso.split("-").reverse().join("-") : "";

            const parseDate = (s) => {
              if (!s) return null;
              const parts = s.split("-").map(Number);
              if (parts.length === 3) {
                if (parts[0] > 1900) {
                  const [y, m, d] = parts;
                  return new Date(y, m - 1, d);
                }
                const [d, m, y] = parts;
                return new Date(y, m - 1, d);
              }
              const d = new Date(s);
              return isNaN(d.getTime()) ? null : d;
            };

            const toNumber = (s) => parseFloat((s || "").toString().replace(",", ".") || "0");

            const loadCsv = async () => {
              const res = await fetch(TCMB_REMOTE_CSV_URL);
              if (!res.ok) throw new Error("CSV fetch failed");
              const text = await res.text();
              const lines = text.trim().split(/\r?\n/);
              const headers = lines.shift().split(",").map(h => h.trim());
              return lines.map(line => {
                const cols = line.split(",");
                const obj = {};
                headers.forEach((h, i) => obj[h] = (cols[i] || "").trim());
                return obj;
              }).filter(r => r.TARIH);
            };

            const loadJson = async (url) => {
              if (!url) throw new Error("No JSON url");
              const res = await fetch(url);
              if (!res.ok) throw new Error("JSON fetch failed");
              const json = await res.json();
              return Array.isArray(json) ? json : [];
            };

            try {
              let rows = [];
              try {
                rows = await loadCsv();
              } catch (csvErr) {
                // Önce yerel (same-origin) json, olmazsa raw link
                const fallbacks = [TCMB_FALLBACK_JSON_URL, TCMB_RAW_JSON_URL];
                for (const url of fallbacks) {
                  try {
                    rows = await loadJson(url);
                    if (rows.length) break;
                  } catch (err) {
                    // continue to next fallback
                  }
                }
              }

              if (!rows.length) {
                return { date: dateSel || formatTcmbDate(new Date()), items: [] };
              }

              // İstenen tarih dd-mm-yyyy formatına çevrilip aranır;
              // yoksa istenen tarihten önceki en yakın tarih, o da yoksa en son tarih kullanılır
              rows.sort((a, b) => (parseDate(a.TARIH) || 0) - (parseDate(b.TARIH) || 0));
              let chosen = null;
              if (dateSel) {
                const selDate = parseDate(dateSel);
                if (selDate) {
                  const same = rows.find(r => r.TARIH === dateSel);
                  if (same) {
                    chosen = same;
                  } else {
                    const firstD = parseDate(rows[0].TARIH);
                    const lastD = parseDate(rows[rows.length - 1].TARIH);
                    if (firstD && selDate.getTime() < firstD.getTime()) {
                      chosen = rows[0]; // çok eskiye giderse ilk kayıt
                    } else if (lastD && selDate.getTime() > lastD.getTime()) {
                      chosen = rows[rows.length - 1]; // ileri ise son kayıt
                    } else {
                      const before = rows.filter(r => {
                        const d = parseDate(r.TARIH);
                        return d && d.getTime() <= selDate.getTime();
                      });
                      if (before.length) chosen = before[before.length - 1];
                    }
                  }
                }
              }
              if (!chosen) chosen = rows[rows.length - 1];

              const items = TCMB_CODES.map(code => ({
                code: `${code}/TRY`,
                name: TCMB_CODE_NAMES[code] || friendlyCurrencyName(code) || code,
                unit: 1,
                buying: toNumber(chosen[`${code}_ALIS`]),
                selling: toNumber(chosen[`${code}_SATIS`]),
                bankBuy: null,
                bankSell: null
              })).filter(x => x.buying || x.selling);

              return { date: chosen.TARIH, items };
            } catch (e) {
              return { date: dateSel || formatTcmbDate(new Date()), items: [] };
            }
          }

  },
  {
    id: "airquality",
    title: { tr: "Hava Kalitesi", en: "Air Quality" },
    subtitle: { tr: "Populer: Istanbul", en: "Popular: Istanbul" },
    image: "https://meersens.com/wp-content/uploads/2022/03/VISUEL-BLOG-Meteo.jpg",
    popularQuery: "",
    fetcher: async () => ({})
  },
  {
    id: "mealspin",
    title: { tr: "Rastgele Tarif", en: "Random Meal" },
    subtitle: { tr: "TheMealDB", en: "TheMealDB" },
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    popularQuery: "",
    fetcher: async () => ({})
  },
  {
    id: "art",
    title: { tr: "Sanat Galerisi", en: "Art Gallery" },
    subtitle: { tr: "Harvard", en: "Harvard" },
    image: "https://artistsgallery.co.za/wp-content/uploads/2025/02/mobile.jpg",
    popularQuery: "",
    fetcher: async () => ({})
  },
  {
    id: "anichart",
    title: { tr: "Anime Takvimi", en: "Anime Schedule" },
    subtitle: { tr: "AniList sezon listesi", en: "AniList seasonal list" },
    image: "https://i0.wp.com/highschool.latimes.com/wp-content/uploads/2021/02/anime-small-1000x667-1.jpg?fit=1000%2C667&ssl=1&w=640",
    popularQuery: "",
    fetcher: async () => ({})
  },
  {
    id: "wizard",
    title: { tr: "Wizard World", en: "Wizard World" },
    subtitle: { tr: "Büyüler, iksirler", en: "Spells, elixirs" },
    image: "https://scontent.fist20-2.fna.fbcdn.net/o1/v/t0/f2/m421/AQMYGdfDFEcGJ4-wSz6wMbDc7WwCWhmRXHAeyZ08wt6MXN9IwS7Z1f0GUw9wLnn9O00RISujsuoNOZUNQR5JkVLrkwbclridmWc-7rXAXFRDp0AJEbwgJvUIz-E6sjA2.jpeg?_nc_ht=scontent.fist20-2.fna.fbcdn.net&_nc_gid=cobeVLePq8yR_UlyrsYKYQ&_nc_cat=111&_nc_oc=Adk3ccG9kHkLJotR8y_lDu6j0Db_sHCQ0XGVvif19n85HhuT4NyNeaO4ibs-NE0BaCU&ccb=9-4&oh=00_Afi1DvZ2Do5q1pwPavredbDTTlgQLuRuuy0qtleWE1RTzg&oe=692820F8&_nc_sid=5b3566",
    popularQuery: "",
    fetcher: async () => ({})
  },
  {
    id: "rps",
    title: { tr: "RPS-25 Lokal", en: "RPS-25 Local" },
    subtitle: { tr: "API yok, 25 hamle", en: "Offline 25-move game" },
    image: "https://scontent.fist20-2.fna.fbcdn.net/o1/v/t0/f2/m421/AQPj_OsU7YpE9XPdzkuMeMyNq3eumEJEi6MYqyhE5RbvoDcfB2bylAG83e7wPw2ysCi0225SQmTy-466gOdVO1dQUbZ5MxF5NQNQmwD0fcKXj8JBnViFywND9mRq4_g.jpeg?_nc_ht=scontent.fist20-2.fna.fbcdn.net&_nc_gid=zNTbqmt1efSCYWjODJqnkw&_nc_cat=100&_nc_oc=AdlZKHGTd0nxW4tR8xjkcN9xq-2n3K9hBJThPjKMeLST55La9zYcbJrygr9YCc2PR7U&ccb=9-4&oh=00_AfiLOFPbrSTg1QgK0f6h1JeooIlHdyxXaIdeASy9cILdXw&oe=692807F6&_nc_sid=5b3566",
    popularQuery: "",
    fetcher: async () => ({})
  },
  {
    id: "music",
    title: { tr: "Müzik Çalar", en: "Music" },
    subtitle: { tr: "iTunes preview", en: "iTunes preview" },
    image: "https://scontent.fist20-2.fna.fbcdn.net/o1/v/t0/f2/m340/AQNLbfs0fX0z2dYctKUGtxppTB1nue39GomWmtOGBQbeLL4gmSV8Rz28e8shfzH-yJ0ncxiO3uw6G5wQkJv0NB2eLuBDr8KbllQttbqwImY2mm_JUl8e-_qjd6dUL1WRFyP9FcCIKKQTmj77sG-Qs8Je7wAYrg.jpeg?_nc_ht=scontent.fist20-2.fna.fbcdn.net&_nc_gid=tRMeSii4SslqdAoFTbM23Q&_nc_cat=111&_nc_oc=AdkaH_s_rq4x1UKkXET9Q2HsCjtAIXq8fuNTpgBXFPgKaJ8uwR_4Od9HUOQJG-RbAqw&ccb=9-4&oh=00_AfiXKPF79_7ir0nYF3IbUjJzxvPevDtKImKoBdWQuEmOIw&oe=6928111A&_nc_sid=5b3566",
    popularQuery: "",
    fetcher: async () => ({})
  },
  {
    id: "news",
    title: { tr: "Haber + Trend", en: "News + Trends" },
    subtitle: { tr: "Populer: bitcoin", en: "Popular: bitcoin" },
    image: "https://newscorp.com/app/uploads/2021/04/homepage-wallstreetjournal.jpg",
    popularQuery: "bitcoin",
    fetcher: async (query) => {
      const q = query || "bitcoin";
      const url = `https://api.spaceflightnewsapi.net/v4/articles/?limit=5&search=${encodeURIComponent(q)}`;
      const fallback = [
        { title: "Yeni firlatma penceresi aciklandi", site: "Haber", url: "#" },
        { title: "Uydu internetinde hiz rekoru", site: "Haber", url: "#" },
        { title: "Ay ussu icin moduler plan", site: "Haber", url: "#" }
      ];
      try {
        const res = await fetch(url);
        const json = await res.json();
        const items = json?.results?.slice(0,5).map(a => ({
          title: a.title,
          site: a.news_site,
          url: a.url
        }));
        if (!items) return fallback;
        if (state.lang === "tr") {
          const translated = await translateBatch(items.map(i => i.title), "tr");
          translated.forEach((t, idx) => items[idx].title = t);
        }
        return items;
      } catch (e) { return fallback; }
    }
  },
  {
    id: "recipes",
    title: { tr: "Tarif + Besin", en: "Recipes" },
    subtitle: { tr: "Populer: chicken", en: "Popular: chicken" },
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    popularQuery: "chicken",
    fetcher: async (query) => {
      const q = query || "chicken";
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`;
      const fallback = [
        { id: "1", name: "Izgara Tavuk", area: "Mediterranean", tag: "protein", link: "#", instructions: "Izgarada pisir, baharatla." }
      ];
      try {
        const res = await fetch(url);
        const json = await res.json();
        const meals = json?.meals?.slice(0,5).map(m => ({
          id: m.idMeal,
          name: m.strMeal,
          area: m.strArea,
          tag: m.strCategory,
          link: m.strSource || m.strYoutube || "#",
          thumb: m.strMealThumb
        }));
        if (meals && state.lang === "tr") {
          const translated = await translateBatch(meals.map(m => m.name), "tr");
          translated.forEach((t, idx) => meals[idx].name = t);
        }
        return meals ?? fallback;
      } catch (e) { return fallback; }
    },
    fetchDetail: async (id) => {
      const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        const m = json?.meals?.[0];
        if (!m) return null;
        return {
          name: m.strMeal,
          instructions: m.strInstructions,
          video: m.strYoutube,
          source: m.strSource
        };
      } catch (e) { return null; }
    }
  },
  {
    id: "movies",
    title: { tr: "Dizi Gezgini", en: "Shows" },
    subtitle: { tr: "Populer: Lost", en: "Popular: Lost" },
    image: "https://preview.redd.it/please-recommend-me-some-good-tv-series-v0-bti4zwzgziac1.jpeg?width=1080&crop=smart&auto=webp&s=3c883c1e074374a88543d902742dbd06e05192e0",
    popularQuery: "",
    fetcher: async (query) => {
      const q = (query || "").trim();
      const fallback = [
        { id: "cosmos", name: "Cosmos", rating: 8.5, genre: "Sci-Fi", summary: "Space documentary.", url: "#" }
      ];
      try {
        const tvUrl = q ? `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}` : "https://api.tvmaze.com/shows?page=1";
        const res = await fetch(tvUrl);
        const json = await res.json();
        const shows = (q ? json.map(s => s.show) : json.slice(0, 80)) || [];
        if (!shows.length) return fallback;
        const mapped = shows.map(show => ({
          id: `tv-${show.id}`,
          name: show.name,
          rating: show.rating?.average || 0,
          genre: show.genres?.[0] || "Genre",
          summary: show.summary || "",
          url: show.url || show.officialSite || "#",
          type: "show"
        })).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 24);
        if (state.lang === "tr") {
          const names = await translateBatch(mapped.map(m => m.name), "tr");
          names.forEach((t, i) => mapped[i].name = t);
          const sums = await translateBatch(mapped.map(m => (m.summary || "").replace(/<[^>]+>/g, "")), "tr");
          sums.forEach((t, i) => mapped[i].summary = t);
        }
        return mapped;
      } catch (e) { return fallback; }
    }
  },
  {
    id: "books",
    title: { tr: "Kitap Kesfi", en: "Books" },
    subtitle: { tr: "Populer: python", en: "Popular: python" },
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    popularQuery: "",
    fetcher: async (query) => {
      const q = (query || "").trim();
      const curated = [
        { title: "Kurk Mantolu Madonna", author: "Sabahattin Ali", year: 1943, rating: 5, url: "" },
        { title: "Tutunamayanlar", author: "O\u011fuz Atay", year: 1971, rating: 5, url: "" },
        { title: "Simyaci", author: "Paulo Coelho", year: 1988, rating: 4.5, url: "" },
        { title: "Sefiller", author: "Victor Hugo", year: 1862, rating: 4.8, url: "" }
      ];
      if (!q) return curated;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&orderBy=relevance&maxResults=20&langRestrict=tr,en`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        const mapped = (json?.items || []).map(it => ({
          title: it.volumeInfo?.title,
          author: it.volumeInfo?.authors?.[0] || "Unknown",
          year: it.volumeInfo?.publishedDate || "?",
          rating: it.volumeInfo?.averageRating ?? -1,
          url: it.volumeInfo?.infoLink || ""
        })) || [];
        const rated = mapped.filter(b => (b.rating ?? -1) >= 4);
        let finalList = rated.length ? rated.sort((a, b) => (b.rating || -1) - (a.rating || -1)).slice(0, 12)
          : mapped.length ? mapped.slice(0, 10) : [];
        if (state.lang === "tr" && finalList.length) {
          const titles = await translateBatch(finalList.map(b => b.title || ""), "tr");
          titles.forEach((t, i) => finalList[i].title = t);
        }
        return finalList;
      } catch (e) { /* ignore */ }
      return curated;
    }
  },
  {
    id: "space",
    title: { tr: "NASA APOD", en: "NASA APOD" },
    subtitle: { tr: "Gunluk astronomi gorseli", en: "Astronomy Picture of the Day" },
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=80",
    popularQuery: "",
    fetcher: async () => ({})
  },
  {
    id: "travel",
    title: { tr: "Seyahat Planlayici", en: "Travel Planner" },
    subtitle: { tr: "Populer: Europe", en: "Popular: Europe" },
    image: "https://scontent.fist20-2.fna.fbcdn.net/o1/v/t0/f2/m248/AQPSSz2_zOB2b1itaTIIXoUVdXY0nHaD19_XD9N7OQKrTuOSwRCmBNnB7injObsP7FXTLWhTTNGPXXChY4UmkXKf2QhLTZ5HccGManq7A2UHi1hVcF344tLytVAaEzUs.jpeg?_nc_ht=scontent.fist20-2.fna.fbcdn.net&_nc_gid=vwklIYYiASZr8aig15BGGA&_nc_cat=111&_nc_oc=AdlxjNOLMDBARLtEAQZYhGbN0QHKR7Jwz8RKMPjoqigqbH-THG8XP9xiOMjqQEnh1Qg&ccb=9-4&oh=00_Afhlnezk4-Vk5eRjbrxPxWRTAcKIW7P4uU8cLlMDu2AvjA&oe=69283418&_nc_sid=5b3566",
    popularQuery: "Istanbul -> Berlin",
    fetcher: async (query, lang) => {
      const labels = copy[state.lang].labels;
      const parts = (query || "").split("->").map(s => s.trim()).filter(Boolean);
      if (parts.length < 2) {
        return { route: null, message: lang === "tr" ? "Lutfen 'Nereden -> Nereye' girin" : "Please enter 'From -> To'", countries: [] };
      }
      const [from, to] = parts;
      const geocode = async (place) => {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`, { headers: { "Accept-Language": lang === "tr" ? "tr" : "en" } });
        const json = await res.json();
        return json?.[0];
      };
      const fallback = { route: null, message: "No route", countries: [] };
      try {
        const a = await geocode(from);
        const b = await geocode(to);
        if (!a || !b) return { route: null, message: fallback.message, countries: [] };
        const osrm = await fetch(`https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`);
        const rjson = await osrm.json();
        const route = rjson?.routes?.[0];
        const distKm = route ? (route.distance / 1000).toFixed(1) : null;
        const driveMin = route ? Math.round(route.duration / 60) : null;
        const flyMin = distKm ? Math.round((distKm / 800) * 60) : null;
        const busMin = distKm ? Math.round((distKm / 80) * 60) : null;
        const trainMin = distKm ? Math.round((distKm / 110) * 60) : null;
        return {
          route: {
            from,
            to,
            distance: distKm,
            driving: driveMin,
            flying: flyMin,
            bus: busMin,
            train: trainMin
          },
          countries: []
        };
      } catch (e) { return fallback; }
    }
  },
  {
    id: "weather",
    title: { tr: "Hava Durumu", en: "Weather" },
    subtitle: { tr: "Populer: Istanbul", en: "Popular: Istanbul" },
    image: "https://static.independent.co.uk/2023/04/24/06/WEATHER%20Spring%20%2014550538.jpg",
    popularQuery: "Istanbul",
    fetcher: async (query, lang) => {
      const q = query || "Istanbul";
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=${lang}`;
      const fallback = {
        location: q,
        current: { temp: 18.4, wind: 12.1, rainChance: "30%" },
        today: { date: "Today", tmax: 20, tmin: 12 },
        tomorrow: { date: "Tomorrow", tmax: 21, tmin: 13 }
      };
      try {
        const geoRes = await fetch(geoUrl);
        const geo = await geoRes.json();
        const loc = geo?.results?.[0];
        const latitude = loc?.latitude ?? 41.01;
        const longitude = loc?.longitude ?? 28.97;
        const locName = loc?.name || q;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=precipitation_probability&daily=temperature_2m_max,temperature_2m_min&timezone=auto&language=${lang}`;
        const res = await fetch(url);
        const json = await res.json();
        return {
          location: locName,
          current: {
            temp: json?.current?.temperature_2m ?? fallback.current.temp,
            wind: json?.current?.wind_speed_10m ?? fallback.current.wind,
            rainChance: (json?.hourly?.precipitation_probability?.[0] ?? 30) + "%"
          },
          today: {
            date: json?.daily?.time?.[0] || fallback.today.date,
            tmax: json?.daily?.temperature_2m_max?.[0] ?? fallback.today.tmax,
            tmin: json?.daily?.temperature_2m_min?.[0] ?? fallback.today.tmin
          },
          tomorrow: {
            date: json?.daily?.time?.[1] || fallback.tomorrow.date,
            tmax: json?.daily?.temperature_2m_max?.[1] ?? fallback.tomorrow.tmax,
            tmin: json?.daily?.temperature_2m_min?.[1] ?? fallback.tomorrow.tmin
          }
        };
      } catch (e) { return fallback; }
    }
  },
  {
    id: "maps",
    title: { tr: "Harita / Yer Servisi", en: "Map / Places" },
    subtitle: { tr: "Populer: Berlin", en: "Popular: Berlin" },
    image: "https://scontent.fist20-2.fna.fbcdn.net/o1/v/t0/f2/m421/AQOL7V3D_MctQyyM1MJhYrb9t78jJBCFpF-_D7E87VssFJ_X7QAJufD93VhulN9E066mTHQNz_rcpSNY5L3SydSb0jVbvRiuRScIrTQSIt5-y6n97H1a3IyIFKAIkVbB.jpeg?_nc_ht=scontent.fist20-2.fna.fbcdn.net&_nc_gid=lfWTpmNdFXqNv1j-OADRzg&_nc_cat=106&_nc_oc=AdnYOJPI7HJ67Y7kUKOBsogm9NLHIin1c6nTl1Crw-txypZEsBFZu0sjlpbVvTdoAhs&ccb=9-4&oh=00_AfgO1TOHMtYuQhc7Dt2wIYuuPmL8jq2V4q18Z9UkqO0QMQ&oe=69282D1F&_nc_sid=5b3566",
    popularQuery: "Berlin",
    fetcher: async (query, lang) => {
      const q = query || "Berlin";
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=4`;
      const fallback = [
        { display: "Berlin, Germany", lat: "52.52", lon: "13.40" }
      ];
      try {
        const res = await fetch(url, { headers: { "Accept-Language": lang === "tr" ? "tr" : "en" } });
        const json = await res.json();
        return json?.slice(0,4).map(p => ({
          display: p.display_name,
          lat: p.lat,
          lon: p.lon
        })) ?? fallback;
      } catch (e) { return fallback; }
    }
  },
// Sports cache and helper
{
  id: "sports",
  title: { tr: "Mac Skorlari", en: "Match Scores" },
  subtitle: { tr: "Bugun: Avrupa + TR", en: "Today: Europe + TR" },
  image: "https://cdn.britannica.com/51/190751-050-147B93F7/soccer-ball-goal.jpg",
  popularQuery: "soccer",
  fetcher: async () => {
    const appRef = apps.find(a => a.id === "sports");
    const systemToday = new Date();
    const clampSportsDate = (d) => {
      const min = new Date(systemToday.getTime()); min.setDate(min.getDate() - 1);
      const max = new Date(systemToday.getTime()); max.setDate(max.getDate() + 1);
      if (d.getTime() < min.getTime()) return min;
      if (d.getTime() > max.getTime()) return max;
      return d;
    };
    if (!appRef._date) appRef._date = new Date(systemToday.getTime());
    appRef._date = clampSportsDate(new Date(appRef._date.getTime()));
    const targetDate = localDateStr(appRef._date);
    const apiFootballKey = (typeof window !== "undefined" && window.API_FOOTBALL_KEY) ? window.API_FOOTBALL_KEY : API_FOOTBALL_KEY;
    if (sportsCache.byDate[targetDate]?.fetched) return sportsCache.byDate[targetDate].items;
    if (!apiFootballKey) return [];
    try {
      const res = await fetch(`https://v3.football.api-sports.io/fixtures?date=${targetDate}`, {
        headers: {
          "x-rapidapi-key": apiFootballKey,
          "x-rapidapi-host": "v3.football.api-sports.io"
        }
      });
      const json = await res.json();
      const items = (json?.response || []).map(fixt => {
        const name = `${fixt.teams?.home?.name || ""} vs ${fixt.teams?.away?.name || ""}`;
        const rawDate = fixt.fixture?.date;
        const dateStr = rawDate ? localDateStr(new Date(rawDate)) : targetDate;
        const timeStr = toUTC3(rawDate);
        const statusCode = (fixt.fixture?.status?.short || "").toUpperCase();
        const live = ["1H","2H","ET","HT","P","LIVE"].includes(statusCode);
        return {
          id: `af-${fixt.fixture?.id}`,
          name,
          league: fixt.league?.name || "",
          leagueId: fixt.league?.id,
          country: fixt.league?.country || "",
          time: timeStr,
          status: fixt.fixture?.status?.long || fixt.fixture?.status?.short || "NS",
          venue: fixt.fixture?.venue?.name || "",
          url: fixt.fixture?.timezone ? `#${fixt.fixture?.id}` : "#",
          live,
          date: dateStr,
          detail: {
            score: `${fixt.goals?.home ?? "-"} : ${fixt.goals?.away ?? "-"}`,
            home: fixt.teams?.home?.name,
            away: fixt.teams?.away?.name,
            venue: fixt.fixture?.venue?.name || "",
            status: fixt.fixture?.status?.long || fixt.fixture?.status?.short || "",
            time: timeStr,
            lineup: [
              fixt.fixture?.referee ? `Hakem: ${fixt.fixture?.referee}` : "",
              fixt.fixture?.status?.elapsed ? `Dakika: ${fixt.fixture?.status?.elapsed}` : ""
            ].filter(Boolean).join("<br>")
          }
        };
      }).filter(Boolean);
      sportsCache.byDate[targetDate] = { items, fetched: true };
      return items;
    } catch (e) { return []; }
  },
  fetchDetail: async (id) => {
    const cached = [];
    Object.values(sportsCache.byDate || {}).forEach(v => { if (v?.items) cached.push(...v.items); });
    const entryCached = cached.find(m => m.id === id);
    return entryCached?.detail || null;
  }
},
{
    id: "currency",
    title: { tr: "Kur / Doviz", en: "FX Rates" },
    subtitle: { tr: "Populer: USD baz", en: "Popular: USD base" },
    image: "https://stratejikortak.com/wp-content/uploads/2020/05/doviz-kurlari-nasil-belirlenir.jpg",
    popularQuery: "USD",
    fetcher: async (query) => {
          const base = (query || "USD").toUpperCase();
          const date = (typeof apps !== "undefined" && apps.find(a => a.id === "currency")?._date) || "";
          const useHistorical = isValidPastDate(date);
          const endpoint = useHistorical ? `https://api.frankfurter.app/${date}` : "https://api.frankfurter.app/latest";
          const url = endpoint;
          const fallback = { base, rates: { USD: 1 }, date: useHistorical ? date : "latest" };
          try {
            const res = await fetch(url);
            const json = await res.json();
            const eurRates = json?.rates || {};
            const baseRate = base === "EUR" ? 1 : eurRates[base];
            if (!baseRate) return fallback;
            const converted = Object.entries(eurRates).reduce((acc, [k, v]) => {
              acc[k] = (v / baseRate);
              return acc;
            }, {});
            converted["EUR"] = 1 / baseRate;
            converted[base] = 1;
            return {
              base,
              rates: converted,
              date: json?.date || (useHistorical ? date : "latest")
            };
          } catch (e) { return fallback; }
        }
      },
  {
    id: "calc",
    title: { tr: "Hesaplamalar", en: "Calculators" },
    subtitle: { tr: "", en: "" },
    image: "https://www.freshbooks.com/wp-content/uploads/2022/04/calculate-depreciation.jpg",
    popularQuery: "",
    fetcher: async () => ({ date: new Date().toISOString().split("T")[0] })
  },
  
  {
    id: "quakes",
    title: { tr: "Depremler", en: "Earthquakes" },
    subtitle: { tr: "USGS son depremler", en: "USGS latest" },
    image: "https://scontent.fist20-2.fna.fbcdn.net/o1/v/t0/f2/m421/AQNX5UXJMHcy-tPClwKVDMMm4YkShEYchwIb_hWt8D1mCErxf1IzORrHnoi4sPViPTPBSK7z3IUNfK_Vs57qyNQ6fFbs5QY1RwphweZxfgj78KzpIBoWQiQyJZg9_Pu0.jpeg?_nc_ht=scontent.fist20-2.fna.fbcdn.net&_nc_gid=ojXcK9xRDM6_1VvQDtNnCw&_nc_cat=103&_nc_oc=AdlPoe9gWPqeyqEpTdhNJfJUb5z0893rHZ6rIRjiJMQF6ivL-pzdIzfGo8WKsBFowHo&ccb=9-4&oh=00_AfigrqRcFvBNaqRgcZnCXDoOfbUGC5R8j1CWPUuzJnI11A&oe=6928322C&_nc_sid=5b3566",
    popularQuery: "",
    fetcher: async () => ({})
  }
];

const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalSub = document.getElementById("modal-sub");
const modalContent = document.getElementById("modal-content");
const closeBtn = document.getElementById("close");
const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");

const langButtons = document.querySelectorAll(".pill[data-lang]");
langButtons.forEach(btn => btn.addEventListener("click", () => {
  state.lang = btn.dataset.lang;
  document.documentElement.lang = state.lang;
  langButtons.forEach(b => b.classList.toggle("active", b === btn));
  applyLang();
}));

function applyLang() {
  const c = copy[state.lang];
  titleEl.textContent = c.title;
  subtitleEl.textContent = c.subtitle;
  grid.querySelectorAll(".card").forEach(card => {
    const app = apps.find(a => a.id === card.dataset.id);
    card.querySelector(".card-title").textContent = app.title[state.lang];
    card.setAttribute("title", app.subtitle[state.lang]);
  });
}

function buildGrid() {
  apps.forEach(app => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = app.id;
    card.style.setProperty("--img", `url(${app.image})`);
    card.style.setProperty("background", `var(--card) url(${app.image}) center/cover no-repeat`);

    const pulse = document.createElement("div");
    pulse.className = "pulse";

    const content = document.createElement("div");
    content.className = "card-content";
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = app.title[state.lang];
    content.appendChild(title);

    card.appendChild(pulse);
    card.appendChild(content);
    card.setAttribute("title", app.subtitle[state.lang]);
    card.addEventListener("mouseenter", () => card.animate([{ transform: "translateY(0)" }, { transform: "translateY(-4px)" }], { duration: 300, fill: "forwards" }));
    card.addEventListener("mouseleave", () => card.animate([{ transform: "translateY(-4px)" }, { transform: "translateY(0)" }], { duration: 250, fill: "forwards" }));
    card.addEventListener("click", () => {
      const pageMap = {
        sports: "pages/sports.html",
        tcmb: "pages/tcmb.html",
        weather: "pages/weather.html",
        currency: "pages/currency.html",
        news: "pages/news.html",
        recipes: "pages/recipes.html",
        books: "pages/books.html",
        movies: "pages/shows.html",
        space: "pages/space.html",
        mars: "pages/mars.html",
        neows: "pages/neows.html",
        donki: "pages/donki.html",
        eonet: "pages/eonet.html",
        travel: "pages/travel.html",
        maps: "pages/maps.html",
        calc: "pages/calc.html",
        travelPlan: "pages/travel.html",
        about: "pages/about.html",
        airquality: "pages/airquality.html",
        earth: "pages/earth.html",
        mealspin: "pages/mealspin.html",
        art: "pages/art.html",
        jokes: "pages/jokes.html",
        anichart: "pages/anichart.html",
        wizard: "pages/wizard.html",
        rps: "pages/rps.html",
        music: "pages/music.html",
        quakes: "pages/quakes.html",
        comicvine: "pages/comicvine.html"
      };
      const target = pageMap[app.id];
      if (target) {
        window.location.href = target;
      } else {
        window.location.href = `index.html?app=${app.id}`;
      }
    });

    grid.appendChild(card);
  });
}

buildGrid();
applyLang();

// URL parametresiyle belirli modalı aç
setTimeout(() => {
  const params = new URLSearchParams(window.location.search);
  const openId = params.get("app");
  if (openId) {
    const app = apps.find(a => a.id === openId);
    if (app) openModal(app);
  }
}, 300);

function renderList(items, mapper) {
  return `<ul class="data">${items.map(mapper).join("")}</ul>`;
}

function translateLocation(str) {
  if (state.lang !== "tr") return str;
  return str.replace(/Remote/gi, "Uzaktan").replace(/On-site/gi, "Ofis");
}

function friendlyCurrencyName(code) {
  if (currencyNames[code]) return currencyNames[code];
  return null;
}

function formatDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Sports cache and helper (used across fetch/render)
const sportsCache = { byDate: {} };
const SPORTS_COUNTRIES = [
  { key: "world", label: "World", flag: null },
  { key: "Turkey", label: "Türkiye", flag: "https://flagcdn.com/24x18/tr.png" },
  { key: "England", label: "England", flag: "https://flagcdn.com/24x18/gb-eng.png" },
  { key: "Spain", label: "Spain", flag: "https://flagcdn.com/24x18/es.png" },
  { key: "Germany", label: "Germany", flag: "https://flagcdn.com/24x18/de.png" },
  { key: "France", label: "France", flag: "https://flagcdn.com/24x18/fr.png" },
  { key: "Italy", label: "Italy", flag: "https://flagcdn.com/24x18/it.png" },
  { key: "Portugal", label: "Portugal", flag: "https://flagcdn.com/24x18/pt.png" },
  { key: "Netherlands", label: "Netherlands", flag: "https://flagcdn.com/24x18/nl.png" },
  { key: "Belgium", label: "Belgium", flag: "https://flagcdn.com/24x18/be.png" },
  { key: "Scotland", label: "Scotland", flag: "https://flagcdn.com/24x18/gb-sct.png" },
  { key: "Greece", label: "Greece", flag: "https://flagcdn.com/24x18/gr.png" },
  { key: "Austria", label: "Austria", flag: "https://flagcdn.com/24x18/at.png" },
  { key: "Switzerland", label: "Switzerland", flag: "https://flagcdn.com/24x18/ch.png" },
  { key: "Denmark", label: "Denmark", flag: "https://flagcdn.com/24x18/dk.png" },
  { key: "Sweden", label: "Sweden", flag: "https://flagcdn.com/24x18/se.png" },
  { key: "Norway", label: "Norway", flag: "https://flagcdn.com/24x18/no.png" },
  { key: "Poland", label: "Poland", flag: "https://flagcdn.com/24x18/pl.png" },
  { key: "Czech Republic", label: "Czech Republic", flag: "https://flagcdn.com/24x18/cz.png" },
];
const SPORTS_ALLOWED_COUNTRIES = SPORTS_COUNTRIES.filter(c => c.key !== "world").map(c => c.key);
const SPORTS_FILTER_BUTTONS = ["world", "allowed", "Others", ...SPORTS_ALLOWED_COUNTRIES];
const LEAGUE_ORDER = {
  Turkey: ["Süper Lig", "Super Lig", "1. Lig"],
  England: ["Premier League", "Championship", "League One", "League Two"],
  Spain: ["La Liga", "La Liga 2"],
  Germany: ["Bundesliga", "2. Bundesliga"],
  France: ["Ligue 1", "Ligue 2"],
  Italy: ["Serie A", "Serie B"],
  Portugal: ["Primeira Liga", "Segunda Liga"],
  Netherlands: ["Eredivisie", "Eerste Divisie"],
  Belgium: ["First Division A", "First Division B"],
  Scotland: ["Premiership", "Championship"],
  Greece: ["Super League"],
  Austria: ["Bundesliga", "2. Liga"],
  Switzerland: ["Super League", "Challenge League"],
  Denmark: ["Superliga", "1st Division"],
  Sweden: ["Allsvenskan", "Superettan"],
  Norway: ["Eliteserien", "OBOS-ligaen"],
  Poland: ["Ekstraklasa", "I Liga"],
  "Czech Republic": ["First League", "National Football League"]
};

function filterOutWomen(arr) {
  const isWomen = (str) => (str || "").toLowerCase().includes("women");
  return arr.filter(m => !isWomen(m.league) && !isWomen(m.name));
}

function groupSportsByCountry(arr) {
  const cleaned = filterOutWomen(arr);
  return cleaned.reduce((acc, m) => {
    const country = m.country || "Other";
    const league = m.league || "League";
    acc[country] = acc[country] || {};
    acc[country][league] = acc[country][league] || [];
    acc[country][league].push(m);
    return acc;
  }, {});
}

function sortLeagues(country, leaguesObj) {
  const order = LEAGUE_ORDER[country] || [];
  const idx = (name) => {
    const i = order.findIndex(o => o.toLowerCase() === name.toLowerCase());
    return i === -1 ? 999 : i;
  };
  return Object.entries(leaguesObj).sort((a, b) => {
    const ia = idx(a[0]);
    const ib = idx(b[0]);
    if (ia !== ib) return ia - ib;
    return a[0].localeCompare(b[0]);
  });
}

async function openSportsFullPage() {
  const appRef = apps.find(a => a.id === "sports");
  const apiKey = (typeof window !== "undefined" && window.API_FOOTBALL_KEY) ? window.API_FOOTBALL_KEY : API_FOOTBALL_KEY;
  if (!apiKey) {
    alert("API key yok: API_FOOTBALL_KEY");
    return;
  }
  // veriyi hazırla (mevcut gün)
  await apps.find(a => a.id === "sports").fetcher();
  const dateLabel = localDateStr(appRef._date || new Date());
  const allByDate = appRef._allSportsByDate || {};
  const allSports = filterOutWomen(allByDate[dateLabel] || []);
  const metaCountries = SPORTS_COUNTRIES;
  const allowedCountries = SPORTS_ALLOWED_COUNTRIES;
  const leagueOrder = LEAGUE_ORDER;
  const todayStr = formatDateStr(new Date());
  const initialJson = JSON.stringify(allSports);
  const metaJson = JSON.stringify(metaCountries);
  const allowedJson = JSON.stringify(allowedCountries);
  const leagueOrderJson = JSON.stringify(leagueOrder);

  const htmlFull = `
<!doctype html><html><head><meta charset="utf-8"><title>Matches ${dateLabel}</title>
<style>
  :root { --bg:#0b1221; --card:#111a2f; --accent:#22d3ee; --muted:#94a3b8; }
  *{box-sizing:border-box;}
  body{margin:0;font-family:"Inter",Arial,sans-serif;background:radial-gradient(circle at 20% 20%,rgba(34,211,238,0.1),transparent 30%),linear-gradient(135deg,#0b1221,#0f172a);color:#e5e7eb;padding:22px;}
  h1{margin:0 0 6px;font-size:22px;letter-spacing:0.4px;}
  .bar{display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap;}
  button.country{border:1px solid #1f2937;background:#0f172a;color:#e5e7eb;padding:8px 12px;border-radius:12px;cursor:pointer;transition:all .2s;}
  button.country.active{background:rgba(34,211,238,0.15);border-color:#22d3ee;}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px;}
  .group{background:var(--card);border:1px solid #1e293b;border-radius:12px;padding:12px;box-shadow:0 10px 40px rgba(0,0,0,0.35);}
  .group h3{margin:0 0 8px;font-size:15px;color:#cbd5e1;display:flex;align-items:center;gap:8px;}
  .flag{width:18px;height:12px;object-fit:cover;border:1px solid #1e293b;border-radius:3px;}
  .league{margin:8px 0 4px;font-weight:600;color:#e2e8f0;}
  ul{padding-left:16px;margin:0;}
  li{margin:4px 0;cursor:pointer;}
  .status-live{color:#22d3ee;}
  .pill{display:inline-block;background:rgba(34,211,238,0.12);color:#7dd3fc;padding:4px 8px;border-radius:10px;font-size:11px;border:1px solid rgba(34,211,238,0.3);}
  .detail{font-size:12px;color:var(--muted);margin-top:2px;display:none;}
  .topbar{display:flex;align-items:center;gap:8px;margin:8px 0;}
</style>
</head><body>
  <div class="topbar">
    <button id="prevDay" class="country">Prev</button>
    <button id="nextDay" class="country">Next</button>
    <strong id="dateLabel">${dateLabel}</strong>
  </div>
  <div class="bar" id="filterBar">
    <button class="country" data-filter="allowed">Allowed</button>
    <button class="country" data-filter="world">World</button>
    <button class="country" data-filter="others">Others</button>
    ${metaCountries.filter(c=>c.key!=="world").map(c=>'<button class="country" data-filter="'+c.key+'">'+(c.label||c.key)+'</button>').join("")}
  </div>
  <div id="status" style="margin:6px 0;color:#cbd5e1;"></div>
  <div class="grid" id="groups"></div>
<script>
  const apiKey = "${apiKey}";
  const allowed = new Set(${allowedJson});
  const meta = ${metaJson};
  const leagueOrder = ${leagueOrderJson};
  const allowedLower = Array.from(allowed).map(x=>x.toLowerCase());
  const today = "${todayStr}";
  let currentDate = "${dateLabel}";
  let currentFilter = "allowed";
  let all = ${initialJson};

  function formatDate(d){
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), day=String(d.getDate()).padStart(2,"0");
    return y+"-"+m+"-"+day;
  }
  function clampDate(str){
    const base=new Date(today);
    const min=new Date(base.getTime()); min.setDate(min.getDate()-1);
    const max=new Date(base.getTime()); max.setDate(max.getDate()+1);
    const d=new Date(str);
    if (d.getTime()<min.getTime()) return formatDate(min);
    if (d.getTime()>max.getTime()) return formatDate(max);
    return formatDate(d);
  }
  function isWomen(str){ return (str||"").toLowerCase().includes("women"); }
  function matchCountry(country, filter){
    const f = (filter || "allowed").toLowerCase();
    const c=(country||"").toLowerCase();
    const isWorld = c.includes("world") || c.includes("international");
    if (f==="world") return isWorld;
    if (f==="others") return !allowedLower.includes(c) && !isWorld;
    if (f==="allowed") return allowedLower.includes(c);
    return c === f;
  }
  function group(data, filter){
    const cleaned = data.filter(m => !isWomen(m.league) && !isWomen(m.name)).filter(m => matchCountry(m.country, filter));
    const obj = {};
    cleaned.forEach(m=>{
      const country=m.country||"Other";
      const league=m.league||"League";
      obj[country]=obj[country]||{};
      obj[country][league]=obj[country][league]||[];
      obj[country][league].push(m);
    });
    return obj;
  }
  function sortLeagues(country, leaguesObj){
    const order = leagueOrder[country] || [];
    const idx = (name) => { const i=order.findIndex(o=>o.toLowerCase()===name.toLowerCase()); return i===-1?999:i; };
    return Object.entries(leaguesObj).sort((a,b)=>{ const ia=idx(a[0]), ib=idx(b[0]); if(ia!==ib) return ia-ib; return a[0].localeCompare(b[0]); });
  }
  function countryOrderKey(c){
    const idx = meta.findIndex(x=>x.key===c);
    return idx === -1 ? 999 : idx;
  }
  function render(filter){
    currentFilter = filter;
    let grouped = group(all, filter);
    if (!Object.keys(grouped).length && all.length) {
      grouped = group(all, "allowed");
    }
    const groupsEl=document.getElementById('groups');
    const statusEl=document.getElementById('status');
    groupsEl.innerHTML="";
    if (!Object.keys(grouped).length) {
      statusEl.textContent = "Bu tarihte veri bulunamadı.";
      return;
    } else {
      statusEl.textContent = "";
    }
    Object.entries(grouped).sort((a,b)=>countryOrderKey(a[0])-countryOrderKey(b[0]) || a[0].localeCompare(b[0])).forEach(([country, leagues])=>{
      const metaCountry = meta.find(x=>x.key===country);
      const flagSrc = (metaCountry && metaCountry.flag) || (country ? 'https://flagcdn.com/24x18/'+country.slice(0,2).toLowerCase()+'.png' : '');
      const flagImg = flagSrc ? '<img class="flag" src="'+flagSrc+'" onerror="this.style.display=\\'none\\'">' : "";
      const total = Object.values(leagues).reduce((s,a)=>s+a.length,0);
      const htmlLeagues = sortLeagues(country, leagues).map(([lg, arr])=>{
        const items = arr.map((m,idx)=>{
          const detail = m.detail && m.detail.score
            ? "<div class=\\'detail\\'>"+m.detail.score+"<br>"+(m.detail.lineup || "")+"</div>"
            : "<div class=\\'detail\\'>"+(m.venue || "")+"</div>";
          return '<li class=\"'+(m.live ? 'status-live' : '')+'\" data-id=\"'+m.id+'-'+idx+'\"><strong>'+m.name+'</strong> - '+m.date+' - '+m.time+' - '+m.status+detail+'</li>';
        }).join("");
        return '<div class=\"league\">'+lg+' <span class=\"pill\">'+arr.length+'</span></div><ul>'+items+'</ul>';
      }).join("");
      const card=document.createElement('div');
      card.className='group';
      card.dataset.country=country;
      card.innerHTML='<h3>'+flagImg+'<span>'+((metaCountry&&metaCountry.label)||country)+'</span> <span class=\"pill\">'+total+' maç</span></h3>'+htmlLeagues;
      groupsEl.appendChild(card);
    });
    groupsEl.querySelectorAll('li').forEach(li=>{
      li.addEventListener('click',()=>{
        const d=li.querySelector('.detail');
        if(d){ d.style.display = d.style.display==='block'?'none':'block'; }
      });
    });
  }
  async function fetchDate(dateStr){
    const clamp = clampDate(dateStr);
    document.getElementById('dateLabel').textContent = clamp;
    const statusEl=document.getElementById('status');
    statusEl.textContent = "Veri yükleniyor...";
    try{
      const res = await fetch('https://v3.football.api-sports.io/fixtures?date='+clamp, { headers:{'x-rapidapi-key':apiKey,'x-rapidapi-host':'v3.football.api-sports.io'} });
      const json = await res.json();
      const items = (json?.response || []).map(fixt=>{
        const name=(fixt.teams?.home?.name||\"\")+\" vs \"+(fixt.teams?.away?.name||\"\");
        const rawDate=fixt.fixture?.date;
        const date=rawDate ? rawDate.slice(0,10) : clamp;
        const statusCode=(fixt.fixture?.status?.short||\"\").toUpperCase();
        const live=[\"1H\",\"2H\",\"ET\",\"HT\",\"P\",\"LIVE\"].includes(statusCode);
        return {
          id:'af-'+(fixt.fixture?.id||''),
          name,
          league:fixt.league?.name||'',
          leagueId:fixt.league?.id,
          country:fixt.league?.country||'',
          time: rawDate ? new Date(rawDate).toISOString().split('T')[1]?.slice(0,5) || '' : '',
          status: fixt.fixture?.status?.long || fixt.fixture?.status?.short || 'NS',
          venue: fixt.fixture?.venue?.name || '',
          live,
          date,
          detail:{
            score: (fixt.goals?.home ?? '-')+' : '+(fixt.goals?.away ?? '-'),
            home: fixt.teams?.home?.name,
            away: fixt.teams?.away?.name,
            venue: fixt.fixture?.venue?.name || '',
            status: fixt.fixture?.status?.long || fixt.fixture?.status?.short || '',
            time: rawDate ? new Date(rawDate).toISOString().split('T')[1]?.slice(0,5) || '' : ''
          }
        };
      }).filter(Boolean);
      all = items.filter(m => !isWomen(m.league) && !isWomen(m.name));
      currentDate = clamp;
      statusEl.textContent = "";
      render(currentFilter || "allowed");
    }catch(e){
      statusEl.textContent = "Veri çekilemedi: " + e;
      console.error(e);
    }
  }
  document.getElementById('prevDay').addEventListener('click',()=> {
    const d=new Date(currentDate); d.setDate(d.getDate()-1);
    const target=clampDate(formatDate(d));
    if (target===currentDate) return;
    fetchDate(target);
  });
  document.getElementById('nextDay').addEventListener('click',()=> {
    const d=new Date(currentDate); d.setDate(d.getDate()+1);
    const target=clampDate(formatDate(d));
    if (target===currentDate) return;
    fetchDate(target);
  });
  document.querySelectorAll('button.country').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('button.country').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.filter);
    });
  });
  const firstAllowed = document.querySelector('button[data-filter="allowed"]');
  if (firstAllowed) firstAllowed.classList.add('active');
  render("allowed");
  fetchDate(currentDate);
</script>
</body></html>
`;
  const w = window;
  w.document.open();
  w.document.write(htmlFull);
  w.document.close();
}
function toUTC3(timeStr) {
  if (!timeStr) return "";
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) return "";
  d.setHours(d.getHours() + 3);
  return d.toISOString().split("T")[1]?.slice(0,5) || "";
}
function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function isValidPastDate(str) {
  if (!str) return false;
  const d = new Date(str);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  return d.getTime() <= today.getTime();
}
function formatEvdsDate(str) {
  const d = new Date(str);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}-${mm}-${yy}`;
}
async function openModal(app) {
  modal.classList.add("active");
  modalTitle.textContent = app.title[state.lang];
  modalSub.textContent = app.subtitle[state.lang];
  modalContent.innerHTML = '<div class="loader"></div>';

  const wrapper = document.createElement("div");
  const searchBar = document.createElement("div");
  searchBar.className = "search-bar";

  if (app.id === "sports" || app.id === "tcmb") {
    const now = new Date();
    app._date = now;
    if (app.id === "sports" && !app._countryFilter) app._countryFilter = "allowed";
  }

  const input = (app.id === "sports" || app.id === "calc" || app.id === "tcmb") ? null : document.createElement("input");
  if (input) {
    input.placeholder = copy[state.lang].placeholders[app.id];
    input.value = app.popularQuery;
  }

  let amountInput = null;
  let dateInput = null;
  if (app.id === "currency" || app.id === "tcmb") {
    dateInput = document.createElement("input");
    dateInput.type = "date";
    const today = new Date();
    dateInput.value = formatDateStr(today);
    dateInput.max = formatDateStr(today);
    dateInput.style.maxWidth = "150px";
    searchBar.appendChild(dateInput);
    const latestBtn = document.createElement("button");
    latestBtn.textContent = state.lang === "tr" ? "Güncel" : "Latest";
    latestBtn.style.minWidth = "72px";
    latestBtn.addEventListener("click", () => {
      if (dateInput) dateInput.value = "";
      handle(input ? input.value.trim() : app.popularQuery);
    });
    searchBar.appendChild(latestBtn);

    if (app.id === "tcmb") {
      const tcmbPrev = document.createElement("button");
      tcmbPrev.textContent = state.lang === "tr" ? "Dün" : "Prev";
      tcmbPrev.style.minWidth = "60px";
      tcmbPrev.addEventListener("click", () => {
        const base = dateInput.value ? new Date(dateInput.value) : new Date();
        base.setDate(base.getDate() - 1);
        dateInput.value = formatDateStr(base);
        handle("");
      });
      const tcmbNext = document.createElement("button");
      tcmbNext.textContent = state.lang === "tr" ? "Yarın" : "Next";
      tcmbNext.style.minWidth = "60px";
      tcmbNext.addEventListener("click", () => {
        const base = dateInput.value ? new Date(dateInput.value) : new Date();
        base.setDate(base.getDate() + 1);
        const todayClamp = new Date();
        if (base.getTime() > todayClamp.getTime()) base.setTime(todayClamp.getTime());
        dateInput.value = formatDateStr(base);
        handle("");
      });
      searchBar.appendChild(tcmbPrev);
      searchBar.appendChild(tcmbNext);
    }
  }

  if (app.id === "currency" || app.id === "tcmb") {
    amountInput = document.createElement("input");
    if (app.id === "currency") {
      amountInput.placeholder = state.lang === "tr" ? "Miktar (varsayilan 1)" : "Amount (default 1)";
      amountInput.value = "1";
    } else {
      amountInput.placeholder = state.lang === "tr" ? "TL miktarı (örn 1000)" : "TL amount (e.g. 1000)";
      amountInput.value = "1000";
    }
    amountInput.style.maxWidth = "140px";
    searchBar.appendChild(amountInput);
  }

  let inputTo = null;
  if (app.id === "travel") {
    const fromTo = app.popularQuery.split("->").map(s => s.trim());
    if (input) input.value = fromTo[0] || app.popularQuery;
    inputTo = document.createElement("input");
    inputTo.placeholder = copy[state.lang].labels.to;
    inputTo.value = fromTo[1] || "";
    if (input) searchBar.appendChild(input);
    searchBar.appendChild(inputTo);
  } else if (input) {
    searchBar.appendChild(input);
  }

  const btnPrev = app.id === "sports" ? document.createElement("button") : null;
  const btnNext = app.id === "sports" ? document.createElement("button") : null;
  const btn = (app.id === "sports" || app.id === "calc") ? null : document.createElement("button");
  if (btnPrev) {
    btnPrev.textContent = "<";
    btnPrev.style.minWidth = "32px";
    btnNext.textContent = ">";
    btnNext.style.minWidth = "32px";
    searchBar.appendChild(btnPrev);
  }
  if (btn) {
    btn.textContent = copy[state.lang].search;
    searchBar.appendChild(btn);
  }
  if (btnNext) searchBar.appendChild(btnNext);

  const resultBox = document.createElement("div");
  if (app.id !== "calc") wrapper.appendChild(searchBar);
  wrapper.appendChild(resultBox);
  modalContent.innerHTML = "";
  modalContent.appendChild(wrapper);

  async function handle(queryRaw) {
    resultBox.innerHTML = '<div class="loader"></div>';
    const query = app.id === "travel" && inputTo ? `${queryRaw} -> ${inputTo.value}` : queryRaw;
    if ((app.id === "currency" || app.id === "tcmb") && dateInput) app._date = dateInput.value || "";
    const data = await app.fetcher(query, state.lang);
    if (amountInput) app._amount = parseFloat(amountInput.value) || 1;
    renderData(app, data, resultBox, query || app.popularQuery);
  }

  if (btn && input) btn.addEventListener("click", () => handle(input.value.trim()));
  if (btn && app.id === "tcmb") btn.addEventListener("click", () => handle(""));
  if (input) input.addEventListener("keydown", (e) => { if (e.key === "Enter") handle(input.value.trim()); });
  if (inputTo) inputTo.addEventListener("keydown", (e) => { if (e.key === "Enter") handle(input.value.trim()); });
  if (dateInput) dateInput.addEventListener("change", () => handle(input ? input.value.trim() : ""));
  if (btnPrev && btnNext) {
    btnPrev.addEventListener("click", () => {
      const appRef = apps.find(a => a.id === "sports");
      const d = appRef._date ? new Date(appRef._date.getTime()) : new Date();
      d.setDate(d.getDate() - 1);
      appRef._date = d;
      handle("");
    });
    btnNext.addEventListener("click", () => {
      const appRef = apps.find(a => a.id === "sports");
      const d = appRef._date ? new Date(appRef._date.getTime()) : new Date();
      d.setDate(d.getDate() + 1);
      appRef._date = d;
      handle("");
    });
  }

  handle(input ? input.value.trim() : app.popularQuery);
}

function renderData(app, data, container, query) {
  const detailLabel = copy[state.lang].detail[app.id];
  const labels = copy[state.lang].labels;
  let html = "";
  const amount = app._amount || 1;
  switch (app.id) {
    case "weather":
      html = `
        <div class="flex">
          <div class="card-detail">
            <div class="badge">${labels.today}</div>
            <h3>${data.today.tmax}/${data.today.tmin}&deg;C</h3>
            <p>${data.today.date}</p>
          </div>
          <div class="card-detail">
            <div class="badge">${labels.tomorrow}</div>
            <h3>${data.tomorrow.tmax}/${data.tomorrow.tmin}&deg;C</h3>
            <p>${data.tomorrow.date}</p>
          </div>
          <div class="card-detail">
            <div class="badge">${query || ""}</div>
            <h3>${data.current.temp}&deg;C</h3>
            <p>${labels.wind}: ${data.current.wind} km/s</p>
            <p>${labels.rain}: ${data.current.rainChance}</p>
            <p>${labels.city}: ${data.location}</p>
          </div>
        </div>`;
      break;
    case "currency":
      const entries = Object.entries(data.rates || {}).sort((a, b) => a[0].localeCompare(b[0]));
      const popularList = ["USD", "EUR", "TRY"].map(code => {
        const rate = data.rates?.[code];
        if (rate == null) return "";
        const converted = (rate * amount).toFixed(4);
        const name = friendlyCurrencyName(code);
        if (!name) return "";
        return `${code} (${name}): ${rate} (${amount} -> ${converted})`;
      }).filter(Boolean);
      html = `
        <div class="card-detail" style="max-height:360px;overflow:auto">
          <div class="badge">${labels.base}: ${data.base} ${data.date ? "· " + data.date : ""}</div>
          ${popularList.length ? `<p><strong>Popular</strong>: ${popularList.join(" | ")}</p>` : ""}
          ${entries.map(([k,v]) => {
            const name = friendlyCurrencyName(k);
            if (!name) return "";
            return `<p>${k} (${name}): ${v.toFixed(4)} ${amount !== 1 ? `(${amount} -> ${(v * amount).toFixed(4)})` : ""}</p>`;
          }).join("")}
        </div>`;
      break;
    case "tcmb":
      const items = data.items || [];
      const amountTl = app._amount || 1000;
      if (!items.length) {
        html = `<div class="card-detail" style="max-height:360px;overflow:auto"><div class="badge">${data.date || "-"}</div><p>${state.lang==="tr"?"Veri bulunamadi":"No data"}</p></div>`;
      } else {
        html = `
          <div class="card-detail" style="max-height:360px;overflow:auto">
            <div class="badge">${data.date || "-"}</div>
            ${items.map(it => {
              const rate = it.selling || it.buying;
              const conv = rate ? amountTl / rate : null;
              const convText = conv ? ` | ${amountTl} TL ~ ${conv.toFixed(2)} ${it.code.split("/")[0]}` : "";
              return `<p><strong>${it.code}</strong> (${it.name}) - Alış: ${it.buying.toFixed(4)} | Satış: ${it.selling.toFixed(4)}${convText}</p>`;
            }).join("")}
          </div>`;
      }
      break;

    case "news":
      html = renderList(data, item => `<li><strong>${item.title}</strong> <em>(${item.site})</em> - <a style="color:#7dd3fc" href="${item.url}" target="_blank" rel="noreferrer">${labels.read}</a></li>`);
      break;
    case "recipes":
      html = renderList(data, m => `<li><button class="pill detail-btn" data-id="${m.id}">${labels.recipe}</button> <strong>${m.name}</strong> - ${m.area} - ${m.tag} ${m.link && m.link !== "#" ? `<a style=\"color:#7dd3fc\" href=\"${m.link}\" target=\"_blank\" rel=\"noreferrer\">${labels.source}</a>` : ""}</li>`);
      break;
    case "movies":
      html = renderList(data, m => `<li><strong>${m.name}</strong> - ${m.genre} - IMDB ${m.rating || "NA"} <a style="color:#7dd3fc" href="${m.url}" target="_blank" rel="noreferrer">${labels.open}</a><div style="color:${state.lang==="tr"?"#cbd5e1":"#94a3b8"}">${(m.summary || "").replace(/<[^>]+>/g, "")}</div></li>`);
      break;
    case "books":
      html = renderList(data, b => {
        const link = b.url && b.url !== "#" ? `<a style="color:#7dd3fc" href="${b.url}" target="_blank" rel="noreferrer">${labels.open}</a>` : "";
        return `<li><strong>${b.title}</strong> - ${b.author} - ${b.year} ${link}</li>`;
      });
      break;
    case "space":
      html = `
        <div class="flex">
          <div class="card-detail">
            <h3>${data.title}</h3>
            <p>${data.desc}</p>
          </div>
          <div class="card-detail"><img src="${data.img}" alt="${data.title}" style="width:100%;border-radius:10px"></div>
        </div>`;
      break;
    case "jobs":
      html = renderList(data, j => `<li><strong>${j.position}</strong> @ ${j.company} - ${translateLocation(j.location)} ${j.url ? `<a style=\"color:#7dd3fc\" href=\"${j.url}\" target=\"_blank\" rel=\"noreferrer\">${labels.open}</a>` : ""}</li>`);
      break;
    case "travel":
      html = data.route ? `
        <div class="card-detail">
          <div class="badge">${detailLabel}</div>
          <p>${labels.from}: ${data.route.from}</p>
          <p>${labels.to}: ${data.route.to}</p>
          <p>${labels.distance}: ${data.route.distance} km</p>
          <p>${labels.drive}: ~${data.route.driving} dk</p>
          <p>${labels.fly}: ~${data.route.flying} dk</p>
          <p>${labels.bus}: ~${data.route.bus} dk</p>
          <p>${labels.train}: ~${data.route.train} dk</p>
        </div>` : `<div class="card-detail">${data.message || "No route"}</div>`;
      break;
    case "maps":
      html = renderList(data, p => `<li><strong>${p.display}</strong> - ${p.lat}, ${p.lon} <a style="color:#7dd3fc" href="https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}" target="_blank" rel="noreferrer">${labels.map}</a></li>`);
      break;
    case "sports":
      const appRef = apps.find(a => a.id === "sports");
      const systemToday = new Date();
      if (!appRef._date) appRef._date = new Date(systemToday.getTime());
      if (data?.length) {
        appRef._allSportsByDate = appRef._allSportsByDate || {};
        const dateOfData = localDateStr(appRef._date);
        appRef._allSportsByDate[dateOfData] = data;
      }
      const dateLabel = localDateStr(appRef._date);
      const allByDate = appRef._allSportsByDate || {};
      const allSports = allByDate[dateLabel] || [];
      const selectedFilter = appRef._countryFilter || "allowed";
      const isWomen = (str) => (str || "").toLowerCase().includes("women");
      const allowedLower = SPORTS_ALLOWED_COUNTRIES.map(x => x.toLowerCase());
      const isWorldTeam = (c) => c.includes("world") || c.includes("international");
      const matchCountry = (country, filter) => {
        const c = (country || "").toLowerCase();
        if (filter === "world") return isWorldTeam(c);
        if (filter === "Others") return !allowedLower.includes(c) && !isWorldTeam(c);
        if (filter === "allowed") return allowedLower.includes(c);
        return c === filter.toLowerCase();
      };
      let pool = allSports.filter(m => matchCountry(m.country, selectedFilter));
      if (!pool.length && allSports.length) {
        pool = allSports; // fallback: hiçbir maç kaçmasın
      }
      const filteredSports = pool.filter(m => !isWomen(m.league) && !isWomen(m.name));
      const qlc = (query || "").toLowerCase();
      const dayItems = filteredSports.filter(m => {
        const l = (m.league || "").toLowerCase();
        const n = (m.name || "").toLowerCase();
        return qlc ? (l.includes(qlc) || n.includes(qlc)) : true;
      });
      const groupedByCountry = groupSportsByCountry(dayItems);
      const filterButtonsHtml = SPORTS_FILTER_BUTTONS.map(f => {
        const active = (appRef._countryFilter || "world") === f;
        const meta = SPORTS_COUNTRIES.find(c => c.key === f) || { label: f };
        const label = meta.label || f;
        return `<button class="pill ${active ? "active" : ""}" data-filter="${f}">${label}</button>`;
      }).join("");
      const buttonOpenAll = `<button class="pill" id="open-full-sports" style="margin-top:12px;">${state.lang==="tr"?"Tüm maçları aç":"Open all"}</button>`;
      if (!dayItems.length) {
        html = `<div class="card-detail" style="max-height:70vh;overflow:auto"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">${filterButtonsHtml}</div><p style="color:${state.lang==='tr' ? '#cbd5e1':'#94a3b8'}">${labels.date}: ${dateLabel}</p><p>${state.lang==="tr"?"Bu tarihte mac bulunamadi.": "No matches for this date."}</p>${buttonOpenAll}</div>`;
      } else {
        const countryOrder = SPORTS_COUNTRIES.map(c => c.key);
        const groupedHtml = Object.entries(groupedByCountry)
          .sort((a, b) => {
            const ia = countryOrder.indexOf(a[0]); const ib = countryOrder.indexOf(b[0]);
            const sa = ia === -1 ? 999 : ia; const sb = ib === -1 ? 999 : ib;
            if (sa !== sb) return sa - sb;
            return a[0].localeCompare(b[0]);
          })
          .map(([country, leagues]) => {
            const leagueHtml = sortLeagues(country, leagues).map(([lg, matches]) => {
              return `<div style="margin:8px 0;"><strong>${country} - ${lg}</strong>${renderList(matches, m => `<li style="color:${m.live ? '#22d3ee' : '#cbd5e1'}"><button class="pill detail-btn" data-sport="${m.id}">Detay</button> <strong>${m.name}</strong> - ${m.date} - ${m.time} - ${m.status}</li>`)}</div>`;
            }).join("");
            return leagueHtml;
          }).join("");
        html = `<div class="card-detail" style="max-height:70vh;overflow:auto"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">${filterButtonsHtml}</div><p style="color:${state.lang==='tr' ? '#cbd5e1':'#94a3b8'}">${labels.date}: ${dateLabel}</p>${groupedHtml}${buttonOpenAll}</div>`;
      }
      break;
    case "calc":
      const calcHtml = [
        { id: "exam", title: "Vize/Final Ortalamasi", fields: ["vize", "vizeAgirlik", "final", "finalAgirlik"], labels: ["Vize", "Vize %", "Final", "Final %"], fn: (f) => (f.vize * (f.vizeAgirlik/100) + f.final * (f.finalAgirlik/100)).toFixed(2) },
        { id: "kdv", title: "KDV Hesaplama", fields: ["tutar", "oran"], labels: ["Tutar", "KDV %"], fn: f => `${(f.tutar*(1+f.oran/100)).toFixed(2)} (KDV: ${(f.tutar*f.oran/100).toFixed(2)})` },
        { id: "bki", title: "Vucut Kitle Indeksi", fields: ["kilo", "boy"], labels: ["Kilo (kg)", "Boy (cm)"], fn: f => (f.kilo / ((f.boy/100)**2)).toFixed(2) },
        { id: "faiz", title: "Basit Faiz", fields: ["anapara", "oran", "gun"], labels: ["Anapara", "%", "Gun"], fn: f => ((f.anapara * f.oran/100 * f.gun)/365).toFixed(2) },
        { id: "taksit", title: "Kredi Taksit", fields: ["anapara", "oran", "ay"], labels: ["Anapara", "Aylik %", "Ay"], fn: f => { const r=f.oran/100; const n=f.ay; if(r===0) return (f.anapara/n).toFixed(2); const pay=r*Math.pow(1+r,n); const payda=Math.pow(1+r,n)-1; return (f.anapara*pay/payda).toFixed(2);} },
        { id: "indirim", title: "Indirimli Fiyat", fields: ["fiyat", "indirim"], labels: ["Fiyat", "Indirim %"], fn: f => (f.fiyat*(1 - f.indirim/100)).toFixed(2) },
        { id: "hiz", title: "Ortalama Hiz", fields: ["mesafe", "sure"], labels: ["Mesafe (km)", "Sure (saat)"], fn: f => (f.mesafe / f.sure).toFixed(2) },
        { id: "yakıt", title: "Yakit Tuketimi", fields: ["km", "litre"], labels: ["Gidilen km", "Harcanan litre"], fn: f => (f.litre / f.km * 100).toFixed(2) + " L/100km" },
        { id: "doviz", title: "Hizli Kur Cevirici", fields: ["miktar", "kur"], labels: ["Miktar", "Kur (hedef)"], fn: f => (f.miktar * f.kur).toFixed(2) },
        { id: "yuzde", title: "Yuzde Hesaplama", fields: ["sayi", "yuzde"], labels: ["Sayi", "Yuzde %"], fn: f => (f.sayi * f.yuzde/100).toFixed(2) }
      ];
      html = `
        ${calcHtml.map(c => `
          <div class="card-detail" data-calc="${c.id}">
            <div class="badge">${c.title}</div>
            ${c.fields.map((fid, idx) => `<label style="display:block;margin:6px 0 2px;">${c.labels[idx] || fid}</label><input data-field="${fid}" style="width:100%;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.06);color:#fff;">`).join("")}
            <button class="pill run-calc" style="margin-top:8px;">Hesapla</button>
            <div class="badge" style="margin-top:8px;">Sonuc: <span data-result>-</span></div>
          </div>`).join("")}
      `;
      break;
    default:
      html = "<p>Veri bulunamad.</p>";
  }
  container.innerHTML = `
    <div class="card-detail">
      <div class="badge">${detailLabel}</div>
      ${html}
    </div>
  `;

  // For sports, ensure full list uses limited height (already set in render)

  if (app.id === "recipes") {
    container.querySelectorAll(".detail-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        btn.textContent = "...";
        const detail = await app.fetchDetail(btn.dataset.id);
        if (detail) {
          const extra = document.createElement("div");
          extra.style.marginTop = "6px";
          extra.style.color = "#cbd5e1";
          extra.textContent = detail.instructions;
          btn.parentElement.appendChild(extra);
          btn.remove();
        } else {
          btn.textContent = labels.recipe;
        }
      });
    });
  }

  if (app.id === "sports") {
    const filterBtns = container.querySelectorAll("button[data-filter]");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const appRef = apps.find(a => a.id === "sports");
        appRef._countryFilter = btn.dataset.filter;
        renderData(app, data, container, query);
      });
    });
    container.querySelectorAll(".detail-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
          btn.textContent = "...";
          const detail = await app.fetchDetail(btn.getAttribute("data-sport"));
          if (detail) {
            const extra = document.createElement("div");
            extra.style.marginTop = "6px";
            extra.style.color = "#cbd5e1";
            extra.innerHTML = `<strong>${detail.score}</strong><br>${detail.home} vs ${detail.away}<br>${labels.date}: ${detail.date} ${detail.time}<br>${labels.map}: ${detail.venue || "-"}<br>${detail.status || ""}<br>${detail.lineup || ""}`;
            btn.parentElement.appendChild(extra);
            btn.remove();
          } else {
            btn.textContent = "Detay";
        }
      });
    });
    const fullBtn = container.querySelector("#open-full-sports");
    if (fullBtn) {
      fullBtn.addEventListener("click", () => {
        openSportsFullPage();
      });
    }
  }

  if (app.id === "calc") {
    container.querySelectorAll(".card-detail").forEach(block => {
      const btn = block.querySelector(".run-calc");
      const res = block.querySelector("[data-result]");
      btn.addEventListener("click", () => {
        const inputs = block.querySelectorAll("input[data-field]");
        const data = {};
        inputs.forEach(inp => { data[inp.dataset.field] = parseFloat(inp.value) || 0; });
        const id = block.getAttribute("data-calc");
        const calc = {
          exam: f => (f.vize * (f.vizeAgirlik/100) + f.final * (f.finalAgirlik/100)).toFixed(2),
          kdv: f => `${(f.tutar*(1+f.oran/100)).toFixed(2)} (KDV: ${(f.tutar*f.oran/100).toFixed(2)})`,
          bki: f => f.boy ? (f.kilo / ((f.boy/100)**2)).toFixed(2) : 0,
          faiz: f => ((f.anapara * f.oran/100 * f.gun)/365).toFixed(2),
          taksit: f => { const r=f.oran/100; const n=f.ay||1; if(r===0) return (f.anapara/n).toFixed(2); const pay=r*Math.pow(1+r,n); const payda=Math.pow(1+r,n)-1; return (f.anapara*pay/payda).toFixed(2); },
          indirim: f => (f.fiyat*(1 - f.indirim/100)).toFixed(2),
          hiz: f => f.sure ? (f.mesafe / f.sure).toFixed(2) : 0,
          "yakit": f => f.km ? (f.litre / f.km * 100).toFixed(2) + " L/100km" : 0,
          doviz: f => (f.miktar * f.kur).toFixed(2),
          yuzde: f => (f.sayi * f.yuzde/100).toFixed(2)
        }[id] || (()=> "0");
        res.textContent = calc(data);
      });
      block.querySelectorAll("input[data-field]").forEach(inp => {
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            btn.click();
          }
        });
      });
    });
  }
}

// About butonu: üstteki anchor çalışmıyorsa yönlendir
const aboutAnchor = document.getElementById("about-btn");
if (aboutAnchor) {
  aboutAnchor.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "pages/about.html";
  });
}

closeBtn.addEventListener("click", () => modal.classList.remove("active"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("active"); });

