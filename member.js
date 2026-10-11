(function(d){
d.addEventListener('DOMContentLoaded',function(){
var u=FF.auth.guard('member');if(!u)return;var db=FF.db,root=d.getElementById('root');
function draw(){draw0();FF.labelTables(root)}function draw0(){u=db.get('members',u.id)||u;var st=db.status(u),pk=db.get('packages',u.packageId),days=u.end?Math.ceil((new Date(u.end+'T00:00:00')-new Date(db.today()+'T00:00:00'))/864e5):null;
var tx=db.list('transactions').filter(function(t){return t.memberId===u.id}).reverse(),vs=db.list('visits').filter(function(v){return v.memberId===u.id}).reverse();
var pct=0;if(u.start&&u.end&&days!=null){var tot=(new Date(u.end)-new Date(u.start))/864e5;pct=tot>0?Math.max(0,Math.min(100,days/tot*100)):0}var rem=st==='akan berakhir'?'<div class="alert y">Membership berakhir '+FF.tgl(u.end)+' ('+days+' hari lagi). Ajukan perpanjangan di bawah.</div>':st==='kedaluwarsa'?'<div class="alert r">Membership sudah kedaluwarsa. Ajukan paket baru di bawah.</div>':'';var pend=tx.some(function(t){return t.status==='menunggu'});
root.innerHTML='<div class="dh"><img class="logo" src="logo.png" alt="FUN FITNESS"><h1>Halo, '+FF.esc(u.name)+'</h1><div class="sp"><button class="btn s" id="theme">Tema</button><button class="btn s" id="out">Logout</button></div></div>'+
'<div class="sim">SIMULASI — belum terhubung dengan pembayaran online. Masa aktif hanya berubah setelah admin menyetujui pembayaran.</div>'+
'<div class="mc"><div class="mct"><img class="logo" src="logo.png" alt="">'+FF.badge(st)+'</div><div class="mcn">'+FF.esc(u.name)+'</div><div class="mci">'+u.id+'</div><div class="mcg"><div><small>Paket</small><b>'+(pk?FF.esc(pk.name):'—')+'</b></div><div><small>Berlaku s.d.</small><b>'+FF.tgl(u.end)+'</b></div><div><small>Sisa</small><b>'+(days!=null?(days>=0?days+' hari':'Berakhir'):'—')+'</b></div></div><div class="mcp"><i style="width:'+pct+'%"></i></div></div><br>'+
'<div class="card"><h3>Ajukan paket / perpanjangan</h3><div class="grid">'+db.list('packages').filter(function(p){return p.active&&p.type==='member'}).map(function(p){return'<div><b>'+FF.esc(p.name)+'</b><br>'+(p.price==null?'<span class="bd y">Harga belum dikonfirmasi</span>':FF.rp(p.price)+'<br><button class="btn s p" data-req="'+p.id+'"'+(pend?' disabled':'')+'>Ajukan</button>')+'</div>'}).join('')+'</div>'+(pend?'<p class="mut">Ada pengajuan menunggu konfirmasi admin.</p>':'')+'</div>'+
'<div class="card"><h3>Riwayat transaksi</h3><div class="tw"><table><tr><th>No</th><th>Tanggal</th><th>Paket</th><th>Nominal</th><th>Status</th><th>Catatan</th></tr>'+(tx.map(function(t){return'<tr><td>'+FF.esc(t.no)+'</td><td>'+FF.tgl(t.date)+'</td><td>'+FF.esc(t.packageName)+'</td><td>'+FF.rp(t.amount)+'</td><td>'+FF.badge(t.status)+'</td><td>'+FF.esc(t.note)+'</td></tr>'}).join('')||'<tr><td colspan="6">Belum ada transaksi.</td></tr>')+'</table></div></div>'+
'<div class="card"><h3>Riwayat kunjungan</h3>'+(vs.map(function(v){return'<div>'+FF.jam(v.at)+'</div>'}).join('')||'<p class="mut">Belum ada kunjungan tercatat.</p>')+'</div>'+
'<div class="card"><h3>Profil</h3><div class="field"><label for="pn">Nama</label><input id="pn" value="'+FF.esc(u.name)+'"></div><div class="field"><label for="pp">Nomor HP</label><input id="pp" value="'+FF.esc(u.phone)+'"></div><button class="btn p" id="sv">Simpan profil</button></div>';
}
draw();FF.refresh=draw;
d.addEventListener('click',function(e){var t=e.target;
if(t.id==='out')FF.auth.logout();
if(t.id==='theme'){var n=d.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';d.documentElement.setAttribute('data-theme',n);try{localStorage.setItem('ff_theme',n)}catch(x){}}
if(t.id==='sv'){var nm=d.getElementById('pn').value.trim(),ph=d.getElementById('pp').value;if(nm.length<3||!FF.wa(ph))return FF.toast('Nama atau nomor HP tidak valid','err');db.upd('members',u.id,{name:nm,phone:ph});FF.toast('Profil disimpan');draw()}
var r=t.getAttribute&&t.getAttribute('data-req');if(r){t.disabled=true;if(FF.auth.request(u,r))FF.toast('Pengajuan dikirim, menunggu admin');draw()}});
});
})(document);
