import type { LegalContent } from './index'

// Türkçe — Endonezce referans metnini bölüm bölüm yansıtır.

export const content: LegalContent = {
  privacy: {
    title: 'Gizlilik Politikası',
    metaDescription:
      'Sohibna verilerinizi nasıl toplar, kullanır ve korur — reklamsız, izleyicisiz, veri satışı yok.',
    updatedLabel: 'Son güncelleme',
    updated: '26 Kasım 2026',
    backHome: 'Ana Sayfaya Dön',
    sections: [
      {
        h: 'Biz kimiz',
        p: [
          'Sohibna, PT. FRAME DIGITAL SOLUSINDO tarafından geliştirilen bir ibadet ve İslam öğrenme yardımcı uygulamasıdır ("biz"). Bu politika, Sohibna uygulamasını ve sitesini kullanırken hangi verileri işlediğimizi ve bu veriler üzerindeki haklarınızı açıklar.',
        ],
      },
      {
        h: 'Hesap verileriniz',
        p: [
          'Hesap oluşturduğunuzda adınızı, e-posta adresinizi ve şifrenizi saklarız. Şifreler her zaman tek yönlü özet (hash) olarak saklanır — biz de okuyamayız.',
          'Google ile giriş yaparsanız kimlik doğrulama Firebase Authentication üzerinden yürütülür; Google hesabınıza ait e-posta ve adı alırız. E-posta, hesap doğrulama ve şifre kurtarma için kullanılır.',
        ],
      },
      {
        h: 'İbadet ve etkinlik verileriniz',
        p: [
          'Okuma, ezberleme ve ilerleme özelliklerini sunabilmek için uygulamada oluşturduğunuz verileri saklarız: işaretler ve favori âyetler, etiketler, son okuma konumu, hatim hedefleri ve ilerlemesi, ezber hedefleri ve âyet bazında ezber durumu, tekrar (mürâcaa) kuyruğu, günlük tefekkür notları ve ruh hâli, kaydetmeyi seçtiğiniz yapay zekâ sohbetleri, topluluk gruplarındaki üyeliğiniz ve etkinlikleriniz ile uygulama tercih ve ayarlarınız.',
          'Talim (ezber okuma) özelliğini kullanırsanız okuma ses kayıtlarınız dosya depomuzda saklanır: ezber ilerlemesini izlemek için üçüncü taraf bir yapay zekâ hizmeti tarafından otomatik olarak değerlendirilir; bir rehber eğitmen atadıysanız, kayıtları değerlendirme amacıyla dinleyebilir.',
          'Bu veriler tüm cihazlarınızda kullanılabilmesi için hesabınızla eşitlenir. Hesap oluşturmak zorunda değilsiniz — özelliklerin çoğu hesapsız da çalışır.',
        ],
      },
      {
        h: 'Konumunuz',
        p: [
          'Namaz vakitleri ve kıble yönü cihazınızda hesaplanır. Şehir adını gösterebilmek için koordinatlar, kimliğiniz olmadan üçüncü taraf bir coğrafi kodlama hizmetine (BigDataCloud) gönderilir. Yakın Camii özelliğini açtığınızda harita Google Maps üzerinden yüklenir ve o anki koordinatlarınız da Google\'a iletilir. Konum geçmişinizi sunucularımızda saklamayız.',
        ],
      },
      {
        h: 'Yapay zekâ özelliklerimiz',
        p: [
          'Sor ve Öğren, Kitap Zekâsı veya Tefekkür özelliklerini kullandığınızda sorunuz ve sohbet bağlamı, yanıt üretmek için üçüncü taraf bir dil modeli hizmetine (Groq; yedek olarak Google Gemini) gönderilir; kitap referansı arama ise Google\'ın gömme (embedding) hizmetini (Gemini) kullanır.',
          'Yapay zekâ yanıtları hatalı olabilir ve fetva değildir — ibadet kararları için yetkili âlimlere veya ilgili dinî merciiye daninin. Soru ve yanıtların sınırlı bir örneklemi, kalite güvencesi ve raporların ele alınması için sunucumuzda kaydedilebilir.',
        ],
      },
      {
        h: 'Profil fotoğrafı (isteğe bağlı)',
        p: [
          'Profil fotoğrafı yüklerseniz dosya depomuzda saklanır ve bir bağlantıyla erişilebilir. Lütfen yalnızca paylaşmakta sakınca görmediğiniz bir fotoğraf yükleyin. Fotoğrafı profil sayfanızdan dilediğiniz zaman değiştirebilir veya kaldırabilirsiniz.',
        ],
      },
      {
        h: 'Partner Programı',
        p: [
          'Partner Programı’na katılırsanız davet kodunuzu kaydeder ve yönlendirmenizle kayıt olan kullanıcıların Google Play’deki ücretli satın alımlarından komisyonu hesaplarız. Yalnızca anonim bir özet görürsünüz — ürün, zaman ve komisyon tutarı; yönlendirdiğiniz kişilerin kimliği ortaklarla asla paylaşılmaz. Banka bilgileri uygulamada toplanmaz. Komisyon ve ödeme kayıtları yalnızca partner kodunu ve tutarları içerir ve muhasebe amacıyla hesap silindikten sonra da kalır.',
          'Kayıt sayfası bir ortak bağlantısıyla açıldığında cihaz başına bir tıklama sayarız. Saklanan, cihaz tanımlayıcısının tek yönlü bir özetidir (hash) — tanımlayıcının kendisi değil; amaç yalnızca aynı cihazın iki kez sayılmamasıdır. Bu özet bir cihaza veya kişiye geri izlenemez ve başka hiçbir amaçla kullanılmaz.',
        ],
      },
      {
        h: 'Reklam yok, izleyici yok',
        p: [
          'Sohibna reklam göstermez ve hiçbir üçüncü taraf analitik SDK içermez. Verilerinizi kimseye satmayız, kiralamayız ve ticaretini yapmayız.',
        ],
      },
      {
        h: 'Üçüncü taraflar',
        p: [
          'Hizmeti işletmek için şu sağlayıcılarla çalışıyoruz: barındırma ve veritabanı sağlayıcıları, dosya deposu, e-posta gönderim hizmeti (Brevo), Google (Firebase Authentication, Gemini ve yakın camii özelliği için Maps), Groq (yapay zekâ modeli), BigDataCloud coğrafi kodlama hizmeti, RevenueCat (ücretli özellik durumunuzu yönetmek için uygulama içi satın alma verilerinizi işler) ve uygulamayı oradan indirdiyseniz Google Play — uygulama içi ödemeler Google Play Billing üzerinden işlenir. Her biri, verileri yalnızca o işlev için gereken ölçüde işler.',
        ],
      },
      {
        h: 'İşleme dayanağı ve onay',
        p: [
          'Endonezya Kişisel Verilerin Korunusu Kanunu (27/2022) uyarınca verilerinizi, talep ettiğiniz hizmeti sunmak ve kısmen de hesap oluştururken verdiğiniz onaya dayanarak işleriz. Onayınızı hesabınızı silerek geri alabilirsiniz.',
        ],
      },
      {
        h: 'Haklarınız',
        anchor: 'delete',
        p: [
          'Kişisel verilerinize erişme, kopyasını alma, düzeltme ve silme, işlemeyi kısıtlama, onayı geri çekme ve itiraz etme haklarına sahipsiniz.',
          'Verilerinizi silmenin en hızlı yolu: uygulamada "Profilim" menüsünü açıp "Hesabı Sil" seçeneğini seçmektir — eşitlenmiş tüm verileriniz sunucularımızdan kaldırılır. Diğer haklarınız için bize support@sohibna.com adresinden yazabilirsiniz; makul bir süre içinde yanıt veririz.',
        ],
      },
      {
        h: 'Veri saklama',
        p: [
          'Veriler hesabınız aktif olduğu sürece saklanır. Hesabınızı sildiğinizde eşitlenmiş verileriniz sunuculardan kaldırılır. Cihazınızda kalan kopyalar ise oturumu kapattığınızda veya uygulamayı kaldırdığınızda temizlenir.',
        ],
      },
      {
        h: 'Güvenlik',
        p: [
          'Makul önlemler alıyoruz: tüm trafik şifrelidir (HTTPS), şifreler özetlenir (hash), erişim belirteçleri kısa ömürlüdür. Kusursuz sistem yoktur — bir güvenlik sorunu olduğunu düşünüyorsanız lütfen support@sohibna.com adresine bildirin.',
        ],
      },
      {
        h: 'Çocuklar',
        p: [
          'Sohibna 13 yaş altı çocuklara yönelik değildir ve çocuk verilerini bilerek toplamaz. Veli iseniz ve çocuğunuzun gözetimsiz hesap açtığını düşünüyorsanız lütfen bizimle iletişime geçin.',
        ],
      },
      {
        h: 'Politika değişiklikleri ve iletişim',
        p: [
          'Bu politika değişirse yukarıdaki tarihi günceller ve bu sayfada duyururuz. Sorularınız için support@sohibna.com.',
        ],
      },
    ],
  },
  terms: {
    title: 'Hizmet Şartları',
    metaDescription:
      'Sohibna uygulamasının kullanım koşulları — PT. FRAME DIGITAL SOLUSINDO\'dan bir ibadet ve İslam öğrenme yardımcısı.',
    updatedLabel: 'Son güncelleme',
    updated: '26 Kasım 2026',
    backHome: 'Ana Sayfaya Dön',
    sections: [
      {
        h: 'Şartların kabulü',
        p: [
          'Sohibna uygulamasını ve hizmetlerini indirerek, erişerek veya kullanarak bu Hizmet Şartları\'nı ve Gizlilik Politikamızı kabul etmiş olursunuz. Kabul etmiyorsanız lütfen hizmeti kullanmayı bırakın.',
        ],
      },
      {
        h: 'Sohibna hizmeti hakkında',
        p: [
          'Sohibna bir ibadet ve İslam öğrenme yardımcısıdır: Kur\'an okuma ve ezberleme, namaz vakitleri, kıble yönü, Hicri takvim, zikir, namaz ve ikrô öğrenimi, öğrenici topluluk grupları ile yapay zekâ destekli İslam külliyatı sohbeti.',
          'Hizmet "olduğu gibi" sunulur. İçeriğin doğruluğu için gayret ederiz; ancak hatasız veya kesintisiz olduğunu taahhüt etmeyiz.',
        ],
      },
      {
        h: 'Fetva değildir',
        p: [
          'Sohibna\'daki yapay zekâ yanıtları ve öğrenme materyalleri eğitici başvuru yardımcılarıdır — fetva değil, bağlayıcı dinî-hukuki tavsiye de değildir. İbadet kararları ve fıkhi meseleler için yetkili âlimlere veya ilgili dinî merciiye daninin. Mezhepler arasında görüş ayrılıkları (ihtilaf) olabilir.',
        ],
      },
      {
        h: 'Hesabınız',
        p: [
          'Şifrenizin gizliliğinden ve hesabınız üzerinden yapılan tüm etkinliklerden siz sorumlusunuz. Hesap oluştururken doğru bilgi verin. Hesabınızın izinsiz kullanıldığını fark ederseniz derhal bizimle iletişime geçin.',
        ],
      },
      {
        h: 'Dürüst kullanım',
        p: [
          'Hizmeti kötüye kullanmamayı; hukuka veya genel ahlaka aykırı içerik göndermemeyi; otomasyon dâhil sunucuları aşırı yüklememeyi; sistemlere veya başkalarının verilerine izinsiz erişmeye teşebbüs etmemeyi kabul edersiniz.',
          'Bu şartlar topluluk özelliklerine de eksiksiz uygulanır. Kurallara aykırı topluluk içeriğini kaldırabilir, kural ihlal eden kullanıcıların erişimini kısıtlayabilir ve kullanıcı bildirimlerini değerlendirebiliriz; dilediğiniz an bir kullanıcıyı üye profil sayfasından engelleyebilirsiniz.',
        ],
      },
      {
        h: 'İçeriğiniz',
        p: [
          'Oluşturduğunuz içerik (işaretler, notlar, ezber kayıtları, tefekkürler, kaydettiğiniz sohbetler) size aittir. Hizmetin çalışması için, bu içeriği cihazlarınızda size geri göstermek üzere saklamak, işlemek ve görüntülemek için bize sınırlı bir lisans verirsiniz.',
        ],
      },
      {
        h: 'Fikri mülkiyet',
        p: [
          'Uygulama, Sohibna markası ve kaynak kodu PT. FRAME DIGITAL SOLUSINDO\'ya aittir. Kur\'an metni, çeviriler ve tefsirler ilgili yayıncı ve kurumlarına aittir ve kendilerine bağlı atıflarla birlikte gösterilir.',
        ],
      },
      {
        h: 'Gönüllü destek',
        p: [
          'Sohibna\'nın işletilmesine gönüllü destek, uygulamadan değil sitemizdeki (sohibna.com) bağış sayfası üzerinden verilir. Destek, uygulama içinde hiçbir özellik, içerik veya ayrıcalık açmaz; alınan tutarlar ilgili hukukun zorun kıldığı hâller dışında iade edilmez.',
        ],
      },
      {
        h: 'Ücretsiz ve ücretli özellikler',
        p: [
          'Temel ibadet özellikleri — Kur\'an okuma ve ezberleme, namaz vakitleri, ezan, kıble, zikir — ücretsiz kalır. Uygulamada isteğe bağlı satın almalar sunulur: Sohibna+ programı kapsamındaki "Supporter" ve "Premium" paketleri (aylık/yıllık abonelik veya ömür boyu tek ödeme); bunlar Yapay Zekâ\'ya Sor ve talim gibi yardımcı özellik kotalarını genişletir, rozetler, profil süslemeleri ve belirli temalar gibi kozmetik dokunuşların kilidini açar.',
          'Tüm ödemeler Google Play Billing üzerinden işlenir; abonelik, iptal ve iade dâhil Google Play koşullarına tabidir. Bazı ücretli özellikler sınırlı süreyle ücretsiz denenebilir.',
        ],
      },
      {
        h: 'Partner Programı',
        anchor: 'mitra',
        p: [
          'Partner Programı, giriş yapmış her kullanıcının başkalarını bir davet bağlantısı veya koduyla Sohibna’ya davet etmesine ve bu davetle kayıt olan kullanıcıların Google Play’deki ücretli satın alımlarından komisyon kazanmasına imkân tanır. Programın tam kuralları uygulama içinde yayımlanır (Ben ← Partner Programı ← Partner Programı Kuralları) ve bu Şartlar’ın parçasıdır.',
          'Komisyon, net gelirin — mağaza kesintisi ve vergi sonrası tutarın — belirli bir yüzdesidir; ilk satın alma ve sonraki her abonelik yenilemesi için geçerlidir. Tıklamalar, kayıtlar, yüklemeler, yorumlar ve puanlar asla ödenmez. Program tek düzeydir, gönüllü desteğe ilişkin düzenlemeden ayrıdır ve zekât, infak veya sadaka fonlarını kapsamaz.',
          'Komisyon oranını, bekletme süresini ve asgari ödeme tutarını değiştirebiliriz; değişiklikler sonrasında kaydedilen ödemelere uygulanır ve uygulamada gösterilir. Ödenmiş komisyon sizde kalır. Kendi hesabınızı yönlendirme, yorumlar veya yüklemeler için teşvik sunma ya da spam gibi ihlaller halinde komisyonu iptal edebilir ve üyeliği askıya alabiliriz.',
          'Ödemeler, banka bilgileri uygulama dışında teyit edildikten sonra havale yoluyla yapılır. Komisyon üzerindenki vergiler ilgili kurallar uyarınca sizin sorumluluğunuzdadır. Katılan partner, 18 yaşında veya üzeri olduğunu ya da vasi izni olduğunu onaylar.',
        ],
      },
      {
        h: 'Değişiklikler ve hizmetin sonlandırılması',
        p: [
          'Hizmetin herhangi bir bölümünü veya tamamını makul bir bildirimle dilediğimiz zaman değiştirebilir, ekleyebilir, azaltabilir veya durdurabiliriz. Sohibna\'yı dilediğiniz an, uygulama içinden hesabınızı silmek dâhil, bırakabilirsiniz.',
        ],
      },
      {
        h: 'Uygulanacak hukuk ve uyuşmazlıklar',
        p: [
          'Bu şartlar Endonezya Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda önce müzakere yoluna gidilir; sonuç alınamazsa Endonezya\'daki yetkili mahkemelerde çözümlenir.',
        ],
      },
      {
        h: 'Google Play kullanıcıları',
        p: [
          'Sohibna\'yı Google Play\'den indirdiyseniz: bu Şartlar, Google\'ın size tanıdığı hakları kısıtlamaz; Play Store üzerinden dağıtımla ilgili uyuşmazlıklar Google Play koşullarına tabidir. İletişim: support@sohibna.com.',
        ],
      },
    ],
  },
}
