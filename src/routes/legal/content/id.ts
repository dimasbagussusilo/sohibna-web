import type { LegalContent } from './index'

// Bahasa Indonesia — authoritative source. Facts grounded in the actual data
// flows of the Go API + clients (email auth, Firebase Google sign-in, S3/MinIO
// avatars, Groq LLM, Gemini embeddings, BigDataCloud geocoding, local-only
// notifications, no analytics SDK, no ads).

export const content: LegalContent = {
  privacy: {
    title: 'Kebijakan Privasi',
    metaDescription:
      'Bagaimana Sohibna mengumpulkan, menggunakan, dan melindungi data Anda — tanpa iklan, tanpa pelacak, tanpa penjualan data.',
    updatedLabel: 'Terakhir diperbarui',
    updated: '9 November 2026',
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
          'Untuk menghadirkan fitur baca, hafalan, dan progres, kami menyimpan data yang Anda buat di dalam aplikasi: penanda dan ayat favorit, label, catatan bacaan terakhir, target khatam beserta progresnya, target hafalan dan status hafalan per ayat, antrean murajaah, catatan refleksi harian beserta suasana hati, riwayat percakapan AI yang Anda simpan, serta preferensi dan pengaturan aplikasi.',
          'Data ini disinkronkan ke akun Anda agar tersedia di seluruh perangkat. Anda bebas tidak membuat akun — sebagian besar fitur tetap dapat dipakai tanpa akun.',
        ],
      },
      {
        h: 'Lokasi Anda',
        p: [
          'Jadwal shalat dan arah kibla dihitung di perangkat Anda. Untuk menampilkan nama kota, koordinat dikirim ke layanan geocoding pihak ketiga (BigDataCloud) tanpa disertai identitas Anda. Kami tidak menyimpan riwayat lokasi Anda di server.',
        ],
      },
      {
        h: 'Fitur AI kami',
        p: [
          'Saat Anda menggunakan Tanya AI, Kitab AI, atau Refleksi, pertanyaan Anda beserta konteks percakapan dikirim ke layanan model bahasa pihak ketiga (Groq) untuk menghasilkan jawaban, dan proses pencarian rujukan kitab menggunakan layanan embedding Google (Gemini).',
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
        h: 'Tanpa iklan, tanpa pelacak',
        p: [
          'Sohibna tidak menampilkan iklan dan tidak menyertakan SDK analitik pihak ketiga. Kami tidak menjual, tidak menyewakan, dan tidak memperdagangkan data Anda kepada siapa pun.',
        ],
      },
      {
        h: 'Pihak ketiga',
        p: [
          'Dalam menjalankan layanan, kami bekerja sama dengan: penyedia hosting dan basis data, penyimpanan berkas, layanan pengiriman email (Brevo), Google (Firebase Authentication dan Gemini), Groq (model AI), layanan geocoding BigDataCloud, serta Google Play bila Anda mengunduh aplikasi dari sana. Masing-masing memproses data hanya sejauh diperlukan untuk fungsi tersebut.',
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
    updated: '9 November 2026',
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
          'Sohibna adalah aplikasi pendamping ibadah dan pembelajaran Islam: membaca dan menghafal Al-Qur\'an, jadwal shalat, arah kibla, kalender hijriah, dzikir, pembelajaran shalat dan iqro, serta diskusi literatur Islam berbantuan AI.',
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
          'Fitur "Dukung Kami" memungkinkan Anda memberikan dukungan sukarela untuk operasional aplikasi. Dukungan tidak membuka fitur, konten, maupun keistimewaan apa pun, dan yang telah diterima tidak dapat dikembalikan, kecuali diwajibkan oleh hukum yang berlaku.',
        ],
      },
      {
        h: 'Fitur berbayar di kemudian hari',
        p: [
          'Apabila di kemudian hari kami menyediakan langganan berbayar (misalnya Sohibna+), transaksinya akan diproses melalui Google Play Billing dan tunduk pada ketentuan Google Play. Fitur inti ibadah — Al-Qur\'an, jadwal shalat, adzan, kibla — tetap gratis.',
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
