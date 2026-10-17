/* Nama GYM - lapisan data tunggal (LocalStorageAdapter). Semua halaman memanggil FF.db.*; ganti adapter ini saat migrasi ke Firebase. */
(function(w){
var NS='ff_',mem={},ok=false;
try{localStorage.setItem('__t','1');localStorage.removeItem('__t');ok=true}catch(e){}
function rd(k,d){try{var r=ok?localStorage.getItem(NS+k):mem[k];return r?JSON.parse(r):d}catch(e){return d}}
function wr(k,v){try{var s=JSON.stringify(v);if(ok)localStorage.setItem(NS+k,s);else mem[k]=s;return true}catch(e){if(w.FF&&FF.toast)FF.toast('Data gagal disimpan (penyimpanan penuh/tidak tersedia)','err');return false}}
function p2(n){return('0'+n).slice(-2)}
function ymd(d){return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())}
function today(){return ymd(new Date())}
function addDays(s,n){var d=new Date(s+'T00:00:00');d.setDate(d.getDate()+n);return ymd(d)}
function addMonths(s,n){var d=new Date(s+'T00:00:00');d.setMonth(d.getMonth()+n);return ymd(d)}
function uid(p){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function hash(s){var h=5381,i;for(i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return'd'+(h>>>0).toString(16)} /* DEMO saja, bukan keamanan nyata */
var db={ymd:ymd,today:today,addDays:addDays,addMonths:addMonths,hash:hash,uid:uid,
list:function(c){var r=rd(c,[]);return Array.isArray(r)?r:[]},
get:function(c,id){return db.list(c).filter(function(x){return x.id===id})[0]||null},
add:function(c,o){var l=db.list(c);o.id=o.id||uid(c[0]);if(db.ctx.demo)o.demo=true;o.createdAt=o.updatedAt=new Date().toISOString();l.push(o);return wr(c,l)?o:null},
upd:function(c,id,p){var l=db.list(c),o=null;l.forEach(function(x){if(x.id===id){for(var k in p)x[k]=p[k];x.updatedAt=new Date().toISOString();o=x}});return o&&wr(c,l)?o:null},
del:function(c,id){return wr(c,db.list(c).filter(function(x){return x.id!==id}))},
settings:function(){var o=rd('settings',{}),r={},k;if(!o||typeof o!=='object')o={};for(k in DS)r[k]=(o[k]==null||o[k]==='')?DS[k]:o[k];return r},
saveSettings:function(s){return wr('settings',s)},
session:function(){return rd('session',null)},
setSession:function(s){return s?wr('session',s):(ok?localStorage.removeItem(NS+'session'):delete mem.session,true)},
log:function(type,detail){var s=db.session();var l=db.list('logs');var e={id:uid('l'),at:new Date().toISOString(),type:type,detail:detail||'',user:s?s.id:'-'};if(db.ctx.demo)e.demo=true;l.push(e);wr('logs',l.slice(-400))},
nextMemberId:function(){var n=db.list('members').length+1,id;do{id='FF-'+('0000'+n).slice(-4);n++}while(db.get('members',id));return id},
catOf:function(p,t){if(t&&t.packageId==='visit')return'Visit Harian';if(t&&t.packageId==='reg')return'Registrasi';if(!p)return'Lainnya';if(p.type==='reguler')return'Reguler '+(p.group==='pelajar'?'Pelajar':'Dewasa');if(p.type==='pt')return'Personal Training';return'Promo Membership'},
level:function(n){var L=[[0,'Pemula'],[5,'Rutin'],[15,'Konsisten'],[30,'Atlet'],[60,'Elite']],i=0;while(i<L.length-1&&n>=L[i+1][0])i++;return{lv:i+1,name:L[i][1],from:L[i][0],next:L[i+1]?L[i+1][0]:null}},
counts:function(){var c={};db.list('visits').forEach(function(v){c[v.memberId]=(c[v.memberId]||0)+1});return c},
rank:function(id){var c=db.counts(),me=c[id]||0,r=1,k;for(k in c)if(c[k]>me)r++;return r},
onsite:function(h){var t=Date.now()-(h||3)*36e5,seen={},out=[];db.list('visits').slice().reverse().forEach(function(v){if(new Date(v.at).getTime()>=t&&!seen[v.memberId]){seen[v.memberId]=1;var m=db.get('members',v.memberId);if(m&&m.status!=='nonaktif'&&m.showPublic!==false)out.push(m)}});return out},
status:function(m){if(m.status==='nonaktif')return'nonaktif';if(!m.end)return'menunggu';var t=today();if(m.end<t)return'kedaluwarsa';if(m.end<=addDays(t,7))return'akan berakhir';return'aktif'},
setTx:function(id,st,note){var t=db.get('transactions',id);if(!t||t.status!=='menunggu')return false; /* cegah proses ganda */
 if(st==='disetujui'){var m=db.get('members',t.memberId),pk=db.get('packages',t.packageId);if(!m||!pk)return false;
  var base=(m.end&&m.end>today())?m.end:today();db.upd('members',m.id,{start:m.start&&m.end>today()?m.start:today(),end:(function(){var e=addMonths(base,(+pk.months||0)+(+pk.bonus||0));return pk.days?addDays(e,+pk.days):e})(),packageId:pk.id});}
 db.upd('transactions',id,{status:st,note:note||t.note||''});db.log('Pembayaran '+st,t.no);
 db.notify({to:t.memberId,type:'tx',title:st==='disetujui'?'Pembayaran disetujui':'Pembayaran ditolak',text:t.packageName+(st==='disetujui'?' — masa aktif membership sudah diperbarui.':' — '+(note||'hubungi admin untuk info lebih lanjut.'))});return true},
put:function(c,l){return wr(c,l)},kget:function(k,d){return rd(k,d)},kset:function(k,v){return wr(k,v)},
notify:function(o){var l=db.list('notifs'),n={id:uid('n'),at:new Date().toISOString(),type:o.type||'info',title:o.title||'',text:o.text||'',to:o.to||'admin',read:!!o.read,key:o.key||''};
 if(db.ctx.demo||o.demo)n.demo=true;if(o.at)n.at=o.at;if(n.key&&l.some(function(x){return x.key===n.key}))return null;
 l.push(n);wr('notifs',l.slice(-250));if(w.FF&&FF.notified)try{FF.notified(n)}catch(e){}return n},
notifs:function(to){return db.list('notifs').filter(function(n){return n.to===to}).sort(function(a,b){return a.at<b.at?1:-1})},
unread:function(to){return db.notifs(to).filter(function(n){return!n.read}).length},
readAll:function(to){var l=db.list('notifs');l.forEach(function(n){if(n.to===to)n.read=true});wr('notifs',l)},
ranking:function(since,pub){var c={},ms={},out=[],k;db.list('members').forEach(function(m){ms[m.id]=m});
 db.list('visits').forEach(function(v){if(v.memberId==='VISIT'||(since&&v.at.slice(0,10)<since))return;c[v.memberId]=(c[v.memberId]||0)+1});
 for(k in c){var m=ms[k];if(m&&m.role==='member'&&m.status!=='nonaktif'&&(!pub||m.showPublic!==false))out.push({m:m,n:c[k]})}
 out.sort(function(a,b){return b.n-a.n||String(a.m.name).localeCompare(String(b.m.name))});return out},
checkExpiry:function(){var t=today();db.list('members').forEach(function(m){if(m.role!=='member'||db.status(m)!=='akan berakhir')return;var d=Math.ceil((new Date(m.end+'T00:00:00')-new Date(t+'T00:00:00'))/864e5);
 db.notify({to:'admin',type:'warn',title:'Membership akan berakhir',text:m.name+' berakhir '+d+' hari lagi ('+m.end+').',key:'exp-a:'+m.id+':'+m.end});
 db.notify({to:m.id,type:'warn',title:'Membership akan berakhir',text:'Masa aktif kamu berakhir '+d+' hari lagi. Ajukan perpanjangan di dashboard.',key:'exp-m:'+m.id+':'+m.end})})},
reset:function(){if(ok){Object.keys(localStorage).forEach(function(k){if(k.indexOf(NS)===0)localStorage.removeItem(k)})}else mem={};seed()}};
db.ctx={demo:false};
var DS={qrisOn:'1',qrisName:'RIKI HERMAWAN, DIGITAL & KREATIF',qrisNmid:'ID1026615097429',qrisImg:'',waPrimary:'phone1',phone3:'+628988995637',fbName:'@benyoriki',feeVisit:15000,feeReg:12500,shareText:'Halo! Kenalan dengan Nama GYM, tempat fitness di Parung, Bogor. Buka setiap hari 06.00-23.00, tersedia paket membership untuk dewasa dan pelajar, serta personal training. Lihat harga dan daftar di sini:',name:'Nama GYM',address:'Jl. Raya Parung, Bogor, Jawa Barat',hours:'Setiap hari, 06.00–23.00',phone1:'+628988995637',phone2:'+628988995637',ig:'https://www.instagram.com/benyoriki/',maps:'https://www.google.com/maps/search/?api=1&query=Parung+Bogor',mgm:'Ajak 3 orang, dapat bonus membership 1 bulan.',mgmStatus:'Perlu konfirmasi ketentuan'};
function regPk(){var o=[],g=[['dewasa','Dewasa',[50000,75000,200000,350000,600000]],['pelajar','Pelajar',[37500,62500,175000,300000,500000]]],L=[['2 Minggu',0,14],['1 Bulan',1,0],['3 Bulan',3,0],['6 Bulan',6,0],['12 Bulan',12,0]];
g.forEach(function(x){L.forEach(function(l,i){o.push({id:'r'+x[0].charAt(0)+'-'+(i+1),name:x[1]+' - '+l[0],type:'reguler',group:x[0],price:x[2][i],months:l[1],days:l[2],bonus:0,active:true,popular:false,promoEnd:'',note:'Harga reguler sesuai poster harga member; perlu dikonfirmasi.'})})});return o}
function mig2(){var l=db.list('packages'),have={},n=new Date().toISOString();l.forEach(function(p){have[p.id]=1});regPk().forEach(function(p){if(!have[p.id]){p.createdAt=p.updatedAt=n;l.push(p)}});wr('packages',l);wr('schema',2);db.log('Migrasi skema v2','Tambah harga reguler dewasa dan pelajar')}
var OLDP={'rd-1':[100000,50000],'rd-2':[150000,75000],'rd-3':[400000,200000],'rd-4':[700000,350000],'rd-5':[1200000,600000],'rp-1':[75000,37500],'rp-2':[125000,62500],'rp-3':[350000,175000],'rp-4':[600000,300000],'rp-5':[1000000,500000],'p3':[450000,225000],'pt2':[500000,250000],'pt5':[900000,450000]};
var NEWS={name:'Nama GYM',address:'Jl. Raya Parung, Bogor, Jawa Barat',phone1:'+628988995637',phone2:'+628988995637',phone3:'+628988995637',ig:'https://www.instagram.com/benyoriki/',fbName:'@benyoriki',maps:'https://www.google.com/maps/search/?api=1&query=Parung+Bogor'};
/* v3: rebrand Nama GYM, kontak, lokasi, dan harga setengahnya. Hanya menimpa nilai bawaan lama; ubahan admin tetap aman. */
function mig3(){var l=db.list('packages'),st=rd('settings',null),n=0;
 l.forEach(function(p){var o=OLDP[p.id];if(o&&+p.price===o[0]){p.price=o[1];n++}if(p.note)p.note=p.note.replace('Harga reguler sesuai poster harga member; perlu dikonfirmasi.','Harga reguler Nama GYM.')});wr('packages',l);
 if(st&&typeof st==='object'){var k;for(k in NEWS){var v=st[k]==null?'':String(st[k]);if(v===''||/fun fitness|kalisuren|tajur|funfitness|fit center|08831|0881-?2254|0812-?8390|maps\.app\.goo\.gl/i.test(v))st[k]=NEWS[k]}
  if(+st.feeVisit===30000)st.feeVisit=15000;if(+st.feeReg===25000)st.feeReg=12500;
  if(/fun fitness|kalisuren|tajur/i.test(String(st.shareText||'')))st.shareText=DS.shareText;wr('settings',st)}
 wr('schema',3);db.log('Migrasi skema v3','Nama GYM, kontak, harga 50% ('+n+' paket)')}
function seed(){
var sv=rd('schema',0);if(sv>=3)return;if(sv===2){mig3();return}if(sv===1){mig2();mig3();return}var t=today();
wr('packages',[
{id:'p3',name:'Membership 3 Bulan',type:'member',price:225000,months:3,bonus:1,active:true,popular:true,promoEnd:'2026-10-31',note:'Promo Oktober: bonus 1 bulan. Ketentuan perlu dikonfirmasi.',demo:true},
{id:'p6',name:'Membership 6 Bulan',type:'member',price:null,months:6,bonus:2,active:true,popular:false,promoEnd:'2026-10-31',note:'Bonus 2 bulan sesuai poster. Harga dan ketentuan perlu dikonfirmasi.',demo:true},
{id:'pt2',name:'Personal Training 2 Sesi',type:'pt',price:250000,months:0,bonus:1,active:true,popular:false,promoEnd:'',note:'Bonus membership 1 bulan sesuai poster; ketentuan resmi perlu dikonfirmasi.',demo:true},
{id:'pt5',name:'Personal Training 5 Sesi',type:'pt',price:450000,months:0,bonus:1,active:true,popular:false,promoEnd:'',note:'Bonus membership 1 bulan sesuai poster; ketentuan resmi perlu dikonfirmasi.',demo:true}]);
wr('settings',DS);
function M(id,n,u,pk,s,e){return{id:id,name:n,username:u,email:u+'@contoh.test',phone:'081200000'+id.slice(-3),passHash:hash('member123'),role:'member',packageId:pk,start:s,end:e,status:'ok',demo:true,createdAt:s+'T08:00:00.000Z',updatedAt:s+'T08:00:00.000Z'}}
wr('members',[{id:'ADM-001',name:'Admin Demo',username:'admin',email:'admin@contoh.test',phone:'',passHash:hash('admin123'),role:'admin',status:'ok',demo:true,createdAt:t+'T00:00:00.000Z',updatedAt:t+'T00:00:00.000Z'},
M('FF-0001','Budi Demo','budi','p3',addDays(t,-30),addDays(t,60)),M('FF-0002','Sari Demo','sari','p3',addDays(t,-85),addDays(t,3)),M('FF-0003','Andi Demo','andi','p3',addDays(t,-130),addDays(t,-10))]);
function T(n,m,nm,st,d,a){return{id:'t'+n,no:'TRX-DEMO-'+n,memberId:m,memberName:nm,packageId:'p3',packageName:'Membership 3 Bulan',amount:a,date:d,method:'Transfer (simulasi)',status:st,note:'DATA DEMO',demo:true,createdAt:d+'T09:00:00.000Z',updatedAt:d+'T09:00:00.000Z'}}
wr('transactions',[T(1,'FF-0001','Budi Demo','disetujui',addDays(t,-30),225000),T(2,'FF-0003','Andi Demo','disetujui',addDays(t,-130),225000),T(3,'FF-0002','Sari Demo','menunggu',t,225000)]);
wr('visits',[{id:'v1',memberId:'FF-0001',name:'Budi Demo',at:new Date().toISOString(),demo:true}]);
wr('logs',[{id:'l0',at:new Date().toISOString(),type:'Seed data demo',detail:'DATA DEMO dibuat',user:'sistem'}]);
wr('schema',1);mig2();mig3()}
seed();w.FF=w.FF||{};w.FF.db=db;
w.addEventListener('storage',function(){if(w.FF&&FF.refresh)FF.refresh()});
})(window);
