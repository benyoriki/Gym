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
