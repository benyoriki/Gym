/* Nama GYM - data demo untuk uji coba (member, kunjungan, transaksi, notifikasi).
   Semua data demo diberi tanda demo:true sehingga bisa dihapus sekali klik (Admin > Uji Coba)
   tanpa menyentuh data asli. Akun admin TIDAK ikut terhapus. */
(function(w){
var FF=w.FF,db=FF.db,V=4;
function rng(seed){var a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;var t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function p2(n){return('0'+n).slice(-2)}
function at(day,h,m){return day+'T'+p2(h)+':'+p2(m)+':00'}  /* waktu lokal tanpa zona -> new Date() membacanya sebagai waktu lokal */
function iso(day,h,m){return new Date(at(day,h,m)).toISOString()}

/* [nama, username, paket, mulai periode (hari lalu), bergabung (hari lalu), kunjungan/minggu, tampil publik] */
var P=[
['Rina Pratiwi','rina','rd-3',40,150,4.6,1],['Dimas Saputra','dimas','rd-4',120,175,6.2,1],['Putri Ayu','putri','rp-3',30,110,3.8,1],
['Fajar Nugroho','fajar','rd-2',12,40,3.2,1],['Maya Lestari','maya','rd-3',50,95,4.4,1],['Rizky Ramadhan','rizky','rp-2',9,30,5.0,1],
['Nadia Safitri','nadia','rd-5',140,170,3.6,1],['Bagas Prakoso','bagas','rd-2',44,60,2.0,1],['Citra Dewi','citra','rd-3',70,100,2.6,0],
['Eko Wahyudi','eko','rd-4',80,160,4.0,1],['Dewi Anggraini','dewi','rp-3',20,70,3.0,1],['Hendra Gunawan','hendra','rd-1',10,10,1.8,1],
['Lia Kurnia','lia','rd-2',8,25,3.4,1],['Agus Setiawan','agus','rd-3',150,170,1.2,1],['Wulan Sari','wulan','rp-2',6,20,3.0,1],
['Yoga Pratama','yoga','rd-3',32,52,5.4,1],['Tiara Amelia','tiara','rp-1',5,5,2.0,1],['Rudi Hartono','rudi','rd-5',220,300,3.0,0],
['Anisa Rahma','anisa','rd-3',45,60,0.8,1],['Kevin Alamsyah','kevin',null,1,1,0,1],['Sinta Bella','sinta',null,2,2,0,1]];
var VISITORS=['Andre','Tamu Fitri','Joko','Mira','Bayu','Salsa','Tamu Hari','Doni','Lina','Ilham','Tamu Reza','Putra','Vina','Rafi','Tamu Dika','Gilang','Nando','Tamu Sari','Ayu','Oka','Tamu Rendi','Zaki','Mutia','Fahri','Tamu Lala','Irwan','Siska','Bimo','Tamu Adit','Yuda','Nova','Tomi','Tamu Wawan','Elsa','Rangga','Dinda','Tamu Bobby','Hanif','Ratna','Surya','Tamu Ghea','Anton','Melati','Krisna','Tamu Dewa','Laras','Edo','Fitra','Tamu Gita','Jaya','Kania','Lutfi','Tamu Mario','Nisa','Opik','Pita'];
/* 4x data: tambahan 72 member (total 96 member demo), dibuat dari daftar nama + acak bertanda tetap */
var FN2=['Ahmad','Bima','Cindy','Dani','Eka','Farah','Gilbert','Hani','Indra','Jihan','Kirana','Lukas','Mawar','Nanda','Olivia','Prasetyo','Qonita','Reza','Siti','Taufik','Ulfa','Vicky','Winda','Xavier','Yani','Zahra','Arif','Bella','Candra','Devi','Erwin','Fani','Gunawan','Hesti','Imam','Jessica','Kholid','Laila','Miko','Nurul','Oscar','Pratiwi','Raihan','Sandi','Tika','Umar','Vera','Wahyu','Yusuf','Zulfa','Aldo','Bunga','Chandra','Dhea','Ega','Fikri','Gina','Haikal','Intan','Jordan','Kartika','Lutfia','Mario','Nabila','Okta','Panji','Rahma','Satria','Tari','Ucok','Vivi','Wisnu'],
LN2=['Santoso','Wijaya','Kusuma','Hidayat','Lestari','Ramadhani','Permana','Saputra','Anggraini','Firmansyah','Puspita','Nugraha','Maharani','Setiawan','Rahmawati','Hakim','Suryani','Pratama','Utami','Kurniawan'];
function genP(){var R=rng(777),used={},out=[],i;P.forEach(function(p){used[p[1]]=1});
 var pks=['rd-1','rd-2','rd-2','rd-3','rd-3','rd-3','rd-4','rd-5','rp-1','rp-2','rp-2','rp-3','rp-3','rp-4','rp-5'],DUR={1:14,2:30,3:91,4:182,5:365};
 for(i=0;i<72;i++){var fn=FN2[i],ln=LN2[Math.floor(R()*LN2.length)],un=fn.toLowerCase(),k=2;while(used[un])un=fn.toLowerCase()+(k++);used[un]=1;
  var x=R(),id=pks[Math.floor(R()*pks.length)],D=DUR[id.slice(-1)],ago,j,fr=Math.round((1+R()*5)*10)/10;
  if(x<.07){out.push([fn+' '+ln,un,null,1+Math.floor(R()*3),1+Math.floor(R()*3),0,R()<.85?1:0]);continue}
  if(x<.64)ago=Math.floor(R()*Math.max(1,D-9));else if(x<.8)ago=Math.max(0,D-1-Math.floor(R()*6));else ago=D+2+Math.floor(R()*40);
  j=Math.min(330,ago+Math.floor(R()*110));out.push([fn+' '+ln,un,id,ago,j,fr,R()<.88?1:0])}
 return out}
P=P.concat(genP());
var PEAK=[[6,.9],[7,1.2],[8,.7],[9,.4],[10,.3],[12,.4],[15,.5],[16,.9],[17,1.6],[18,2.2],[19,2.2],[20,1.4],[21,.7],[22,.2]];
function hourPick(r){var t=0,i;PEAK.forEach(function(x){t+=x[1]});var k=r()*t;for(i=0;i<PEAK.length;i++){k-=PEAK[i][1];if(k<=0)return PEAK[i][0]}return 18}
function receipt(name,pkg,amount){function x(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
 var svg='<svg xmlns="http://www.w3.org/2000/svg" width="360" height="560" viewBox="0 0 360 560" font-family="Arial,sans-serif"><rect width="360" height="560" fill="#fff"/><rect width="360" height="84" fill="#00AED6"/><text x="24" y="52" font-size="22" font-weight="700" fill="#fff">Pembayaran berhasil</text>'+
 '<text x="24" y="132" font-size="13" fill="#6b7280">Dibayar ke</text><text x="24" y="156" font-size="15" font-weight="700" fill="#111">RIKI HERMAWAN, DIGITAL &amp; KREATIF</text>'+
 '<text x="24" y="206" font-size="13" fill="#6b7280">Nominal</text><text x="24" y="242" font-size="32" font-weight="700" fill="#111">'+x('Rp '+String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g,'.'))+'</text>'+
 '<text x="24" y="292" font-size="13" fill="#6b7280">Untuk</text><text x="24" y="314" font-size="15" fill="#111">'+x(pkg)+'</text>'+
 '<text x="24" y="360" font-size="13" fill="#6b7280">Dari</text><text x="24" y="382" font-size="15" fill="#111">'+x(name)+'</text>'+
 '<text x="24" y="430" font-size="13" fill="#6b7280">Metode</text><text x="24" y="452" font-size="15" fill="#111">QRIS</text><text x="24" y="526" font-size="11" fill="#9ca3af">CONTOH BUKTI (DATA DEMO)</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function proofEx(t){t.proof=receipt(t.memberName,t.packageName,t.amount);t.paidAt=new Date(Date.now()-36e5).toISOString();t.method='QRIS'}
function pkOf(id){return db.get('packages',id)}

function load(){
var t=db.today(),r=rng(20261012),n0=db.list('members').length;
db.ctx.demo=true;
try{
var ms=db.list('members'),tx=db.list('transactions'),vs=db.list('visits'),lg=db.list('logs'),have={};
ms.forEach(function(m){have[m.username]=1});
/* pastikan 3 member demo awal ada (bila sebelumnya dihapus lalu dimuat ulang) */
[['FF-0001','Budi Demo','budi',-30,60,'disetujui'],['FF-0002','Sari Demo','sari',-85,3,'menunggu'],['FF-0003','Andi Demo','andi',-130,-10,'disetujui']].forEach(function(b){
 if(!ms.some(function(m){return m.id===b[0]})){var s0=db.addDays(t,b[3]);ms.push({id:b[0],name:b[1],username:b[2],email:b[2]+'@contoh.test',phone:'081200000'+b[0].slice(-3),passHash:db.hash('member123'),role:'member',packageId:'p3',start:s0,end:db.addDays(t,b[4]),status:'ok',demo:true,createdAt:s0+'T08:00:00.000Z',updatedAt:s0+'T08:00:00.000Z'});have[b[2]]=1}
 if(!tx.some(function(x){return x.memberId===b[0]})){var d0=b[5]==='menunggu'?t:db.addDays(t,b[3]);tx.push({id:db.uid('t'),no:'TRX-DEMO-'+b[0].slice(-1),memberId:b[0],memberName:b[1],packageId:'p3',packageName:'Membership 3 Bulan',amount:225000,date:d0,method:b[5]==='menunggu'?'Belum dibayar':'QRIS',status:b[5],note:'DATA DEMO',demo:true,createdAt:d0+'T09:00:00.000Z',updatedAt:d0+'T09:00:00.000Z'})}});
/* kunjungan untuk 3 member demo awal */
var base=[['FF-0001','Budi Demo',30,3.4],['FF-0002','Sari Demo',85,3.0],['FF-0003','Andi Demo',130,2.2]];
function genVisits(id,name,from,to,freq){for(var d=from;d>=to;d--){var day=db.addDays(t,-d);if(r()<freq/7){var n=r()<.12?2:1;for(var k=0;k<n;k++)if(day<t||k===0){var h=hourPick(r),m=Math.floor(r()*60);if(day===t&&(h>new Date().getHours()))continue;vs.push({id:db.uid('v'),memberId:id,name:name,at:iso(day,h,m),demo:true})}}}}
base.forEach(function(b,i){if(!vs.some(function(v){return v.memberId===b[0]&&v.id!=='v1'}))genVisits(b[0],b[1],Math.min(b[2],i===2?130:b[2]),i===2?10:0,b[3])});
/* member baru */
var seq=0,nid=function(){var n=4,id;do{id='FF-'+('0000'+n).slice(-4);n++}while(ms.some(function(m){return m.id===id}));return id};
P.forEach(function(p,i){if(have[p[1]])return;
 var pk=p[2]?pkOf(p[2]):null,id=nid(),start=p[2]?db.addDays(t,-p[3]):'',end='';
 if(pk){end=db.addMonths(start,(+pk.months||0)+(+pk.bonus||0));if(pk.days)end=db.addDays(end,+pk.days)}
 var joined=db.addDays(t,-p[4]),m={id:id,name:p[0],username:p[1],email:p[1]+'@contoh.test',phone:'08120000'+('0000'+(100+i)).slice(-4),passHash:db.hash('member123'),role:'member',packageId:p[2],start:start,end:end,status:'ok',showPublic:p[6]===1,demo:true,createdAt:joined+'T09:00:00.000Z',updatedAt:joined+'T09:00:00.000Z'};
 if(p[1]==='agus'||p[1]==='anisa'){} 
 ms.push(m);
 if(p[5]>0){var last=end&&end<t?Math.max(0,Math.round((new Date(t+'T00:00:00')-new Date(end+'T00:00:00'))/864e5)):0;genVisits(id,p[0],Math.min(150,p[4]),last,p[5])}
 /* transaksi pendaftaran + paket */
 if(pk){tx.push({id:db.uid('t'),no:'TRX-DEMO-'+('0'+(++seq+10)).slice(-3),memberId:id,memberName:p[0],packageId:pk.id,packageName:pk.name,amount:pk.price,date:start,method:i%3?'QRIS':'Tunai',status:'disetujui',note:'DATA DEMO',demo:true,createdAt:start+'T10:00:00.000Z',updatedAt:start+'T11:00:00.000Z'});
  if(p[4]<=p[3]+3)tx.push({id:db.uid('t'),no:'REG-DEMO-'+('0'+seq).slice(-3),memberId:id,memberName:p[0],packageId:'reg',packageName:'Biaya registrasi',amount:+db.settings().feeReg||25000,date:start,method:'Tunai',status:'disetujui',note:'Registrasi member baru',demo:true,createdAt:start+'T10:05:00.000Z',updatedAt:start+'T10:05:00.000Z'})}
});
/* member beri tanda: bagas pernah ditolak, agus dibatalkan, pengajuan menunggu */
function T(no,m,pkId,st,day,note,method,ex){var pk=pkOf(pkId),mm=ms.filter(function(x){return x.username===m})[0];if(!pk||!mm)return;tx.push({id:db.uid('t'),no:no,memberId:mm.id,memberName:mm.name,packageId:pk.id,packageName:pk.name,amount:pk.price,date:day,method:method||'Belum dibayar',status:st,note:note,demo:true,createdAt:day+'T14:00:00.000Z',updatedAt:day+'T14:30:00.000Z'});if(ex)ex(tx[tx.length-1])}
T('TRX-DEMO-901','bagas','rd-3','ditolak',db.addDays(t,-6),'Bukti transfer tidak sesuai nominal');
T('TRX-DEMO-902','agus','rd-3','dibatalkan',db.addDays(t,-20),'Dibatalkan oleh member');
T('TRX-DEMO-903','hendra','rd-3','menunggu',t,'','QRIS',proofEx);
T('TRX-DEMO-904','sinta','rp-2','menunggu',t,'');
T('TRX-DEMO-905','kevin','rd-2','menunggu',db.addDays(t,-1),'','QRIS',proofEx);
T('TRX-DEMO-906','lia','rd-3','ditolak',db.addDays(t,-11),'Pembayaran tidak diterima bank');
var G=P.slice(21).filter(function(p){return p[2]}),gu=function(k){return G[k%G.length][1]};
for(var q=0;q<6;q++){T('TRX-DEMO-91'+q,gu(q*7+1),['rd-2','rp-2','rd-3','rp-3','rd-1','rd-4'][q],'menunggu',db.addDays(t,-(q%3)),'','QRIS',proofEx)}
for(var q2=0;q2<4;q2++){T('TRX-DEMO-92'+q2,gu(q2*5+3),['rd-2','rp-1','rd-3','rp-2'][q2],'menunggu',t,'')}
for(var q3=0;q3<6;q3++){T('TRX-DEMO-93'+q3,gu(q3*6+2),['rd-3','rp-2','rd-2','rd-4','rp-3','rd-1'][q3],'ditolak',db.addDays(t,-(3+q3*4)),['Bukti transfer tidak sesuai nominal','Pembayaran tidak diterima bank','Bukti buram, mohon unggah ulang','Nominal kurang'][q3%4])}
for(var q4=0;q4<4;q4++){T('TRX-DEMO-94'+q4,gu(q4*9+4),['rd-3','rp-2','rd-2','rd-1'][q4],'dibatalkan',db.addDays(t,-(8+q4*9)),'Dibatalkan oleh member')}
/* visit harian non-member */
for(var i=0;i<56;i++){var day=db.addDays(t,-Math.floor(r()*45)),nm=VISITORS[i%VISITORS.length],fee=+db.settings().feeVisit||30000;
 tx.push({id:db.uid('t'),no:'VST-DEMO-'+('0'+(i+1)).slice(-2),memberId:'VISIT',memberName:nm,packageId:'visit',packageName:'Visit harian',amount:fee,date:day,method:'Tunai',status:'disetujui',note:'Visit non-member',demo:true,createdAt:day+'T17:00:00.000Z',updatedAt:day+'T17:00:00.000Z'});
 vs.push({id:db.uid('v'),memberId:'VISIT',name:nm,at:iso(day,17+Math.floor(r()*3),Math.floor(r()*60)),kind:'visit',demo:true})}
vs.sort(function(a,b){return a.at<b.at?-1:1});
/* log aktivitas */
[['Pendaftaran member','FF-0004'],['Login demo','rina'],['Check-in','FF-0005'],['Pembayaran disetujui','TRX-DEMO-012'],['Perubahan paket','rd-3'],['Perpanjangan membership','FF-0006 +1 bln'],['Check-in','FF-0012'],['Pembayaran disetujui','TRX-DEMO-018'],['Pendaftaran member','FF-0031'],['Login demo','dimas'],['Check-in','FF-0020'],['Perpanjangan membership','FF-0014 +3 bln'],['Pembayaran ditolak','TRX-DEMO-930'],['Check-in','FF-0044'],['Login demo','putri'],['Pendaftaran member','FF-0052'],['Pembayaran disetujui','TRX-DEMO-031'],['Check-in','FF-0066'],['Perubahan paket','rp-2'],['Check-in','FF-0071'],['Pendaftaran member','FF-0080'],['Pembayaran disetujui','TRX-DEMO-040'],['Login demo','rizky'],['Check-in','FF-0090'],['Perpanjangan membership','FF-0077 +1 bln'],['Check-in','FF-0095'],['Pendaftaran member','FF-0096'],['Login demo','maya'],['Pembayaran disetujui','TRX-DEMO-052'],['Check-in','FF-0033']].forEach(function(x,k){lg.push({id:db.uid('l'),at:new Date(Date.now()-(k+1)*36e5*5).toISOString(),type:x[0],detail:x[1],user:k%2?'ADM-001':'sistem',demo:true})});
db.put('members',ms);db.put('transactions',tx);db.put('visits',vs);db.put('logs',lg.slice(-400));
/* notifikasi awal */
function N(to,type,title,text,min,read){db.notify({to:to,type:type,title:title,text:text,at:new Date(Date.now()-min*6e4).toISOString(),read:!!read})}
N('admin','tx','Pengajuan pembayaran baru','Hendra Gunawan mengajukan Dewasa - 3 Bulan (Rp 200.000).',12);
N('admin','member','Member baru mendaftar','Sinta Bella mendaftar dan memilih Pelajar - 1 Bulan.',55);
N('admin','tx','Pengajuan pembayaran baru','Kevin Alamsyah mengajukan Dewasa - 1 Bulan (Rp 75.000).',60*20);
N('admin','warn','Membership akan berakhir','Sari Demo berakhir 3 hari lagi.',60*8,true);
N('admin','visit','Check-in','Rizky check-in di gym.',60*26,true);
G.slice(0,12).forEach(function(p,k){N('admin',k%3===0?'member':k%3===1?'visit':'tx',k%3===0?'Member baru mendaftar':k%3===1?'Check-in':'Pembayaran disetujui',k%3===0?p[0]+' mendaftar dan memilih '+(p[1].length%2?'Dewasa - 1 Bulan':'Pelajar - 3 Bulan')+'.':k%3===1?String(p[0]).split(' ')[0]+' check-in di gym.':p[0]+': pembayaran disetujui, masa aktif bertambah.',60*(30+k*9),true)});
N('FF-0001','visit','Check-in tercatat','Selamat latihan, Budi! Kunjungan kamu bertambah.',60*5,true);
N('FF-0002','warn','Membership akan berakhir','Masa aktif kamu berakhir 3 hari lagi. Ajukan perpanjangan di dashboard.',60*8);
N('FF-0002','tx','Pengajuan diterima','Pengajuan Membership 3 Bulan sedang menunggu konfirmasi admin.',60*3);
}finally{db.ctx.demo=false}
if(FF.chat&&FF.chat.seed)FF.chat.seed();db.kset('demoVer',V);db.log('Muat data demo','v'+V+' ('+(db.list('members').length-n0)+' member)');
}

/* pastikan beberapa member demo tampil "sedang di gym" saat jam buka */
function warm(min){var now=new Date(),h=now.getHours()+now.getMinutes()/60;if(h<6.2||h>=23)return 0;
 var need=(min||6)-db.onsite(3).length;if(need<=0)return 0;
 var vs=db.list('visits'),recent={},cut=Date.now()-3*36e5,open=new Date(db.today()+'T06:00:00').getTime(),from=Math.max(cut,open),span=Date.now()-from-6e4;if(span<=0)return 0;
 vs.forEach(function(v){if(new Date(v.at).getTime()>=cut)recent[v.memberId]=1});
 var pool=db.list('members').filter(function(m){var s=db.status(m);return m.demo&&m.role==='member'&&m.showPublic!==false&&(s==='aktif'||s==='akan berakhir')&&!recent[m.id]});
 var r=rng(Date.now()>>>12),k=0;db.ctx.demo=true;
 try{while(need>0&&pool.length){var m=pool.splice(Math.floor(r()*pool.length),1)[0];vs.push({id:db.uid('v'),memberId:m.id,name:m.name,at:new Date(from+Math.floor(r()*span)).toISOString(),demo:true});need--;k++}
 if(k){vs.sort(function(a,b){return a.at<b.at?-1:1});db.put('visits',vs)}}finally{db.ctx.demo=false}
 return k}

function stats(){var c={members:0,tx:0,visits:0,notifs:0,logs:0};db.list('members').forEach(function(m){if(m.demo&&m.role!=='admin')c.members++});['transactions:tx','visits:visits','notifs:notifs','logs:logs'].forEach(function(x){var p=x.split(':');c[p[1]]=db.list(p[0]).filter(function(o){return o.demo}).length});
 var real={members:db.list('members').filter(function(m){return!m.demo&&m.role==='member'}).length,tx:db.list('transactions').filter(function(o){return!o.demo}).length,visits:db.list('visits').filter(function(o){return!o.demo}).length};c.real=real;return c}

/* hapus SEMUA data demo (kecuali akun admin & paket). Data asli tetap. */
function purge(quiet){var ids={};db.list('members').forEach(function(m){if(m.demo&&m.role!=='admin')ids[m.id]=1});
 db.put('members',db.list('members').filter(function(m){return!ids[m.id]}));
 db.put('transactions',db.list('transactions').filter(function(o){return!o.demo&&!ids[o.memberId]}));
 db.put('visits',db.list('visits').filter(function(o){return!o.demo&&!ids[o.memberId]}));
 db.put('notifs',db.list('notifs').filter(function(o){return!o.demo&&!ids[o.to]}));
 db.put('logs',db.list('logs').filter(function(o){return!o.demo}));
 db.put('chat',db.list('chat').filter(function(o){return!o.demo&&!ids[o.memberId]}));db.kset('chatVer',0);
 if(!quiet){db.kset('demoMode','off');db.log('Hapus data demo','mode data asli aktif')}return Object.keys(ids).length}
function ensure(){if(db.kget('demoMode','on')==='off')return;var v=db.kget('demoVer',0);if(v<V){if(v>0)purge(true);load()}warm(12)}

FF.demo={receipt:receipt,load:load,warm:warm,stats:stats,purge:purge,ensure:ensure,
 on:function(){return db.kget('demoMode','on')!=='off'},
 reload:function(){purge(true);db.kset('demoMode','on');db.kset('demoVer',0);load();warm(12)}};
ensure();
})(window);
