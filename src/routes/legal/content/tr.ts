import type { LegalContent } from './index'

// Türkçe — Endonezce referans metnini bölüm bölüm yansıtır.

export const content: LegalContent = {
  privacy: {
    title: 'Gizlilik Politikası',
    metaDescription:
      'Sohibna verilerinizi nasıl toplar, kullanır ve korur — reklamsız, izleyicisiz, veri satışı yok.',
    updatedLabel: 'Son güncelleme',
    updated: '9 Kasım 2026',
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
          'Okuma, ezberleme ve ilerleme özelliklerini sunabilmek için uygulamada oluşturduğunuz verileri saklarız: işaretler ve favori âyetler, etiketler, son okuma konumu, hatim hedefleri ve ilerlemesi, ezber hedefleri ve âyet bazında ezber durumu, tekrar (mürâcaa) kuyruğu, günlük tefekkür notları ve ruh hâli, kaydetmeyi seçtiğiniz yapay zekâ sohbetleri ile uygulama tercih ve ayarlarınız.',
          'Bu veriler tüm cihazlarınızda kullanılabilmesi için hesabınızla eşitlenir. Hesap oluşturmak zorunda değilsiniz — özelliklerin çoğu hesapsız da çalışır.',
        ],
      },
      {
        h: 'Konumunuz',
        p: [
          'Namaz vakitleri ve kıble yönü cihazınızda hesaplanır. Şehir adını gösterebilmek için koordinatlar, kimliğiniz olmadan üçüncü taraf bir coğrafi kodlama hizmetine (BigDataCloud) gönderilir. Konum geçmişinizi sunucularımızda saklamayız.',
        ],
      },
      {
        h: 'Yapay zekâ özelliklerimiz',
        p: [
          'Sor ve Öğren, Kitap Zekâsı veya Tefekkür özelliklerini kullandığınızda sorunuz ve sohbet bağlamı, yanıt üretmek için üçüncü taraf bir dil modeli hizmetine (Groq) gönderilir; kitap referansı arama ise Google\'ın gömme (embedding) hizmetini (Gemini) kullanır.',
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
        h: 'Reklam yok, izleyici yok',
        p: [
          'Sohibna reklam göstermez ve hiçbir üçüncü taraf analitik SDK içermez. Verilerinizi kimseye satmayız, kiralamayız ve ticaretini yapmayız.',
        ],
      },
      {
        h: 'Üçüncü taraflar',
        p: [
          'Hizmeti işletmek için şu sağlayıcılarla çalışıyoruz: barındırma ve veritabanı sağlayıcıları, dosya deposu, e-posta gönderim hizmeti (Brevo), Google (Firebase Authentication ve Gemini), Groq (yapay zekâ modeli), BigDataCloud coğrafi kodlama hizmeti ve uygulamayı oradan indirdiyseniz Google Play. Her biri, verileri yalnızca o işlev için gereken ölçüde işler.',
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
    updated: '9 Kasım 2026',
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
          'Sohibna bir ibadet ve İslam öğrenme yardımcısıdır: Kur\'an okuma ve ezberleme, namaz vakitleri, kıble yönü, Hicri takvim, zikir, namaz ve ikrô öğrenimi ile yapay zekâ destekli İslam külliyatı sohbeti.',
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
          '"Bizi Destekle" özelliği, uygulamanın işletmesi için gönüllü destek sunmanıza imkân verir. Destek hiçbir özellik, içerik veya ayrıcalık açmaz; alınan tutarlar, ilgili hukukun zorun kıldığı hâller dışında iade edilmez.',
        ],
      },
      {
        h: 'İleride ücretli özellikler',
        p: [
          'İleride ücretli bir abonelik sunarsak (örneğin Sohibna+), ödemeler Google Play Billing üzerinden işlenecek ve Google Play koşullarına tabi olacaktır. Temel ibadet özellikleri — Kur\'an, namaz vakitleri, ezan, kıble — ücretsiz kalır.',
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
