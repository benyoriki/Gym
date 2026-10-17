/* pay.js — pembayaran QRIS (QRIS statis + bukti pembayaran + verifikasi admin).
   Alur: member ajukan paket -> scan QRIS & bayar -> unggah bukti -> admin cek & setujui -> masa aktif bertambah.
   QRIS statis tidak membawa nominal, jadi member mengetik nominal yang sama persis. Verifikasi otomatis butuh payment gateway (lihat FIREBASE-MIGRATION.md). */
(function(w,d){
var FF=w.FF,db=FF.db,E=FF.esc;
function S(){return db.settings()}
function on(){return S().qrisOn!=='0'}
function src(){return S().qrisImg||'qris.webp'}
function digits(n){return String(Math.round(+n||0))}
function shrink(file,max,q,cb,err){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var r=Math.min(1,max/Math.max(im.width,im.height)),c=d.createElement('canvas'),x;c.width=Math.max(1,Math.round(im.width*r));c.height=Math.max(1,Math.round(im.height*r));x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);cb(c.toDataURL('image/jpeg',q))};im.onerror=function(){URL.revokeObjectURL(u);if(err)err()};im.src=u}
function modal(html,cls){var o=d.createElement('div');o.className='mo';o.innerHTML='<div class="md pay '+(cls||'')+'" role="dialog" aria-modal="true">'+html+'</div>';d.body.appendChild(o);
 function close(){if(o.parentNode)o.parentNode.removeChild(o)}
 o.addEventListener('click',function(e){if(e.target===o||(e.target.closest&&e.target.closest('[data-pc]')))close()});o.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 var f=o.querySelector('button,input');if(f)f.focus();return{o:o,close:close}}
function copy(t){try{navigator.clipboard.writeText(t).then(function(){FF.toast('Nominal disalin: '+t)},function(){FF.toast('Salin manual: '+t)})}catch(e){FF.toast('Salin manual: '+t)}}
function after(){if(FF.refresh)FF.refresh()}
function submit(id,proof){var t=db.get('transactions',id);if(!t||t.status!=='menunggu')return false;
 if(!db.upd('transactions',id,{method:'QRIS',proof:proof,paidAt:new Date().toISOString()}))return false;
 db.log('Bukti pembayaran QRIS',t.no);
 db.notify({to:'admin',type:'tx',title:'Bukti pembayaran QRIS masuk',text:t.memberName+' membayar '+t.packageName+' '+FF.rp(t.amount)+' via QRIS. Cek bukti lalu setujui.'});
 db.notify({to:t.memberId,type:'tx',title:'Bukti pembayaran diterima',text:'Bukti pembayaran '+t.packageName+' sedang diverifikasi admin. Masa aktif diperbarui setelah disetujui.'});return true}
function show(id){var t=db.get('transactions',id);if(!t)return;if(t.status!=='menunggu'){FF.toast('Transaksi ini sudah '+t.status);return}
 var s=S(),proof=t.proof||'',q=on(),
 qr=q?'<figure class="qrf"><img src="'+E(src())+'" alt="Kode QRIS pembayaran Nama GYM" width="300"><figcaption>'+E(s.qrisName)+'<br><small>NMID: '+E(s.qrisNmid)+'</small></figcaption></figure><div class="prow"><button type="button" class="btn s" data-copy="'+digits(t.amount)+'">Salin nominal</button><a class="btn s" href="'+E(src())+'" download="QRIS-FUN-FITNESS">Unduh QRIS</a></div>':
 '<p class="alert y">QRIS belum diaktifkan oleh admin. Silakan bayar tunai di gym; admin akan mengaktifkan membership setelah pembayaran diterima.</p>',
 steps=q?'<ol class="how pstep"><li>Buka aplikasi e-wallet atau m-banking apa saja, pilih <b>Scan / Bayar QRIS</b>, lalu pindai kode di atas.</li><li>Masukkan nominal <b>'+FF.rp(t.amount)+'</b> (harus sama persis).</li><li>Setelah berhasil, simpan screenshot bukti lalu <b>unggah di bawah</b>.</li></ol>':'',
 up=q?'<div class="field"><label for="pfile">Bukti pembayaran (screenshot)</label><input id="pfile" type="file" accept="image/*"><div class="pprev" id="pprev">'+(proof?'<img src="'+E(proof)+'" alt="Bukti pembayaran">':'')+'</div><div class="err" id="perr"></div></div>':'';
 var m=modal('<h3>Bayar via QRIS</h3><div class="payhd"><span>'+E(t.packageName)+'</span><b>'+FF.rp(t.amount)+'</b><small>'+E(t.no)+(t.paidAt?' · bukti terkirim '+FF.jam(t.paidAt):'')+'</small></div>'+qr+steps+up+
  '<div class="mb pmb">'+(q?'<button type="button" class="btn p" id="psend">'+(t.paidAt?'Kirim ulang bukti':'Saya sudah bayar')+'</button>':'')+'<button type="button" class="btn" id="pcash">Bayar tunai di gym</button><button type="button" class="btn" data-pc>Tutup</button></div>');
 var o=m.o,cp=o.querySelector('[data-copy]');if(cp)cp.onclick=function(){copy(cp.getAttribute('data-copy'))};
 var pf=o.querySelector('#pfile');if(pf)pf.addEventListener('change',function(){var f=pf.files&&pf.files[0],er=o.querySelector('#perr');er.textContent='';if(!f)return;
  shrink(f,900,.72,function(data){proof=data;o.querySelector('#pprev').innerHTML='<img src="'+data+'" alt="Pratinjau bukti">'},function(){er.textContent='File bukan gambar. Pilih screenshot bukti pembayaran.'})});
 var ps=o.querySelector('#psend');if(ps)ps.onclick=function(){var er=o.querySelector('#perr');if(!proof){er.textContent='Unggah screenshot bukti pembayaran dulu.';return}
  if(submit(id,proof)){FF.toast('Bukti terkirim. Menunggu verifikasi admin.');m.close();after()}else er.textContent='Gagal menyimpan (penyimpanan penuh?). Coba gambar yang lebih kecil.'};
 o.querySelector('#pcash').onclick=function(){if(db.upd('transactions',id,{method:'Tunai'})){db.notify({to:'admin',type:'tx',title:'Bayar tunai di gym',text:t.memberName+' akan membayar '+t.packageName+' '+FF.rp(t.amount)+' tunai di gym.'});FF.toast('Catat: bayar tunai di gym. Admin akan memverifikasi.')}m.close();after()}}
