/* Notifikasi: lonceng + panel + toast + notifikasi perangkat (Notification API) + badge ikon aplikasi.
   Realtime lintas tab/jendela lewat event 'storage'. Server push sungguhan memerlukan backend (Firebase Cloud Messaging). */
(function(w,d){
var FF=w.FF,db=FF.db,E=FF.esc,seen={},inited=false,panel=null,btn=null,who=null;
function me(){var s=db.session();return s?(s.role==='admin'?'admin':s.id):null}
function ago(iso){var s=Math.max(0,(Date.now()-new Date(iso).getTime())/1000);if(s<45)return'baru saja';if(s<3600)return Math.round(s/60)+' mnt lalu';if(s<86400)return Math.round(s/3600)+' jam lalu';return Math.round(s/86400)+' hari lalu'}
var IC={tx:'<path d="M3 6h18v12H3zM3 10h18"/>',member:'<path d="M16 8a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21a8 8 0 0 1 16 0"/>',visit:'<path d="M5 12l5 5L20 7"/>',warn:'<path d="M12 8v5M12 17h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',info:'<path d="M12 11v5M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>'};
var CL={tx:'#F0B429',member:'#3B82F6',visit:'#2ECC71',warn:'#F04432',info:'#A6ADB7'};
function ico(t){t=IC[t]?t:'info';return'<span class="nic" style="color:'+CL[t]+'"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+IC[t]+'</svg></span>'}
function badge(){var n=who?db.unread(who):0;if(btn){var b=btn.querySelector('.nb');if(b){b.textContent=n>9?'9+':n;b.hidden=!n}btn.setAttribute('aria-label','Notifikasi'+(n?', '+n+' belum dibaca':''))}
 try{if(navigator.setAppBadge){n?navigator.setAppBadge(n):navigator.clearAppBadge()}}catch(e){}}
function list(){if(!panel)return;var l=db.notifs(who).slice(0,30),perm=('Notification' in w)?Notification.permission:'unsupported';
 panel.innerHTML='<div class="nh"><b>Notifikasi</b><span><button class="btn s" data-n="read">Tandai dibaca</button> <button class="btn s" data-n="x" aria-label="Tutup">✕</button></span></div>'+
 (perm==='default'?'<div class="nperm">Terima pemberitahuan di perangkat saat ada transaksi atau aktivitas baru. <button class="btn s p" data-n="perm">Aktifkan</button></div>':perm==='denied'?'<div class="nperm">Notifikasi perangkat diblokir di pengaturan browser.</div>':'')+
 '<div class="nl">'+(l.length?l.map(function(n){return'<div class="ni'+(n.read?'':' un')+'">'+ico(n.type)+'<div><b>'+E(n.title)+(n.demo?' <span class="bd y">DEMO</span>':'')+'</b><span>'+E(n.text)+'</span><small>'+ago(n.at)+'</small></div></div>'}).join(''):'<p class="mut" style="padding:16px;margin:0">Belum ada notifikasi.</p>')+'</div>'}
function open(){if(!panel)return;list();panel.hidden=false;btn&&btn.setAttribute('aria-expanded','true');setTimeout(function(){if(panel&&!panel.hidden){db.readAll(who);badge()}},1800)}
function close(){if(panel)panel.hidden=true;btn&&btn.setAttribute('aria-expanded','false')}
function push(n){try{if(!('Notification' in w)||Notification.permission!=='granted'||!d.hidden)return;
 var o={body:n.text,icon:'icon-192.png',badge:'favicon.png',tag:n.id,data:{url:location.href}};
 if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(function(r){r.showNotification(n.title,o)});else new Notification(n.title,o)}catch(e){}}
function incoming(n){if(!who||n.to!==who||seen[n.id])return;seen[n.id]=1;badge();if(panel&&!panel.hidden)list();
 if(!d.hidden)FF.toast(n.title+' — '+n.text,n.type==='warn'?'err':'');push(n)}
FF.notified=incoming;
w.addEventListener('storage',function(e){if(e.key&&e.key!=='ff_notifs')return;if(!who)who=me();if(!who)return;db.list('notifs').forEach(function(n){if(!seen[n.id]&&n.to===who)incoming(n);seen[n.id]=1});badge();if(panel&&!panel.hidden)list()});
FF.bell={mount:function(slot,id){if(!slot)return;who=id||me();if(!inited){inited=true;db.list('notifs').forEach(function(n){seen[n.id]=1})}
 btn=d.createElement('button');btn.className='btn s bell';btn.type='button';btn.setAttribute('aria-haspopup','dialog');btn.setAttribute('aria-expanded','false');
 btn.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg><i class="nb" hidden>0</i>';
 slot.innerHTML='';slot.appendChild(btn);
 if(!panel){panel=d.createElement('div');panel.id='np';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Notifikasi');d.body.appendChild(panel);
  panel.addEventListener('click',function(e){var a=e.target.getAttribute&&e.target.getAttribute('data-n');if(a==='x')close();if(a==='read'){db.readAll(who);badge();list()}
   if(a==='perm'&&'Notification' in w)Notification.requestPermission().then(function(){list();FF.toast(Notification.permission==='granted'?'Notifikasi perangkat aktif':'Izin notifikasi tidak diberikan')})});
  d.addEventListener('click',function(e){if(panel.hidden)return;if(panel.contains(e.target)||(btn&&btn.contains(e.target)))return;close()});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){close();btn&&btn.focus()}});
  setInterval(function(){if(!panel.hidden)list()},30000)}
 btn.addEventListener('click',function(){panel.hidden?open():close()});badge()}};
d.addEventListener('DOMContentLoaded',function(){who=me();var s=d.getElementById('bellslot');if(s&&who)FF.bell.mount(s,who);if(who)db.checkExpiry()});
})(window,document);
