/* Autentikasi DEMO (localStorage) - bukan keamanan produksi. Ganti dengan Firebase Authentication. */
(function(w,d){
var FF=w.FF,db=FF.db;
FF.auth={
user:function(){var s=db.session();return s?db.get('members',s.id):null},
guard:function(role){var u=FF.auth.user();if(!u||u.role!==role||u.status==='nonaktif'){location.href='login.html';return null}return u},
logout:function(){db.log('Logout');db.setSession(null);location.href='login.html'},
login:function(id,pw){id=id.trim().toLowerCase();var u=db.list('members').filter(function(m){return m.username.toLowerCase()===id||m.email.toLowerCase()===id})[0];
 if(!u||u.passHash!==db.hash(pw))return'Username/email atau password salah.';if(u.status==='nonaktif')return'Akun dinonaktifkan. Hubungi admin.';
 db.setSession({id:u.id,role:u.role});db.log('Login demo',u.username);location.href=u.role==='admin'?'admin.html':'member.html';return''},
quick:function(role){var u=db.list('members').filter(function(m){return m.role===role&&m.status!=='nonaktif'&&(role==='admin'||m.username==='budi')})[0]||db.list('members').filter(function(m){return m.role===role&&m.status!=='nonaktif'})[0];
 if(!u){FF.toast('Akun demo '+role+' tidak ditemukan.','err');return}
 db.setSession({id:u.id,role:u.role});db.log('Masuk cepat demo',u.username);location.href=role==='admin'?'admin.html':'member.html'},
register:function(f){var e={},ms=db.list('members');
 if(f.name.trim().length<3)e.name='Nama minimal 3 karakter.';
 if(!/^[a-z0-9_]{4,20}$/i.test(f.username))e.username='Username 4–20 karakter (huruf, angka, _).';else if(ms.some(function(m){return m.username.toLowerCase()===f.username.toLowerCase()}))e.username='Username sudah dipakai.';
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email))e.email='Format email tidak valid.';else if(ms.some(function(m){return m.email.toLowerCase()===f.email.toLowerCase()}))e.email='Email sudah terdaftar.';
 if(!FF.wa(f.phone))e.phone='Nomor HP tidak valid (contoh 08123456789).';
 if(f.password.length<6)e.password='Password minimal 6 karakter.';
 if(f.password!==f.password2)e.password2='Konfirmasi password tidak sama.';
 if(!f.agree)e.agree='Setujui syarat dan privasi.';
 if(Object.keys(e).length)return e;
 var m=db.add('members',{id:db.nextMemberId(),name:f.name.trim(),username:f.username,email:f.email,phone:f.phone,passHash:db.hash(f.password),role:'member',packageId:null,start:'',end:'',status:'ok'});
 if(!m)return{form:'Gagal menyimpan.'};db.log('Pendaftaran member',m.id);
 db.notify({to:'admin',type:'member',title:'Member baru mendaftar',text:m.name+' ('+m.id+') baru saja mendaftar'+(f.pkg&&db.get('packages',f.pkg)?' dan memilih '+db.get('packages',f.pkg).name:'')+'.'});
 if(f.pkg){FF.auth.request(m,f.pkg)}return{ok:m}},
rec:{locked:function(){var r=db.kget('rec',null);return r&&r.until&&r.until>Date.now()?Math.ceil((r.until-Date.now())/6e4):0},
 fail:function(){var r=db.kget('rec',null)||{n:0};r.n=(r.n||0)+1;if(r.n>=5){r.until=Date.now()+3e5;r.n=0}db.kset('rec',r)},ok:function(){db.kset('rec',{n:0})}},
norm:function(x){return String(x||'').toLowerCase().replace(/\s+/g,' ').trim()},
mask:function(e){var p=String(e).split('@'),a=p[0];return a.charAt(0)+'***'+(a.length>1?a.slice(-1):'')+'@'+(p[1]||'')},
tempPassword:function(){var c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',a=new Uint32Array(8),o='',i;if(w.crypto&&crypto.getRandomValues)crypto.getRandomValues(a);else for(i=0;i<8;i++)a[i]=Math.random()*4294967296;for(i=0;i<8;i++)o+=c.charAt(a[i]%c.length);return o},
verify:function(idv,phone){var l=FF.auth.rec.locked();if(l)return{err:'Terlalu banyak percobaan. Coba lagi dalam '+l+' menit atau hubungi admin.'};
 idv=FF.auth.norm(idv);var pw=FF.wa(phone),m=db.list('members').filter(function(x){return x.role==='member'&&(x.username.toLowerCase()===idv||x.email.toLowerCase()===idv)})[0];
 if(!m||!pw||FF.wa(m.phone)!==pw){FF.auth.rec.fail();return{err:'Data tidak cocok. Periksa username/email dan nomor HP yang terdaftar.'}}
 if(m.status==='nonaktif')return{err:'Akun dinonaktifkan. Hubungi admin.'};FF.auth.rec.ok();return{m:m}},
findAccount:function(name,phone){var l=FF.auth.rec.locked();if(l)return{err:'Terlalu banyak percobaan. Coba lagi dalam '+l+' menit atau hubungi admin.'};
 var nm=FF.auth.norm(name),pw=FF.wa(phone),m=db.list('members').filter(function(x){return x.role==='member'&&FF.auth.norm(x.name)===nm&&FF.wa(x.phone)===pw})[0];
 if(!nm||!pw||!m){FF.auth.rec.fail();return{err:'Akun tidak ditemukan. Pastikan nama lengkap dan nomor HP sama seperti saat daftar.'}}FF.auth.rec.ok();return{m:m}},
reset:function(id,pw,pw2){if(String(pw).length<6)return'Password minimal 6 karakter.';if(pw!==pw2)return'Konfirmasi password tidak sama.';var m=db.get('members',id);if(!m||m.role!=='member')return'Akun tidak ditemukan.';
 db.upd('members',id,{passHash:db.hash(pw)});db.log('Reset password (lupa password)',m.username);
 db.notify({to:'admin',type:'warn',title:'Password member direset',text:m.name+' ('+m.id+') mengatur ulang password lewat Lupa password.'});
 db.notify({to:id,type:'warn',title:'Password diubah',text:'Password akun kamu baru saja diubah. Jika bukan kamu, segera hubungi admin.'});return''},
change:function(id,cur,pw,pw2){var m=db.get('members',id);if(!m)return'Akun tidak ditemukan.';if(m.passHash!==db.hash(cur))return'Password saat ini salah.';if(String(pw).length<6)return'Password baru minimal 6 karakter.';if(pw!==pw2)return'Konfirmasi password tidak sama.';
 db.upd('members',id,{passHash:db.hash(pw)});db.log('Ganti password',m.username);db.notify({to:id,type:'info',title:'Password diubah',text:'Password akun kamu berhasil diganti.'});return''},
request:function(m,pkId){var p=db.get('packages',pkId);if(!p||p.price==null||!p.active)return null;
 var t=db.add('transactions',{no:'TRX-'+Date.now().toString(36).toUpperCase(),memberId:m.id,memberName:m.name,packageId:p.id,packageName:p.name,amount:p.price,date:db.today(),method:'Belum dibayar',status:'menunggu',note:''});db.log('Pengajuan paket',p.name);
 if(t){db.notify({to:'admin',type:'tx',title:'Pengajuan pembayaran baru',text:m.name+' mengajukan '+p.name+' ('+FF.rp(p.price)+'). Menunggu persetujuan.'});db.notify({to:m.id,type:'tx',title:'Pengajuan diterima',text:'Pengajuan '+p.name+' sedang menunggu konfirmasi admin.'})}return t}
};
d.addEventListener('DOMContentLoaded',function(){
d.querySelectorAll('input[type=password]').forEach(function(i){var b=d.createElement('button');b.type='button';b.className='pwt';b.textContent='Lihat';b.onclick=function(){var h=i.type==='password';i.type=h?'text':'password';b.textContent=h?'Sembunyi':'Lihat'};var w=d.createElement('div');w.className='pwb';i.parentNode.insertBefore(w,i);w.appendChild(i);w.appendChild(b)});
var lf=d.getElementById('loginForm'),rf=d.getElementById('regForm');
d.querySelectorAll('[data-quick]').forEach(function(b){b.addEventListener('click',function(){FF.auth.quick(b.getAttribute('data-quick'))})});
function errs(f,e){f.querySelectorAll('.err').forEach(function(x){x.textContent=''});for(var k in e){var x=f.querySelector('[data-e="'+k+'"]');if(x)x.textContent=e[k];else FF.toast(e[k],'err')}}
if(lf)lf.addEventListener('submit',function(ev){ev.preventDefault();var b=lf.querySelector('button');if(b.disabled)return;b.disabled=true;b.textContent='Memproses…';
 var r=FF.auth.login(lf.id.value,lf.pw.value);if(r){errs(lf,{form:r});b.disabled=false;b.textContent='Masuk'}});
if(rf){var sel=rf.pkg;db.list('packages').filter(function(p){return p.active&&p.type!=='pt'}).forEach(function(p){var o=d.createElement('option');o.value=p.id;o.textContent=p.name+(p.price==null?' (harga belum dikonfirmasi)':' — '+FF.rp(p.price));if(p.price==null)o.disabled=true;sel.appendChild(o)});
 var q=/pkg=(\w+)/.exec(location.search);if(q)sel.value=q[1];
 rf.addEventListener('submit',function(ev){ev.preventDefault();var b=rf.querySelector('button');if(b.disabled)return;
  var r=FF.auth.register({name:rf.name.value,username:rf.username.value,email:rf.email.value,phone:rf.phone.value,password:rf.password.value,password2:rf.password2.value,pkg:rf.pkg.value,agree:rf.agree.checked});
  errs(rf,r);if(r.ok){b.disabled=true;FF.toast('Pendaftaran berhasil. Silakan login.');setTimeout(function(){location.href='login.html'},1200)}})}
var vf=d.getElementById('vf'),nf=d.getElementById('nf'),uf=d.getElementById('uf');
if(vf&&nf){var vm=null,vt=0;
 var tab=function(t){[].forEach.call(d.querySelectorAll('[data-t]'),function(b){b.className=b.getAttribute('data-t')===t?'on':''});d.getElementById('tp').hidden=t!=='p';d.getElementById('tu').hidden=t!=='u'};
 [].forEach.call(d.querySelectorAll('[data-t]'),function(b){b.addEventListener('click',function(){tab(b.getAttribute('data-t'))})});tab(/[?&]t=u/.test(location.search)?'u':'p');
 vf.addEventListener('submit',function(ev){ev.preventDefault();var r=FF.auth.verify(vf.vid.value,vf.vph.value);if(r.err){errs(vf,{form:r.err});return}vm=r.m;vt=Date.now();errs(vf,{});vf.hidden=true;nf.hidden=false;d.getElementById('nfm').textContent='Terverifikasi: '+FF.first(r.m.name)+'. Buat password baru.';nf.np1.focus()});
 nf.addEventListener('submit',function(ev){ev.preventDefault();if(!vm||Date.now()-vt>6e5){errs(nf,{form2:'Sesi verifikasi habis. Ulangi verifikasi.'});vf.hidden=false;nf.hidden=true;return}
  var e=FF.auth.reset(vm.id,nf.np1.value,nf.np2.value);if(e){errs(nf,{form2:e});return}FF.toast('Password berhasil diubah. Silakan login.');var un=vm.username;vm=null;nf.querySelector('button.p').disabled=true;setTimeout(function(){location.href='login.html?u='+encodeURIComponent(un)},1200)})}
if(uf)uf.addEventListener('submit',function(ev){ev.preventDefault();var r=FF.auth.findAccount(uf.uname.value,uf.uph.value),box=d.getElementById('ur');
 if(r.err){errs(uf,{form:r.err});box.hidden=true;return}errs(uf,{});box.hidden=false;box.innerHTML='<b>Akun ditemukan</b><p>Username: <b>'+FF.esc(r.m.username)+'</b><br>Email: <b>'+FF.esc(FF.auth.mask(r.m.email))+'</b></p><a class="btn p" href="login.html?u='+encodeURIComponent(r.m.username)+'">Login sekarang</a> <a class="btn" href="lupa.html">Lupa password juga?</a>'});
var hw=d.getElementById('helpwa');if(hw){var st=db.settings(),wu=FF.wa(st[st.waPrimary||'phone1']||st.phone1);if(wu)hw.href=wu+'?text='+encodeURIComponent('Halo admin Nama GYM, saya lupa akses akun member dan tidak bisa verifikasi sendiri. Mohon bantuan reset.');else hw.style.display='none'}
var qu=/[?&]u=([^&]+)/.exec(location.search);if(lf&&qu){lf.id.value=decodeURIComponent(qu[1]);lf.pw.focus()}
});
})(window,document);