function showQR(o){o=o||{};var s=S();if(!on()){FF.toast('QRIS belum diaktifkan di Pengaturan','err');return}
 modal('<h3>Scan untuk bayar</h3>'+(o.amount?'<div class="payhd"><span>'+E(o.title||'Pembayaran')+'</span><b>'+FF.rp(o.amount)+'</b><small>Masukkan nominal ini di aplikasi pembayaran</small></div>':'')+'<figure class="qrf"><img src="'+E(src())+'" alt="Kode QRIS" width="300"><figcaption>'+E(s.qrisName)+'<br><small>NMID: '+E(s.qrisNmid)+'</small></figcaption></figure><div class="mb pmb"><button type="button" class="btn p" data-pc>Selesai</button></div>')}
function viewProof(id){var t=db.get('transactions',id);if(!t)return;
 modal('<h3>Bukti pembayaran</h3><div class="payhd"><span>'+E(t.memberName)+' · '+E(t.packageName)+'</span><b>'+FF.rp(t.amount)+'</b><small>'+E(t.no)+' · '+E(t.method)+(t.paidAt?' · diunggah '+FF.jam(t.paidAt):'')+'</small></div>'+(t.proof?'<div class="pprev big"><img src="'+E(t.proof)+'" alt="Bukti pembayaran"></div>':'<p class="mut">Belum ada bukti.</p>')+
 '<div class="mb pmb">'+(t.status==='menunggu'?'<button type="button" class="btn p" data-a="ok" data-id="'+t.id+'" data-pc>Setujui</button><button type="button" class="btn" data-a="no" data-id="'+t.id+'" data-pc>Tolak</button>':'')+'<button type="button" class="btn" data-pc>Tutup</button></div>')}
FF.pay={show:show,showQR:showQR,viewProof:viewProof,submit:submit,shrink:shrink,on:on,src:src};
d.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-pay],[data-a=proof],[data-a=showqris],[data-a=qrisreset]');if(!b)return;
 if(b.hasAttribute('data-pay')){show(b.getAttribute('data-pay'));return}
 var a=b.getAttribute('data-a');if(a==='proof')viewProof(b.getAttribute('data-id'));
 if(a==='showqris')showQR({amount:+b.getAttribute('data-amt')||0,title:b.getAttribute('data-title')||''});
 if(a==='qrisreset'){var s=S();s.qrisImg='';db.saveSettings(s);db.log('Pakai QRIS bawaan');FF.toast('QRIS bawaan dipulihkan');after()}});
d.addEventListener('change',function(e){var t=e.target;if(t.id==='qrisfile'&&t.files&&t.files[0]){shrink(t.files[0],1100,.92,function(data){var s=S();s.qrisImg=data;if(db.saveSettings(s)){db.log('Ganti gambar QRIS');FF.toast('Gambar QRIS diganti');after()}else FF.toast('Penyimpanan penuh','err')},function(){FF.toast('File bukan gambar','err')})}});
})(window,document);
