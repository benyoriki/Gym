# FUN FITNESS — prototype (statis, GitHub Pages)
Struktur **datar**: semua file di root repo (HTML, CSS, JS, gambar). Semua path relatif.
## Menjalankan
Buka `index.html` di browser, atau unggah semua isi folder ke repo GitHub → Settings → Pages → Deploy from branch (root).
## Akun demo (hanya pengujian lokal)
admin / admin123 · budi / member123 (sari, andi juga member123). Bukan keamanan produksi.
## Gambar yang perlu diunggah (taruh di root)
`hero-gym.jpg`, `gym-interior.jpg` (foto asli gym), folder `promo/` (poster promo). `logo.png` dan `favicon.png` sudah dibuat dari logo yang Anda kirim.
## Keterbatasan
- localStorage hanya ada di browser/perangkat itu; admin TIDAK melihat pendaftaran dari HP lain.
- Login/role di JavaScript bukan keamanan nyata; hash password di sini hanya untuk demo.
- Audit log dapat diubah pengguna.
- Harga/paket diubah di Admin → Paket & Promo (tanpa edit kode). Kontak/alamat di Admin → Pengaturan.
## Browser
Kode ES5 (kecuali sedikit ES6 di admin/member untuk Chrome/Firefox yang masih berjalan di Windows 7). Tanpa library eksternal.
## Checklist uji
Daftar member → login → ajukan paket → admin setujui (masa aktif bertambah, klik ganda tidak memproses ulang) → check-in → laporan & CSV → ganti tema → reset data.

## Redesign 2026
Foto yang perlu diunggah ke root: `hero-gym.jpg`, `gym-interior.jpg`, `gym-treadmill.jpg`, `gym-dumbbell.jpg`, `gym-mesin.jpg` (jika belum ada, galeri menampilkan placeholder bertuliskan nama file). `logo.png` dipakai juga untuk pratinjau WhatsApp (Open Graph); disarankan membuat `og.jpg` 1200x630.
Catatan penting: data paket/promo diedit admin tersimpan di localStorage browser admin saja. Pengunjung lain tetap melihat data awal sampai sistem dipindah ke Firebase.

## Final polish (v3)
- Modal untuk perpanjang, hapus, setujui/tolak pembayaran, edit member, dan reset (tanpa `prompt()`).
- Tabel menjadi kartu di layar ≤600px. Dashboard admin: pengingat membership akan berakhir (tautan WhatsApp) dan ringkasan pembayaran.
- Galeri hanya menampilkan foto yang ada; jika belum ada foto sama sekali, tampil pesan "segera hadir".
- Foto yang perlu diunggah ke root: `hero-gym.jpg`, `gym-interior.jpg`, `gym-treadmill.jpg`, `gym-dumbbell.jpg`, `gym-mesin.jpg`. Gunakan JPEG/WebP ≤200 KB (hero ≤300 KB, lebar 1600px).
- Kompatibilitas: butuh browser setara Chrome 80+/Firefox 78+ (fallback ukuran font untuk `clamp()` sudah ada). Belum diuji di Windows 7 sungguhan.
- Jika di HP tampil seperti desktop, matikan "Situs desktop" di menu browser.

## v4 — Tampilan canggih + loading screen
- `loader.js`: loading screen 3 detik (logo + progress bar), tampil sekali per sesi browser/tab. Untuk menonton lagi, buka tab baru. Tema gelap/terang kini diterapkan sebelum halaman tampil (tanpa kedip).
- Hero baru (glow merah, watermark logo, huruf miring), strip info berjalan, bar CTA bawah di HP (Daftar + WhatsApp).
- Kartu member digital dengan bar sisa masa aktif; statistik 2 kolom di HP; tombol aksi tabel di HP tersusun rapi.

