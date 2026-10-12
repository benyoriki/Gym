/* Service worker FUN FITNESS v9: halaman/JS/CSS network-first (selalu terbaru saat online, fallback cache saat offline); gambar cache-first. Naikkan V saat rilis. */
var V='ff-v9',A=['./','index.html','login.html','register.html','member.html','admin.html','cek-pwa.html','style.css','auth.css','member.css','admin.css','storage.js','demo.js','app.js','pwa.js','auth.js','notif.js','sim.js','live.js','public.js','member.js','admin.js','avatar.js','export.js','loader.js','logo.png','favicon.png','icon-192.png','icon-512.png','og.jpg','manifest.webmanifest'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(A.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
function put(r,res){if(res&&res.ok&&(res.type==='basic'||res.type==='default')){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}return res}
/* respons hasil redirect tidak boleh dipakai untuk navigasi: salin menjadi respons biasa */
function clean(res){if(res&&res.redirected){return res.blob().then(function(b){return new Response(b,{status:res.status,statusText:res.statusText,headers:res.headers})})}return res}
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
if(r.destination==='image'){e.respondWith(caches.match(r).then(function(h){return h||fetch(r).then(function(res){return put(r,res)})}));return}
e.respondWith(fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(clean).then(function(res){return put(r,res)}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(h){return h||(r.mode==='navigate'?caches.match('index.html'):Response.error())})}))});
/* ketuk notifikasi perangkat: fokus ke jendela yang terbuka atau buka halaman */
self.addEventListener('notificationclick',function(e){e.notification.close();var u=(e.notification.data&&e.notification.data.url)||'./';
e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(l){for(var i=0;i<l.length;i++){if('focus' in l[i])return l[i].focus()}return self.clients.openWindow(u)}))});
