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
