/* PWA v9: service worker, tombol "Pasang Aplikasi" yang selalu terlihat (sampai terpasang), kartu ajakan pasang,
   dan panduan khusus per perangkat (Android, PC, iPhone, browser di dalam aplikasi). */
(function(w,d){var dp=null,h=d.documentElement,FF=w.FF=w.FF||{},ua=navigator.userAgent||'',card=null,SW=false;
function add(c){if((' '+h.className+' ').indexOf(' '+c+' ')<0)h.className+=' '+c}
function rm(c){h.className=h.className.split(' ').filter(function(x){return x&&x!==c}).join(' ')}
function mm(q){return w.matchMedia&&matchMedia(q).matches}
var standalone=mm('(display-mode: standalone)')||mm('(display-mode: minimal-ui)')||mm('(display-mode: window-controls-overlay)')||navigator.standalone===true;
if(standalone)add('is-app');
var ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),
safari=ios&&/safari/i.test(ua)&&!/crios|fxios|edgios|fbav|instagram/i.test(ua),
inApp=/FBAN|FBAV|Instagram|Line\/|MicroMessenger|WhatsApp|TikTok|musical_ly|Telegram|; wv\)/i.test(ua),
android=/android/i.test(ua);
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){
var had=!!navigator.serviceWorker.controller;
w.addEventListener('load',function(){navigator.serviceWorker.register('sw.js',{scope:'./'}).then(function(){SW=true}).catch(function(){})});
navigator.serviceWorker.addEventListener('controllerchange',function(){if(had&&FF.toast)FF.toast('Aplikasi diperbarui. Muat ulang untuk versi terbaru.')})}
function dismissed(){try{var t=+localStorage.getItem('ff_ipw');return t&&Date.now()-t<6048e5}catch(e){return false}}
function hideCard(rem){if(card&&card.parentNode)card.parentNode.removeChild(card);card=null;if(rem){try{localStorage.setItem('ff_ipw',Date.now())}catch(e){}}}
function showCard(){if(card||standalone||dismissed()||!d.body||!d.body.classList.contains('hasbar')||(!dp&&!safari))return;
card=d.createElement('div');card.id='ipw';card.setAttribute('role','dialog');card.setAttribute('aria-label','Pasang aplikasi');
card.innerHTML='<img src="icon-192.png" alt="" width="44" height="44"><div><b>Pasang Nama GYM</b><span>Buka cepat dari layar utama, layar penuh, dan tetap bisa dibuka saat offline.</span></div><button type="button" class="btn p s" data-i="go">'+(dp?'Pasang':'Cara pasang')+'</button><button type="button" class="btn s" data-i="no" aria-label="Nanti saja">✕</button>';
d.body.appendChild(card)}
function later(){if(d.readyState==='complete')setTimeout(showCard,3800);else w.addEventListener('load',function(){setTimeout(showCard,3800)})}
w.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;add('can-install');w.__ffPrompt=true;later()});
w.addEventListener('appinstalled',function(){dp=null;hideCard();add('is-app');standalone=true;if(FF.toast)FF.toast('Nama GYM berhasil dipasang')});
if(safari)later();
FF.installHelp=function(){var m,t='Pasang aplikasi Nama GYM';
if(standalone){FF.dlg(t,'<p>Aplikasi sudah terpasang dan sedang dibuka sebagai aplikasi.</p>','Tutup',function(){});return}
if(!w.isSecureContext){m='<p class="no">Halaman ini tidak dibuka lewat <b>https</b>, jadi browser tidak mengizinkan pemasangan. Buka lewat alamat https:// (contoh GitHub Pages), bukan file lokal.</p>'}
else if(inApp){m='<p><b>Kamu membuka lewat browser di dalam aplikasi</b> (WhatsApp, Instagram, Facebook, dsb). Browser ini tidak bisa memasang aplikasi.</p><ol class="how"><li>Ketuk menu <b>⋮</b> atau ikon bagikan di pojok layar.</li><li>Pilih <i>Buka di browser</i> / <i>Open in Chrome</i> (iPhone: <i>Buka di Safari</i>).</li><li>Setelah terbuka di Chrome/Safari, ketuk <b>Pasang Aplikasi</b> lagi.</li></ol>'}
else if(ios){m=safari?'<ol class="how"><li>Ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas) di bawah layar.</li><li>Gulir lalu pilih <i>Tambah ke Layar Utama</i>.</li><li>Ketuk <i>Tambah</i>. Ikon Nama GYM muncul di layar utama.</li></ol>':'<p>Di iPhone/iPad, pemasangan hanya bisa lewat <b>Safari</b>. Buka alamat ini di Safari, lalu ketuk Bagikan → <i>Tambah ke Layar Utama</i>.</p>'}
else if(android){m='<ol class="how"><li>Pakai <b>Chrome</b> (atau Edge/Samsung Internet) versi terbaru.</li><li>Ketuk menu <b>⋮</b> di pojok kanan atas.</li><li>Pilih <i>Instal aplikasi</i> atau <i>Tambahkan ke layar utama</i>.</li></ol><p class="mut">Jika menu itu belum ada: muat ulang halaman, tunggu beberapa detik, lalu buka menu ⋮ lagi. Pastikan Chrome sudah versi terbaru dan penyimpanan HP tidak penuh.</p>'}
else{m='<ol class="how"><li><b>Chrome / Edge (Windows, Mac, Linux):</b> klik ikon pasang <b>⊕</b> di kolom alamat (sebelah kanan), atau menu <b>⋮</b> → <i>Instal Nama GYM</i> / <i>Simpan dan bagikan → Instal</i>.</li><li><b>Windows 7:</b> pakai Chrome 109 (versi terakhir untuk Windows 7).</li><li><b>Firefox desktop</b> belum mendukung pasang aplikasi web. Pakai Chrome atau Edge.</li></ol><p class="mut">Jika ikon belum muncul: muat ulang halaman sekali dan tunggu beberapa detik.</p>'}
FF.dlg(t,m+'<p class="mut" style="margin-top:12px">Butuh pemeriksaan? <a href="cek-pwa.html">Cek status PWA</a></p>','Tutup',function(){})};
FF.installNow=function(){if(dp){var p=dp;p.prompt();p.userChoice.then(function(c){dp=null;rm('can-install');hideCard();if(c&&c.outcome==='accepted'&&FF.toast)FF.toast('Memasang aplikasi…')})}else FF.installHelp()};
FF.pwa={canInstall:function(){return!!dp},standalone:function(){return standalone}};
d.addEventListener('click',function(e){var t=e.target,b=t.closest&&t.closest('.pwa'),hp=t.closest&&t.closest('.pwa-help'),i=t.closest&&t.closest('[data-i]');
if(i){var k=i.getAttribute('data-i');if(k==='go'){hideCard(true);FF.installNow()}else hideCard(true);return}
if(b){FF.installNow()}
if(hp){e.preventDefault();FF.installHelp()}});
})(window,document);
