/* PWA: service worker, tombol "Pasang Aplikasi", panduan pasang, deteksi sudah terpasang, info pembaruan. */
(function(w,d){var dp=null,h=d.documentElement,FF=w.FF=w.FF||{};
function add(c){if(h.className.indexOf(c)<0)h.className+=' '+c}
function off(){h.className=h.className.replace(' can-install','')}
if(w.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone)add('is-app');
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){
var had=!!navigator.serviceWorker.controller;
w.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
navigator.serviceWorker.addEventListener('controllerchange',function(){if(had&&FF.toast)FF.toast('Aplikasi diperbarui. Muat ulang untuk versi terbaru.')})}
w.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;add('can-install');w.__ffPrompt=true});
w.addEventListener('appinstalled',function(){dp=null;off();add('is-app')});
FF.installHelp=function(){FF.dlg('Pasang aplikasi FUN FITNESS','<ul class="how"><li><b>Android (Chrome):</b> menu ⋮ lalu <i>Instal aplikasi</i> atau <i>Tambahkan ke layar utama</i>.</li><li><b>Windows 7, 10, 11 (Chrome/Edge):</b> klik ikon pasang di kolom alamat, atau menu ⋮ lalu <i>Instal FUN FITNESS</i>. Windows 7 memerlukan Chrome 109 (versi terakhir untuk Windows 7).</li><li><b>iPhone (Safari):</b> tombol Bagikan lalu <i>Tambah ke Layar Utama</i>.</li></ul><p class="mut">Situs harus dibuka lewat https. <a href="cek-pwa.html">Cek status PWA</a></p>','Tutup',function(){})};
d.addEventListener('click',function(e){var t=e.target,b=t.closest&&t.closest('.pwa'),hp=t.closest&&t.closest('.pwa-help');
if(b){if(dp){dp.prompt();dp.userChoice.then(function(){dp=null;off()})}else FF.installHelp()}
if(hp){e.preventDefault();FF.installHelp()}});
})(window,document);
