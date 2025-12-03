# 🧬 Apidemia

**Apidemia**, çeşitli API fikirlerini, web deneylerini ve mikro projeleri sergilemek için oluşturulmuş, etkileşimli ve modern bir web arayüzüdür.

> *"API ideas and experiments."*

Bu proje, ziyaretçilerin geliştirdiğiniz API'lara veya web uygulamalarına kolayca erişmesini sağlayan, dinamik içerik yapısına sahip bir portfolyo/vitrin sayfasıdır.

🔗 **Canlı Demo:** [https://mehmetfarukakbulut.github.io/API-s/](https://mehmetfarukakbulut.github.io/API-s/)

## ✨ Öne Çıkan Özellikler

* **⚡ Dinamik Kart Yapısı:** Projeler `apps.txt` dosyasından okunarak otomatik olarak listelenir.
* **🌍 Çoklu Dil Desteği:** Kullanıcılar için Türkçe ve İngilizce dil seçenekleri sunar (Yerleşik dil algılama).
* **🚀 Hızlı Erişim Menüsü:** Sayfa içi navigasyonu kolaylaştıran, seçilen projeye yumuşak geçiş (smooth scroll) yapan akıllı bir menü.
* **🎨 Minimal & Modern Tasarım:** `assets` klasöründeki SVG grafikleri ve temiz CSS yapısı ile göz yormayan arayüz.
* **📱 Responsive:** Mobil ve masaüstü cihazlarla tam uyumlu.

## 📂 Proje Mimarisi

* **`index.html`**: Ana vitrin sayfası.
* **`apps.txt`**: Listelenen projelerin veritabanı. Yeni bir proje eklemek için sadece bu dosyayı düzenlemek yeterlidir.
* **`app.js`**: Uygulamanın çekirdek mantığı, kartların oluşturulması.
* **`lang-helper.js` & `page-lang.js`**: Dil yönetimi ve çeviri altyapısı.
* **`scroll-helper.js`**: Hızlı erişim menüsü ve kaydırma efektleri kontrolcüsü.
* **`pages/`**: Hakkında veya detay sayfaları (Örn: `about.html`).

## 🛠️ Nasıl Çalıştırılır?

Proje tamamen **statik** dosyalardan oluşur (HTML/CSS/JS). Herhangi bir sunucu kurulumu gerektirmez.

1.  Repoyu klonlayın:
    ```bash
    git clone [https://github.com/MehmetFarukAkbulut/API-s.git](https://github.com/MehmetFarukAkbulut/API-s.git)
    ```
2.  Klasöre gidin ve `index.html` dosyasını tarayıcınızda açın.

## ➕ Yeni Proje Ekleme

Apidemia'ya yeni bir çalışmanızı eklemek çok kolaydır:

1.  `apps.txt` dosyasını açın.
2.  Mevcut formata uygun olarak projenizin adını, linkini ve açıklamasını yeni bir satır olarak ekleyin.
3.  Kaydedin ve sayfayı yenileyin; kart otomatik olarak oluşacaktır.

## 🤝 Katkıda Bulunma

Hata bildirimleri ve özellik istekleri için [Issues](https://github.com/MehmetFarukAkbulut/API-s/issues) kısmını kullanabilir veya doğrudan Pull Request gönderebilirsiniz.

---

**Mehmet Faruk Akbulut** tarafından geliştirilmiştir.
