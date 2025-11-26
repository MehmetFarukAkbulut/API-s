// Lightweight language helper: keeps API data as-is, translates common UI texts.
(function () {
  const pref = (typeof localStorage !== "undefined" && localStorage.getItem("prefLang")) || "en";
  if (!["en", "tr"].includes(pref)) return;
  document.documentElement.lang = pref;
  if (pref === "tr") return; // Turkish selected: keep Turkish UI text.

  const textMap = {
    "Ana sayfa": "Home",
    "Hazır": "Ready",
    "Ara": "Search",
    "Ara ": "Search ",
    "Güncel": "Latest",
    "Arama": "Search",
    "Listele": "List",
    "Rastgele": "Random",
    "Daha fazla": "More",
    "Harita": "Map",
    "Harita / Konum": "Map / Location",
    "Hava Durumu": "Weather",
    "TCMB Kurları": "CBRT Rates",
    "Kur / Döviz": "FX Converter",
    "Haber + Trend": "News + Trend",
    "Tarif + Besin": "Recipes + Meals",
    "Sanat Galerisi": "Art Gallery",
    "Anime Takvimi": "Anime Schedule",
    "Seyahat Planlayıcı": "Travel Planner",
    "Depremler": "Earthquakes",
    "Hava Kalitesi": "Air Quality",
    "Müzik Çalar": "Music Player",
    "Maç Skorları": "Match Scores",
    "Hesaplamalar": "Calculators",
    "Rastgele Tarif": "Random Meal",
    "Hazır ": "Ready ",
    "Gün": "Day",
    "Günlük": "Daily",
    "Saat dilimi": "Timezone",
    "Nüfus": "Population",
    "Para birimi": "Currency",
    "Bütçe": "Budget",
    "Konfor": "Comfort",
    "Lüks": "Luxury",
    "Bugün": "Today",
    "Yarın": "Tomorrow",
    "Yağış ihtimali": "Rain chance",
    "Rüzgar": "Wind",
    "Puan": "Score",
    "Kategori": "Category",
    "Kaydet": "Save",
    "Kapat": "Close",
    "Detay": "Detail",
    "Hesapla": "Calculate",
    "Sonuç bekleniyor": "Waiting for result",
    "Seçim yap ve çarpışmayı izle.": "Pick a move and watch the clash.",
    "Hazır.": "Ready.",
    "Seçim yap": "Choose"
  };

  const placeholderMap = {
    "Dizi adı (örn: Lost)": "Show name (e.g. Lost)",
    "Şehir veya ülke (örn: Tokyo)": "City or country (e.g. Tokyo)",
    "Varış (opsiyonel)": "Destination (optional)",
    "Adres veya yer (örn: Berlin)": "Address or place (e.g. Berlin)",
    "Tarif veya malzeme (örn: chicken)": "Recipe or ingredient (e.g. chicken)",
    "Konu veya başlık (örn: science)": "Topic or title (e.g. science)",
    "Şarkı / artist (boş: top hits)": "Song / artist (blank: top hits)",
    "Konu (örn: bitcoin)": "Topic (e.g. bitcoin)",
    "Baz para birimi (USD, EUR...)": "Base currency (USD, EUR...)",
    "gg . aa . yyyy": "dd . mm . yyyy",
    "Nereden -> Nereye (örn: Istanbul -> Berlin)": "From -> To (e.g. Istanbul -> Berlin)"
  };

  // Replace placeholders
  document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(el => {
    const ph = el.getAttribute("placeholder");
    if (ph && placeholderMap[ph]) el.setAttribute("placeholder", placeholderMap[ph]);
  });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const raw = node.textContent;
    const key = raw.trim();
    if (!key) return;
    if (textMap[key]) {
      node.textContent = raw.replace(key, textMap[key]);
    }
  });
})();
