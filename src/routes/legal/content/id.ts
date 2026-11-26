import type { LegalContent } from './index'

// Bahasa Indonesia — authoritative source. Facts grounded in the actual data
// flows of the Go API + clients (email auth, Firebase Google sign-in, S3/MinIO
// avatars, recitation audio for hafalan review + ASR, Groq LLM, Gemini
// embeddings, BigDataCloud geocoding, RevenueCat purchase processing,
// local-only notifications, no analytics SDK, no ads).

export const content: LegalContent = {
  privacy: {
    title: 'Kebijakan Privasi',
    metaDescription:
      'Bagaimana Sohibna mengumpulkan, menggunakan, dan melindungi data Anda — tanpa iklan, tanpa pelacak, tanpa penjualan data.',
    updatedLabel: 'Terakhir diperbarui',
    updated: '26 November 2026',
    backHome: 'Kembali ke Beranda',
    sections: [
      {
        h: 'Siapa kami',
        p: [
          'Sohibna adalah aplikasi pendamping ibadah dan pembelajaran Islam yang dikembangkan oleh PT. FRAME DIGITAL SOLUSINDO ("kami"). Kebijakan ini menjelaskan data apa yang kami proses ketika Anda menggunakan aplikasi dan situs Sohibna, serta hak Anda atas data tersebut.',
        ],
      },
      {
        h: 'Data akun Anda',
        p: [
          'Saat membuat akun, kami menyimpan nama, alamat email, dan kata sandi Anda. Kata sandi selalu disimpan dalam bentuk hash satu arah — kami tidak dapat membacanya.',
          'Jika Anda masuk dengan Google, proses autentikasi ditangani melalui Firebase Authentication; kami menerima alamat email dan nama akun Google Anda. Email digunakan untuk verifikasi akun dan pemulihan kata sandi.',
        ],
      },
      {
        h: 'Data ibadah dan aktivitas Anda',
        p: [
          'Untuk menghadirkan fitur baca, hafalan, dan progres, kami menyimpan data yang Anda buat di dalam aplikasi: penanda dan ayat favorit, label, catatan bacaan terakhir, target khatam beserta progresnya, target hafalan dan status hafalan per ayat, antrean murajaah, catatan refleksi harian beserta suasana hati, riwayat percakapan AI yang Anda simpan, keanggotaan serta aktivitas Anda di grup komunitas, serta preferensi dan pengaturan aplikasi.',
          'Jika Anda menggunakan fitur setoran hafalan, rekaman suara setoran Anda disimpan di penyimpanan berkas kami: dinilai secara otomatis oleh layanan AI pihak ketiga untuk memantau kemajuan hafalan, dan bila Anda menunjuk pembimbing, rekaman tersebut dapat didengar oleh pembimbing Anda untuk ditinjau.',
          'Data ini disinkronkan ke akun Anda agar tersedia di seluruh perangkat. Anda bebas tidak membuat akun — sebagian besar fitur tetap dapat dipakai tanpa akun.',
        ],
      },
      {
        h: 'Lokasi Anda',
        p: [
          'Jadwal shalat dan arah kibla dihitung di perangkat Anda. Untuk menampilkan nama kota, koordinat dikirim ke layanan geocoding pihak ketiga (BigDataCloud) tanpa disertai identitas Anda. Saat Anda membuka fitur Masjid Terdekat, peta dimuat dari Google Maps dan koordinat Anda saat itu turut terkirim ke Google. Kami tidak menyimpan riwayat lokasi Anda di server.',
        ],
      },
      {
        h: 'Fitur AI kami',
        p: [
          'Saat Anda menggunakan Tanya AI, Kitab AI, atau Refleksi, pertanyaan Anda beserta konteks percakapan dikirim ke layanan model bahasa pihak ketiga (Groq, dengan cadangan Google Gemini) untuk menghasilkan jawaban, dan proses pencarian rujukan kitab menggunakan layanan embedding Google (Gemini).',
          'Jawaban AI dapat keliru dan bukan fatwa — untuk keputusan ibadah, rujuklah ulama atau lembaga yang berwenang. Sebagian contoh tanya-jawab dapat kami catat di server secara terbatas untuk keperluan penjaminan mutu dan penanganan laporan.',
        ],
      },
      {
        h: 'Foto profil (opsional)',
        p: [
          'Jika Anda mengunggah foto profil, foto disimpan di penyimpanan berkas kami dan dapat diakses melalui tautan. Mohon unggah hanya foto yang aman untuk dibagikan. Foto dapat Anda ganti atau hapus kapan saja dari halaman profil.',
        ],
      },
      {
        h: 'Program Mitra',
        p: [
          'Jika Anda mengikuti Program Mitra, kami mencatat kode rujukan Anda dan menghitung komisi dari pembelian berbayar di Google Play oleh pengguna yang mendaftar lewat rujukan Anda. Anda hanya melihat ringkasan anonim — produk, waktu, dan nominal komisi; identitas pengguna yang Anda ajak tidak pernah dibagikan kepada mitra. Data rekening bank tidak dikumpulkan di dalam aplikasi. Catatan komisi dan pencairan disimpan hanya dengan kode mitra dan nominal, dan tetap tersimpan setelah akun dihapus untuk kebutuhan pembukuan.',
        ],
      },
      {
        h: 'Tanpa iklan, tanpa pelacak',
        p: [
          'Sohibna tidak menampilkan iklan dan tidak menyertakan SDK analitik pihak ketiga. Kami tidak menjual, tidak menyewakan, dan tidak memperdagangkan data Anda kepada siapa pun.',
        ],
      },
      {
        h: 'Pihak ketiga',
        p: [
          'Dalam menjalankan layanan, kami bekerja sama dengan: penyedia hosting dan basis data, penyimpanan berkas, layanan pengiriman email (Brevo), Google (Firebase Authentication, Gemini, dan Maps untuk fitur masjid terdekat), Groq (model AI), layanan geocoding BigDataCloud, RevenueCat (memproses data pembelian di aplikasi untuk mengelola status fitur berbayar Anda), serta Google Play bila Anda mengunduh aplikasi dari sana — pembayaran di aplikasi diproses melalui Google Play Billing. Masing-masing memproses data hanya sejauh diperlukan untuk fungsi tersebut.',
        ],
      },
      {
        h: 'Dasar pemrosesan dan persetujuan',
        p: [
          'Sesuai Undang-Undang Perlindungan Data Pribadi No. 27 Tahun 2022, kami memproses data Anda untuk melaksanakan layanan yang Anda minta dan, sebagian lainnya, berdasarkan persetujuan yang Anda berikan saat membuat akun. Anda dapat menarik persetujuan tersebut dengan menghapus akun Anda.',
        ],
      },
      {
        h: 'Hak Anda',
        anchor: 'delete',
        p: [
          'Anda berhak mengakses, memperoleh salinan, memperbaiki, dan menghapus data pribadi Anda, membatasi pemrosesannya, menarik persetujuan, serta mengajukan keberatan.',
          'Cara tercepat menghapus data: di dalam aplikasi, buka menu "Saya" lalu pilih "Hapus Akun" — seluruh data tersinkron Anda akan dihapus dari server. Anda juga dapat menghubungi kami di support@sohibna.com untuk hak-hak lainnya, dan kami akan menanggapi dalam waktu yang wajar.',
        ],
      },
      {
        h: 'Retensi data',
        p: [
          'Data disimpan selama akun Anda aktif. Ketika Anda menghapus akun, data tersinkron Anda dihapus dari server. Salinan yang tersisa di perangkat Anda ikut terbersihkan saat Anda keluar dari akun atau menghapus aplikasi.',
        ],
      },
      {
        h: 'Keamanan',
        p: [
          'Kami menerapkan langkah yang wajar: seluruh lalu lintas terenkripsi (HTTPS), kata sandi di-hash, dan token akses berbatas waktu. Tidak ada sistem yang sempurna — bila Anda menemukan dugaan masalah keamanan, mohon laporkan ke support@sohibna.com.',
        ],
      },
      {
        h: 'Anak-anak',
        p: [
          'Sohibna tidak ditujukan untuk anak di bawah 13 tahun, dan kami tidak dengan sengaja mengumpulkan data anak. Bila Anda orang tua/wali dan meyakini anak Anda membuat akun tanpa pendampingan, hubungi kami.',
        ],
      },
      {
        h: 'Perubahan kebijakan dan kontak',
        p: [
          'Bila kebijakan ini berubah, kami memperbarui tanggal di atas dan mengumumkannya di halaman ini. Pertanyaan dapat disampaikan ke support@sohibna.com.',
        ],
      },
    ],
  },
  terms: {
    title: 'Syarat & Ketentuan',
    metaDescription:
      'Ketentuan penggunaan aplikasi Sohibna — alat bantu ibadah dan pembelajaran Islam dari PT. FRAME DIGITAL SOLUSINDO.',
    updatedLabel: 'Terakhir diperbarui',
    updated: '26 November 2026',
    backHome: 'Kembali ke Beranda',
    sections: [
      {
        h: 'Penerimaan ketentuan',
        p: [
          'Dengan mengunduh, mengakses, atau menggunakan aplikasi dan layanan Sohibna, Anda menyetujui Syarat & Ketentuan ini bersama Kebijakan Privasi kami. Apabila Anda tidak menyetujui, mohon berhenti menggunakan layanan.',
        ],
      },
      {
        h: 'Tentang layanan Sohibna',
        p: [
          'Sohibna adalah aplikasi pendamping ibadah dan pembelajaran Islam: membaca dan menghafal Al-Qur\'an, jadwal shalat, arah kibla, kalender hijriah, dzikir, pembelajaran shalat dan iqro, grup komunitas pembelajar, serta diskusi literatur Islam berbantuan AI.',
          'Layanan disediakan "sebagaimana adanya". Kami berupaya menjaga keakuratan konten, namun tidak menjamin bebas dari kekeliruan maupun gangguan.',
        ],
      },
      {
        h: 'Bukan fatwa',
        p: [
          'Jawaban AI dan materi pembelajaran dalam Sohibna bersifat bantu-rujukan dan edukatif — bukan fatwa maupun nasihat hukum agama yang mengikat. Untuk keputusan ibadah dan persoalan fikih, tetaplah bermusyawarah dengan ulama atau lembaga yang berwenang. Perbedaan pendapat (ikhtilaf) di antara mazhab dapat saja ada.',
        ],
      },
      {
        h: 'Akun Anda',
        p: [
          'Anda bertanggung jawab menjaga kerahasiaan kata sandi dan atas seluruh aktivitas yang terjadi melalui akun Anda. Berikan data yang benar saat membuat akun. Bila Anda mengetahui penggunaan akun tanpa izin, segera hubungi kami.',
        ],
      },
      {
        h: 'Penggunaan yang wajar',
        p: [
          'Anda setuju untuk tidak: menyalahgunakan layanan, mengirim konten yang melanggar hukum atau kesusilaan, membebani server secara berlebihan termasuk melalui otomatisasi, maupun mencoba mengakses sistem atau data orang lain tanpa izin.',
          'Ketentuan ini berlaku penuh dalam fitur komunitas. Kami dapat menghapus konten komunitas yang melanggar, membatasi akses pengguna yang melanggar, serta menindak lanjuti laporan antar-pengguna; Anda dapat memblokir pengguna lain kapan saja dari halaman profil anggotanya.',
        ],
      },
      {
        h: 'Konten Anda',
        p: [
          'Konten yang Anda buat (penanda, catatan, hafalan, refleksi, percakapan yang Anda simpan) tetap milik Anda. Agar layanan dapat berfungsi, Anda memberi kami lisensi terbatas untuk menyimpan, memproses, dan menampilkan kembali konten tersebut kepada Anda di berbagai perangkat.',
        ],
      },
      {
        h: 'Kekayaan intelektual',
        p: [
          'Aplikasi, merek Sohibna, dan kode perangkat lunaknya dimiliki PT. FRAME DIGITAL SOLUSINDO. Teks Al-Qur\'an, terjemahan, dan tafsir merupakan hak masing-masing penerbit dan lembaga, dan ditampilkan dengan atribusi yang menempel padanya.',
        ],
      },
      {
        h: 'Dukungan sukarela',
        p: [
          'Dukungan sukarela untuk operasional Sohibna disalurkan melalui halaman donasi di situs web kami (sohibna.com), di luar aplikasi. Dukungan tidak membuka fitur, konten, maupun keistimewaan apa pun di dalam aplikasi, dan yang telah diterima tidak dapat dikembalikan, kecuali diwajibkan oleh hukum yang berlaku.',
        ],
      },
      {
        h: 'Fitur gratis dan berbayar',
        p: [
          'Fitur inti ibadah — membaca dan menghafal Al-Qur\'an, jadwal shalat, adzan, kibla, dzikir — tetap gratis. Di dalam aplikasi tersedia pembelian opsional: paket "Supporter" dan "Premium" di bawah program Sohibna+ (langganan bulanan/tahunan atau sekali bayar seumur hidup), yang memperluas kuota fitur bantu seperti Tanya AI dan setoran hafalan serta membuka sentuhan tampilan khusus (lencana, dekorasi profil, dan tema tertentu).',
          'Seluruh pembayaran diproses melalui Google Play Billing dan tunduk pada ketentuan Google Play, termasuk cara berlangganan, pembatalan, dan pengembalian dana. Sebagian fitur berbayar dapat dicoba gratis dalam jangka waktu terbatas.',
        ],
      },
      {
        h: 'Program Mitra',
        anchor: 'mitra',
        p: [
          'Program Mitra memungkinkan setiap pengguna yang telah masuk mengajak orang lain memakai Sohibna melalui tautan atau kode rujukan, dan memperoleh komisi dari pembelian berbayar di Google Play oleh pengguna yang mendaftar lewat rujukan tersebut. Ketentuan lengkap program tercantum di dalam aplikasi (Saya → Program Mitra → Ketentuan Program Mitra) dan berlaku sebagai bagian dari Syarat & Ketentuan ini.',
          'Komisi merupakan persentase dari pendapatan bersih — harga pembelian setelah potongan toko dan pajak — dan berlaku untuk pembelian pertama serta setiap perpanjangan langganan berikutnya. Klik, pendaftaran, instalasi, ulasan, dan peringkat tidak pernah dibayar. Program bersifat satu tingkat, terpisah dari dukungan sukarela, dan tidak melibatkan dana zakat, infaq, atau sedekah.',
          'Rate komisi, masa mengendap, dan minimum pencairan dapat kami ubah; perubahan berlaku untuk pembayaran yang tercatat setelahnya dan ditampilkan di dalam aplikasi. Komisi yang telah dicairkan tetap menjadi hak Anda. Kami dapat membatalkan komisi dan menangguhkan keanggotaan bila terjadi pelanggaran, misalnya rujukan ke akun sendiri, pemberian insentif untuk ulasan atau instalasi, atau spam.',
          'Pencairan dilakukan melalui transfer setelah data rekening dikonfirmasi di luar aplikasi. Pajak atas komisi merupakan tanggung jawab Anda sesuai ketentuan yang berlaku. Mitra menyatakan berusia 18 tahun ke atas atau memiliki izin wali.',
        ],
      },
      {
        h: 'Perubahan dan penghentian layanan',
        p: [
          'Kami dapat mengubah, menambah, mengurangi, atau menghentikan sebagian atau seluruh layanan sewaktu-waktu dengan pemberitahuan yang wajar. Anda dapat berhenti menggunakan Sohibna kapan saja, termasuk dengan menghapus akun Anda dari dalam aplikasi.',
        ],
      },
      {
        h: 'Hukum yang berlaku dan sengketa',
        p: [
          'Syarat ini tunduk pada hukum Republik Indonesia. Sengketa diupayakan diselesaikan secara musyawarah; apabila tidak tercapai, penyelesaiannya melalui pengadilan yang berwenang di Indonesia.',
        ],
      },
      {
        h: 'Pengguna Google Play',
        p: [
          'Bagi Anda yang mengunduh Sohibna dari Google Play: Syarat & Ketentuan ini tidak membatasi hak-hak yang diberikan Google kepada Anda, dan sengketa terkait pengedaran melalui Play Store tunduk pada ketentuan Google Play. Hubungi kami: support@sohibna.com.',
        ],
      },
    ],
  },
}