## v5
- Tombol "Kembali ke beranda" di login dan register.
- Beranda: section "Sedang di gym" = member yang di-check-in admin dalam 3 jam terakhir (nama depan, foto, level). Hanya tampil jika member mengizinkan (kotak centang di dashboard member, default aktif). Data berasal dari localStorage browser yang sama.
- Dashboard member: foto profil dengan crop bulat (geser + zoom), otomatis WebP 256x256 (fallback JPEG), level (Lv1 Pemula 0–4 kunjungan, Lv2 Rutin 5–14, Lv3 Konsisten 15–29, Lv4 Atlet 30–59, Lv5 Elite 60+), peringkat, dan Top 5.
- Admin: drawer HP punya latar redup dan menutup saat disentuh di luar; angka statistik menghitung naik.

## v6
- Logo baru (emblem sayap) di semua tempat: `logo.png`, `favicon.png`, ikon PWA (`icon-192/512/maskable`, `icon-180`), `og.png` (pratinjau WhatsApp). Nama "FUN FITNESS" tampil di navbar, login, sidebar admin, dashboard member, footer, dan loading screen.
- Admin → Laporan: **Unduh PDF** (A4, header merah, kartu ringkasan, tabel penjualan/transaksi/member yang perlu ditindaklanjuti) dan **Unduh Excel** (.xlsx asli, 4 sheet: Ringkasan, Transaksi, Member, Kunjungan). Dibuat di browser, tanpa library. Data sesuai filter periode.
- **PWA**: `manifest.webmanifest`, `sw.js` (cache offline), `pwa.js` (tombol "Pasang Aplikasi"). Syarat: dibuka lewat HTTPS (GitHub Pages sudah HTTPS), bukan file://.
  - Android Chrome: tombol "Pasang Aplikasi" atau menu ⋮ → Instal aplikasi.
  - Windows 7: gunakan Chrome versi terakhir yang masih mendukung Windows 7 (109) atau Edge setara → menu ⋮ → Instal FUN FITNESS. Firefox desktop tidak mendukung pasang PWA.
  - iPhone: Safari → Bagikan → Tambah ke Layar Utama.
  - Setelah mengubah file, naikkan `V` di `sw.js` (mis. `ff-v7`) agar pengguna mendapat versi terbaru.
- Dashboard member: dua kolom di PC; avatar daftar Top 5 tidak lagi lonjong.

## v7 — Tampilan modern
- Beranda: navbar kaca (blur) dengan penanda bagian aktif, bar progres scroll, animasi muncul halus (nonaktif jika "kurangi gerakan"), label bagian bernomor, bagian Tentang dengan kartu info dari data (jam buka, harga mulai dari, PT), kartu lokasi bergaya peta dengan tombol Petunjuk Arah, galeri kosong kini menampilkan tombol Instagram.
- Admin: kartu sapaan + aksi cepat, bar status membership berwarna dengan legenda, grafik berwarna per status, halaman Laporan berupa kartu KPI, tabel otomatis menjadi kartu hingga lebar 1100px.
- Banner petunjuk muncul jika HP memakai "Situs desktop" (matikan agar tampilan pas di HP).
- Naikkan versi cache PWA ke `ff-v7`.

## v8
- **Harga reguler dari poster "Harga Member"** (10 paket: Dewasa & Pelajar × 2 minggu, 1, 3, 6, 12 bulan), biaya **Visit Rp 30.000** dan **Registrasi Rp 25.000**, kontak WhatsApp **0812-8390-2845**, dan Facebook "FIT CENTER". Tampil di beranda (tab Dewasa/Pelajar) dan dikelola admin: Paket & Promo (kolom Hari untuk paket 2 minggu), Pengaturan (kontak, biaya, nomor tombol WhatsApp), Kunjungan (Catat visit harian), dan persetujuan pembayaran (centang biaya registrasi member baru). Laporan, PDF, dan Excel memuat "Pendapatan per kategori".
- Data lama otomatis dimigrasi (skema v2) tanpa menimpa harga/ubahan admin. Poster berusia sekitar 2 tahun: **konfirmasi harga** lalu ubah di Admin → Paket & Promo bila perlu.
- **Pratinjau WhatsApp**: `og.jpg` (1200×630, 212 KB) + judul/deskripsi Open Graph di `index.html`. WhatsApp menyimpan pratinjau lama; jika gambar tidak berubah, kirim ulang tautan dengan tambahan `?v=2` atau ganti nama file `og.jpg`. Tombol "Bagikan" memakai pesan di Admin → Pengaturan.
- **PWA**: `cek-pwa.html` (diagnosis otomatis), tangkapan layar di manifest, strategi cache network-first (versi terbaru saat online, offline tetap jalan), panduan "Cara pasang aplikasi", info pembaruan.

