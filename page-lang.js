// Page-level UI i18n: switches static UI strings between TR/EN based on localStorage.prefLang.
(function () {
  const prefLang = (localStorage.getItem("prefLang") || "en") === "tr" ? "tr" : "en";
  if (prefLang === "tr") return; // TR seçiliyse dokunma (UI zaten TR).

  const setText = (sel, text) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = text;
  };
  const setAllText = (sel, text) => {
    document.querySelectorAll(sel).forEach(el => (el.textContent = text));
  };
  const replaceText = (find, repl) => {
    document.querySelectorAll("*").forEach(el => {
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
        if (el.textContent.trim() === find) el.textContent = repl;
      }
    });
  };

  const path = location.pathname;

  // Generic buttons/labels
  replaceText("Ara", "Search");
  replaceText("Hazır", "Ready");
  replaceText("Güncel", "Latest");
  replaceText("Arama", "Search");

  // TCMB (tcmb.html)
  if (path.includes("tcmb.html")) {
    setText("h1", "CBRT Rates");
    const lead = document.querySelector("h1 + p");
    if (lead) lead.textContent = "Latest and historical CBRT FX data with TL equivalents; compare 1D / 7D / 1M changes.";
    replaceText("Güncel", "Latest");
    replaceText("Ara", "Search");
    replaceText("Hazır Hazır", "Ready");
    replaceText("1 Gün", "1 Day");
    replaceText("7 Gün", "7 Days");
    replaceText("1 Ay", "1 Month");
    replaceText("Alış", "Buy");
    replaceText("Satış", "Sell");
    replaceText("1 TL karşılığı", "Per 1 TL");
  }

  // Air quality (airquality.html)
  if (path.includes("airquality.html")) {
    setText("h1", "Air Quality");
    const lead = document.querySelector("h1 + p");
    if (lead) lead.textContent = "PM2.5, PM10, NO₂, ozone and pollen-like parameters summary.";
    replaceText("Ara", "Search");
    replaceText("Hazır", "Ready");
    replaceText("Durum:", "Status:");
    replaceText("Sağlıklı referans:", "Health ref:");
    replaceText("Güncelleme:", "Updated:");
    // city badges
    document.querySelectorAll(".city-badge").forEach(b => b.textContent = b.textContent.replace("TÜRKİYE", "TURKEY"));
  }

  // Meal spin (mealspin.html)
  if (path.includes("mealspin.html")) {
    setText("h1", "Random Meal");
    const lead = document.querySelector("h1 + p");
    if (lead) lead.textContent = "One-click random meal from TheMealDB.";
    replaceText("Canlı tarif motoru", "Live recipe engine");
    replaceText("Tarifi aç", "Open recipe");
    replaceText("Malzemeler", "Ingredients");
    replaceText("Tarifi seç", "Pick a recipe");
    replaceText("Sola sürükle", "Swipe left");
  }

  // Art (art.html)
  if (path.includes("art.html")) {
    setText("h1", "Art Gallery");
    const lead = document.querySelector("h1 + p");
    if (lead) lead.textContent = "Search Art Institute of Chicago API; details and more.";
    const q = document.getElementById("q");
    if (q) q.placeholder = "Search (e.g. portrait)";
    replaceText("Ara", "Search");
    replaceText("Hazır", "Ready");
  }

  // News (news.html)
  if (path.includes("news.html")) {
    setText("h1", "News + Trend");
    replaceText("Ara", "Search");
    replaceText("Hazır", "Ready");
    replaceText("Oku", "Read");
    const q = document.getElementById("q");
    if (q) q.placeholder = "Topic (e.g. space)";
  }

  // AniList (anichart.html)
  if (path.includes("anichart.html")) {
    setText("h1", "AniList Anime Schedule");
    const lead = document.querySelector("h1 + p");
    if (lead) lead.textContent = "Pick season & year; list top 20 anime.";
    replaceText("Listele", "List");
    replaceText("Hazır", "Ready");
    replaceText("Şimdi:", "Now:");
    replaceText("Güncel", "Latest");
    document.querySelectorAll("select option").forEach(o => {
      if (o.value === "WINTER") o.textContent = "Winter";
      if (o.value === "SPRING") o.textContent = "Spring";
      if (o.value === "SUMMER") o.textContent = "Summer";
      if (o.value === "FALL") o.textContent = "Fall";
    });
  }

  // Wizard (wizard.html)
  if (path.includes("wizard.html")) {
    setText("h1", "Wizard World");
    const lead = document.querySelector("h1 + p");
    if (lead) lead.textContent = "Live API for spells, elixirs, houses – a glowing magic archive.";
    replaceText("Veri Türü", "Data Type");
    replaceText("Büyüler", "Spells");
    replaceText("İksirler", "Elixirs");
    replaceText("Evler", "Houses");
    replaceText("Hazır", "Ready");
  }

  // RPS (rps.html)
  if (path.includes("rps.html")) {
    setText("h1", "RPS-25");
    const lead = document.querySelector("h1 + p");
    if (lead) lead.textContent = "Fully local 25-move rock-paper-scissors variant.";
    replaceText("Kurallar: Dairedeki sıraya göre her hamle sonraki 12 hamleyi yener.", "Rules: Each move beats the next 12 moves in the circle.");
    replaceText("Çarpışma tamamlandı, yeni hamle seç.", "Clash done, pick a new move.");
    replaceText("Seçim yap ve çarpışmayı izle.", "Pick a move and watch the clash.");
    replaceText("Kaybettin.", "You lost.");
    replaceText("Sen:", "You:");
    replaceText("Rakip:", "Opponent:");
  }

  // Music (music.html)
  if (path.includes("music.html")) {
    setText("h1", "Music Player");
    const lead = document.querySelector("h1 + p");
    if (lead) lead.textContent = "30s Apple Music preview player.";
    const q = document.getElementById("q");
    if (q) q.placeholder = "Song / artist (blank: top hits)";
    replaceText("Ara", "Search");
    replaceText("Hazır", "Ready");
    replaceText("Şarkı seçin", "Select a song");
  }
})();
