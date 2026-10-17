/* Simulasi aktivitas (check-in, pendaftaran, pengajuan & persetujuan pembayaran, visit harian) + halaman Admin > Uji Coba & Demo.
   Semua data hasil simulasi diberi tanda demo:true dan hanya menyentuh member demo; dapat dihapus sekali klik. */
(function(w,d){
var FF=w.FF,db=FF.db,E=FF.esc,timer=null,hist=[];
var FN=['Aldi','Bella','Cahyo','Dina','Erik','Fitri','Galih','Hana','Irfan','Julia','Kiki','Lukman','Mega','Naufal','Olla','Pandu','Qori','Raka','Salma','Teguh'],LN=['Wijaya','Hidayat','Kusuma','Maulana','Susanto','Permata','Firmansyah','Rahayu','Putra','Utami'];
function r(n){return Math.floor(Math.random()*n)}function pick(a){return a[r(a.length)]}
function within(fn){db.ctx.demo=true;try{return fn()}finally{db.ctx.demo=false}}
function demoMems(){return db.list('members').filter(function(m){return m.role==='member'&&m.demo})}
function paks(){return db.list('packages').filter(function(p){return p.active&&p.type!=='pt'&&p.price!=null})}
var A={
checkin:function(){return within(function(){var cut=Date.now()-36e5,rc={};db.list('visits').forEach(function(v){if(new Date(v.at).getTime()>=cut)rc[v.memberId]=1});
 var p=demoMems().filter(function(m){var s=db.status(m);return(s==='aktif'||s==='akan berakhir')&&!rc[m.id]});if(!p.length)return'Semua member demo aktif sudah check-in dalam 1 jam terakhir.';
 var m=pick(p);db.add('visits',{memberId:m.id,name:m.name,at:new Date().toISOString()});db.log('Check-in (simulasi)',m.id);
 db.notify({to:'admin',type:'visit',title:'Check-in',text:FF.first(m.name)+' check-in di gym.'});db.notify({to:m.id,type:'visit',title:'Check-in tercatat',text:'Selamat latihan, '+FF.first(m.name)+'!'});return m.name+' check-in'})},
newMember:function(){return within(function(){var ms=db.list('members'),name,un,i=0,pk=pick(paks());do{name=pick(FN)+' '+pick(LN);un=(name.split(' ')[0]+(100+r(900))).toLowerCase();i++}while(ms.some(function(m){return m.username===un})&&i<20);
 var res=FF.auth.register({name:name,username:un,email:un+'@contoh.test',phone:'0812'+(10000000+r(89999999)),password:'member123',password2:'member123',pkg:pk.id,agree:true});
 return res.ok?name+' mendaftar dan mengajukan '+pk.name:'Gagal mendaftar: '+JSON.stringify(res)})},
payRequest:function(){return within(function(){var pend={};db.list('transactions').forEach(function(t){if(t.status==='menunggu')pend[t.memberId]=1});
 var p=demoMems().filter(function(m){return!pend[m.id]&&m.status!=='nonaktif'});if(!p.length)return'Tidak ada member demo yang bisa mengajukan.';var m=pick(p),pk=pick(paks()),t=FF.auth.request(m,pk.id),pr=false;if(t&&FF.pay&&Math.random()<.7)pr=FF.pay.submit(t.id,FF.demo.receipt(m.name,pk.name,pk.price));return t?m.name+' mengajukan '+pk.name+(pr?' dan unggah bukti QRIS':''):'Gagal membuat pengajuan'})},
approve:function(ok){return within(function(){var l=db.list('transactions').filter(function(t){return t.status==='menunggu'&&t.demo});if(!l.length)return'Tidak ada pembayaran demo yang menunggu.';var t=pick(l);
 if(ok!==false)return db.setTx(t.id,'disetujui')?t.memberName+': pembayaran disetujui, masa aktif bertambah':'Gagal memproses '+t.no;
 return db.setTx(t.id,'ditolak','Bukti transfer tidak jelas (simulasi)')?t.memberName+': pembayaran ditolak':'Gagal memproses '+t.no})},
visit:function(){return within(function(){var nm=Math.random()<.5?'Tamu '+pick(FN):pick(FN),fee=+db.settings().feeVisit||0;
 db.add('transactions',{no:'VST-'+Date.now().toString(36).toUpperCase(),memberId:'VISIT',memberName:nm,packageId:'visit',packageName:'Visit harian',amount:fee,date:db.today(),method:'Tunai',status:'disetujui',note:'Visit non-member (simulasi)'});
 db.add('visits',{memberId:'VISIT',name:nm,at:new Date().toISOString(),kind:'visit'});db.log('Visit harian (simulasi)',nm);db.notify({to:'admin',type:'tx',title:'Visit harian',text:nm+' membayar visit '+FF.rp(fee)+' (tunai).'});return nm+' visit harian '+FF.rp(fee)})},
chat:function(){return within(function(){var p=demoMems().filter(function(m){var x=db.status(m);return x==='aktif'||x==='akan berakhir'});if(!p.length)return'Tidak ada member demo aktif.';var m=pick(p),L=['Semangat latihan semua! 💪','Ada yang latihan malam ini?','Mantap hari ini, PR naik! 🔥','Besok leg day, siapa ikut?','Treadmill sebelah kiri kosong nih'];db.add('chat',{memberId:m.id,text:pick(L),at:new Date().toISOString(),r:{}});if(FF.chat)FF.chat.render();return m.name+' mengirim pesan di grup chat'})},
expiring:function(){return within(function(){var p=demoMems().filter(function(m){return db.status(m)==='aktif'});if(!p.length)return'Tidak ada member demo aktif.';var m=pick(p);db.upd('members',m.id,{end:db.addDays(db.today(),2)});db.checkExpiry();return m.name+': masa aktif disetel 2 hari lagi (notifikasi dikirim)'})}
};
function note(msg){hist.unshift({at:new Date().toISOString(),msg:msg});hist=hist.slice(0,12)}
function run(k,a){var msg;try{msg=A[k](a)}catch(e){msg='Error: '+e.message}note(msg);return msg}
var SP={slow:[20000,40000],mid:[8000,20000],fast:[3000,8000]};
function cfg(){var c=db.kget('sim',null);return c&&typeof c==='object'?c:{on:false,speed:'mid'}}
function refresh(){var v=FF.adminView&&FF.adminView();if(FF.refresh&&(v==='overview'||v==='payments'||v==='sim'||v==='visits'))FF.refresh()}
var NOOP=/^(Tidak ada|Semua member|Gagal)/;
function step(){var x=Math.random(),k=x<.45?'checkin':x<.6?'payRequest':x<.78?'approve':x<.85?'visit':x<.9?'chat':x<.96?'newMember':'expiring',msg=A[k](k==='approve'?Math.random()<.85:undefined);
 if(NOOP.test(msg)){var fb=['visit','newMember','payRequest'],i=0;while(NOOP.test(msg)&&i<fb.length){msg=A[fb[i++]]()}}note(msg);return msg}
function loop(){clearTimeout(timer);var c=cfg();if(!c.on)return;var s=SP[c.speed]||SP.mid;timer=setTimeout(function(){step();refresh();loop()},s[0]+r(s[1]-s[0]))}
var SRC={checkin:'Check-in member',newMember:'Member baru mendaftar',payRequest:'Ajukan pembayaran',approve:'Setujui pembayaran',visit:'Visit harian',expiring:'Masa aktif hampir habis',chat:'Pesan di grup chat'};
function html(){var st=FF.demo.stats(),on=FF.demo.on(),c=cfg(),pend=db.list('transactions').filter(function(t){return t.status==='menunggu'&&t.demo}).length;
 return'<div class="grid"><div class="card"><h3>Mode data</h3><p>'+(on?'<span class="bd y">DATA DEMO AKTIF</span>':'<span class="bd g">MODE DATA ASLI</span>')+'</p>'+
 '<p class="mut">Demo: <b>'+st.members+'</b> member · <b>'+st.tx+'</b> transaksi · <b>'+st.visits+'</b> kunjungan · <b>'+st.notifs+'</b> notifikasi.<br>Data asli: <b>'+st.real.members+'</b> member · <b>'+st.real.tx+'</b> transaksi · <b>'+st.real.visits+'</b> kunjungan.</p>'+
 '<div class="row2">'+(on?'<button class="btn s" data-a="sim-reload">Muat ulang data demo</button><button class="btn s p" data-a="sim-purge">Hapus data demo, mulai data asli</button>':'<button class="btn s p" data-a="sim-on">Aktifkan data demo lagi</button>')+'</div>'+
 '<p class="mut" style="font-size:13px;margin:0">Hapus data demo hanya menghapus data bertanda DEMO. Member, transaksi, dan kunjungan asli tetap aman. Akun admin dan paket tidak dihapus.</p></div>'+
 '<div class="card"><h3>Simulasi real-time</h3><p class="mut">Menjalankan aktivitas acak (check-in, pendaftaran, pengajuan &amp; persetujuan pembayaran, visit harian) lengkap dengan notifikasi. Berjalan selama halaman admin terbuka. Buka beranda di tab lain untuk melihat tombol Live berubah.</p>'+
 '<div class="row2"><button class="btn s '+(c.on?'':'p')+'" data-a="sim-toggle">'+(c.on?'Hentikan simulasi':'Mulai simulasi')+'</button><select id="simspeed" aria-label="Kecepatan"><option value="slow"'+(c.speed==='slow'?' selected':'')+'>Pelan (20–40 detik)</option><option value="mid"'+(c.speed==='mid'?' selected':'')+'>Sedang (8–20 detik)</option><option value="fast"'+(c.speed==='fast'?' selected':'')+'>Cepat (3–8 detik)</option></select></div>'+
 (c.on?'<p><span class="live"></span>Simulasi berjalan</p>':'')+'</div></div><br>'+
 '<div class="card"><h3>Picu satu kejadian</h3><div class="row2">'+Object.keys(SRC).map(function(k){return'<button class="btn s" data-a="sim-'+k+'">'+SRC[k]+(k==='approve'&&pend?' ('+pend+')':'')+'</button>'}).join('')+'<button class="btn s" data-a="sim-reject">Tolak pembayaran</button></div>'+
 '<div class="simlog" aria-live="polite">'+(hist.length?hist.map(function(h){return'<div><small>'+FF.jam(h.at).slice(-5)+'</small> '+E(h.msg)+'</div>'}).join(''):'<p class="mut" style="margin:0">Belum ada kejadian. Klik salah satu tombol di atas.</p>')+'</div></div><br>'+
 '<div class="card"><h3>Skenario uji end-to-end</h3><ol class="how"><li>Buka <a href="index.html" target="_blank" rel="noopener">beranda</a> di tab baru, klik tombol <b>Live</b> di kanan bawah: daftar member yang sedang di gym dan peringkat.</li><li>Di tab beranda itu, <a href="register.html" target="_blank" rel="noopener">daftar sebagai member baru</a>. Kembali ke sini: lonceng admin menerima notifikasi <i>Member baru</i> dan <i>Pengajuan pembayaran</i>.</li><li>Buka <b>Pembayaran</b>, setujui pengajuan. Masa aktif bertambah dan member menerima notifikasi (lihat <a href="login.html" target="_blank" rel="noopener">login member</a>: budi / member123).</li><li>Buka <b>Kunjungan</b>, check-in member. Tombol Live di beranda ikut berubah (maks. 1 menit, atau langsung jika tab lain).</li><li>Lihat <b>Laporan</b> (PDF/Excel), grafik di Overview, dan <b>Audit Log</b>.</li><li>Jika semua sesuai: klik <b>Hapus data demo, mulai data asli</b> di atas.</li></ol></div>'}
FF.simUI={html:html,run:run,loop:loop};
d.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-a^="sim-"]');if(!b)return;var a=b.getAttribute('data-a').slice(4);
 if(a==='toggle'){var c=cfg();c.on=!c.on;db.kset('sim',c);loop();FF.toast(c.on?'Simulasi dimulai':'Simulasi dihentikan');FF.refresh();return}
 if(a==='reload'){FF.dlg('Muat ulang data demo','<p>Data demo diganti dengan data demo baru. Data asli tidak berubah.</p>','Muat ulang',function(){FF.demo.reload();FF.toast('Data demo dimuat ulang');FF.refresh()});return}
 if(a==='on'){FF.demo.reload();FF.toast('Data demo aktif');FF.refresh();return}
 if(a==='purge'){FF.dlg('Hapus data demo','<p>Menghapus semua <b>member, transaksi, kunjungan, dan notifikasi bertanda DEMO</b>. Data asli tidak terhapus. Ketik <b>HAPUS</b> untuk lanjut.</p><input name="k" required>','Hapus',function(v){if(v.k!=='HAPUS'){FF.toast('Ketik HAPUS','err');return false}var c=cfg();c.on=false;db.kset('sim',c);clearTimeout(timer);var n=FF.demo.purge();FF.toast(n+' member demo dihapus. Mode data asli aktif.');FF.refresh()});return}
 if(a==='reject'){FF.toast(run('approve',false));FF.refresh();return}
 if(A[a]){FF.toast(run(a));FF.refresh()}});
d.addEventListener('change',function(e){if(e.target.id==='simspeed'){var c=cfg();c.speed=e.target.value;db.kset('sim',c);loop()}});
d.addEventListener('DOMContentLoaded',function(){loop()});
})(window,document);