## v9 — PWA, tombol Live, data demo, notifikasi
- **PWA dapat dipasang**: `manifest.webmanifest` kini punya `id` unik (`/Gym/fun-fitness`, supaya tidak bentrok dengan PWA lain di `benyoriki.github.io`), `display_override`, ikon shortcut. Tombol **Pasang Aplikasi** selalu terlihat (sebelumnya hanya muncul setelah browser mengirim event dan tersembunyi di menu ☰), ada kartu ajakan pasang di beranda, dan panduan otomatis untuk Android / PC / iPhone / browser di dalam aplikasi (WhatsApp, Instagram). `sw.js` v9 memperbaiki respons redirect dan menambah handler klik notifikasi. Cek status di `cek-pwa.html`.
- **Tombol Live** (`live.js`): bagian "Sedang di gym" diganti tombol melayang kanan-bawah (seperti chat box). Panel punya tab *Sedang di gym* dan *Peringkat* (Bulan ini / Semua waktu). Hanya nama depan + foto member yang mengizinkan.
- **Data demo** (`demo.js`): 24 member, ±980 kunjungan, 44 transaksi (semua status), notifikasi, log. Semua bertanda `demo:true`.
- **Notifikasi** (`notif.js`): lonceng di admin & dashboard member, toast realtime lintas tab, notifikasi perangkat (Notification API), badge ikon aplikasi. Notifikasi push dari server sungguhan butuh backend (Firebase Cloud Messaging).
- **Admin → Uji Coba & Demo** (`sim.js`): simulasi real-time, picu kejadian manual, skenario uji, dan tombol **Hapus data demo, mulai data asli** (data asli & akun admin tidak terhapus).
- Loading screen memuat "sistem & website benyoriki.com" (tautan tab baru). Teks "Prototipe sistem & website gym, testing benyoriki.com ↗" di footer, login, register, admin, dashboard member.
- Setelah deploy: Chrome/Android yang sudah pernah membuka situs perlu membuka ulang sekali agar service worker v9 aktif. Jika dulu sudah pernah memasang versi lama, hapus aplikasi lama lalu pasang lagi (ID aplikasi berubah).

## v10 — Tampilan baru "panel telemetri latihan"
- `ui.css` (dimuat paling akhir di semua halaman) menggantikan tampilan: grid + glow murni CSS (tanpa foto berat), sudut miring khas logo, tombol gradien, kartu dengan sorotan kursor di PC, tema terang tetap berfungsi.
- Font **Chakra Petch** di-host sendiri (`cp-700.woff2`, `cp-700i.woff2`, `cp-500.woff2`, ±30 KB total) agar judul sama di Android, iPhone, dan PC. Sebelumnya memakai Bahnschrift/Oswald yang tidak ada di HP.
- Hero: kartu **Gym Live** (`fx.js`) berisi jam, jumlah sedang di gym, check-in hari ini, member aktif, dan grafik **jam ramai** (rata-rata 14 hari terakhir) dari data nyata; tombolnya membuka panel Live.
- Navbar HP menjadi menu layar penuh; tombol Live mengecil jadi ikon saat scroll agar tidak menutupi harga; bar bawah mengikuti safe-area HP.
- Loading screen: cincin progres + tautan benyoriki.com. Admin dan dashboard member: header satu baris di HP, kartu member baru, panel samping admin baru.
- Foto `hero-gym.jpg` tidak lagi diminta oleh CSS (sebelumnya 404). Service worker `ff-v10`.
