/* Nama GYM - Grup chat komunitas (gaya WhatsApp).
   Aturan: HANYA member (dan admin) yang bisa mengirim pesan. Pengunjung website hanya bisa membaca.
   Data di localStorage browser (koleksi 'chat'); seperti bagian lain prototipe ini, belum sinkron antar perangkat.
   Pesan bertanda demo:true (isi awal + simulasi member lain) dihapus bersama data demo. */
(function(w,d){
if(!w.FF||!FF.db)return;
var db=FF.db,E=FF.esc,CV=1,cnt=0,onC={t:0,n:0},MAX=400,LIM=500,box,fab,list,inp,rep=null,sel=null,lastSend=0,nNew=0,open=false,simT=null,seenAt=0;
var COLORS=['#E5533D','#D9822B','#2E9E6B','#2D8CCB','#8A63D2','#C24E96','#1F9AA8','#B58A1B'];
var EMO=['👍','🔥','💪','😂','🙏','❤️','👏','😎','🤝','😅','🥵','🏋️','🎉','😴','👌','🫡'];
var RX=['👍','🔥','💪','😂','🙏'];

/* ---------- data percakapan (seed + simulasi) ---------- */
var D={
hi:['Pagi semua! Udah pada latihan belum?','Selamat pagi, semangat ya hari ini 💪','Pagi guys, hari ini mau cardio dulu 🏃','Siang bro, hari ini leg day nih 🦵','Sore semua, rame nggak di gym?','Malam guys, ada yang mau spotting bench jam 8?','Baru kelar latihan, badan remuk tapi puas 😅','Halo semua, baru gabung nih. Salam kenal!'],
gen:['Hari ini chest day, besok pasti pada sakit semua 😂','PR deadlift naik 10kg hari ini!! 🔥','Ada yang tau treadmill sebelah kiri udah bener belum?','Jam ramai biasanya jam berapa ya? Biar nggak antri alat','Kalau mau perpanjang paket 3 bulan bayarnya via QRIS aja kan?','Ada yang pernah ikut PT? Worth it nggak?','Tips biar nggak gampang capek pas cardio dong','Sempet ketemu coach tadi, programnya enak banget sih','Habis latihan makan apa biasanya? Lagi cari ide menu','Streak latihan saya udah 3 minggu nonstop, bangga banget 😎','Siapa yang parkir motor di depan pintu? Tolong geser dikit ya 🙏','Playlist gym hari ini mantap, siapa yang pilih? 🔥','AC-nya enak banget hari ini, adem','Besok jadwal latihan bareng nggak? Rencana jam 6 sore','Barbell 20kg ada yang lagi pakai? Nanti gantian ya','Baru nyoba incline press, ternyata beda banget rasanya','Mau tanya, bedanya Lv Rutin sama Konsisten itu apa ya?','Minggu ini saya masuk Top 5 peringkat, yeay! 🎉','Ada rekomendasi suplemen yang aman buat pemula?','Udah stretching dulu ya guys, jangan skip, cedera itu nggak enak','Lagi diet nih, ada yang punya jadwal cardio pagi?','Sabtu ini ada yang latihan? Biasanya rame banget','Bench press saya akhirnya tembus 60kg! 💪','Habis latihan langsung ngantuk parah 😴','Sendirian di gym jam segini, sepi enak banget','Dumbbell 12kg di rak sebelah mana ya? Kok kosong'],
ans:['Biasanya jam 18–20 rame banget, mending sebelum jam 5 atau setelah jam 9 malam','PT-nya enak, dikasih program sesuai target dan diawasi form-nya','Bisa QRIS, upload bukti, nanti admin approve','Treadmill-nya udah normal kok tadi, aman','Kalau pemula mending fullbody 3x seminggu dulu','Lv itu dari jumlah kunjungan, makin sering latihan makin naik 😄','Saya biasanya makan telur + nasi, simpel dan murah','Boleh, jam 6 saya ikut. Kabarin aja ya','Aman, barbell-nya udah kosong bro','Cek peringkatnya di tombol Live ya, ada Top 10 bulan ini'],
re:['Mantap bro!','Setuju banget 💪','Haha bener banget','Noted, makasih infonya 🙏','Siap, nanti saya cek','Gas lah! 🔥','Wkwk iya','Keren, semangat terus!','Sama, saya juga ngerasain','Boleh banget','Mantul 👍','Aamiin, semoga konsisten terus','Ikut dong lain kali','Hebat nih, lanjutkan!'],
adm:['Info: besok gym tutup lebih awal jam 21.00 karena perawatan AC. Mohon maaf ya 🙏','Reminder: bawa handuk kecil dan botol minum sendiri ya, rapikan alat setelah dipakai 🙏','Promo bulan ini! Dewasa 1 bulan cuma Rp 75.000. Tanya admin lewat WhatsApp atau daftar langsung di website 💪','Selamat untuk Top 5 member bulan ini! Terus semangat latihan 🔥','Alat baru sudah datang: rak dumbbell tambahan dan bangku incline. Silakan dicoba!','Hari libur nasional tetap buka 06.00–23.00 ya.']
};
var PIN='Peraturan grup: saling menghormati, tidak spam, tidak jualan, dan tidak membagikan data pribadi. Jam buka setiap hari 06.00–23.00. Pengunjung website hanya bisa membaca; yang bisa chat hanya member.';
var AMB=D.hi.concat(D.gen);
var CTX=[[/harga|biaya|paket|bayar|tarif|murah/i,'adm','Harga paket ada di bagian Membership di beranda ya. Dewasa 1 bulan Rp 75.000, pelajar Rp 62.500. Bisa bayar via QRIS 👍'],
[/qris|transfer|bukti/i,'adm','Bayar via QRIS, lalu unggah bukti di dashboard. Admin cek dan membership langsung aktif ya.'],
[/jam|buka|tutup/i,'adm','Kami buka setiap hari 06.00–23.00 kak 😊'],
[/promo|diskon|bonus/i,'adm','Promo terbaru ada di bagian Promo di beranda. Bisa juga tanya admin via WhatsApp.'],
[/pt\b|coach|trainer|personal/i,'mem','Saya pernah ikut PT, diawasi form-nya jadi lebih aman dan cepat progres. Recommended!'],
[/parkir|motor|mobil/i,'mem','Parkir motor aman kok, tapi jangan di depan pintu ya 😅'],
[/alat|treadmill|mesin|dumbbell|barbell|bench/i,'mem','Alatnya lengkap, cuma jam 18–20 biasanya antri. Mending datang lebih awal.'],
[/ramai|rame|sepi|antri/i,'mem','Paling rame jam 18–20. Pagi dan malam lewat jam 9 lebih lega.'],
[/makasih|terima kasih|thanks|thx|tengkyu/i,'mem','Sama-sama 🙏'],
[/lokasi|alamat|dimana|di mana|maps/i,'adm','Kami di Jl. Raya Parung, Bogor. Tombol Google Maps ada di bagian Lokasi ya 📍'],
[/halo|hai|hi\b|pagi|siang|sore|malam|assalam|salam|permisi/i,'mem','Halo juga! Selamat datang di grup 👋'],
[/\?/,'mem','Kalau soal itu mending tanya admin atau coach langsung ya, tapi pengalaman saya sih aman 👍']];
function r(n){return Math.floor(Math.random()*n)}function pick(a){return a[r(a.length)]}
function rng(seed){var a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;var t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function p2(n){return('0'+n).slice(-2)}
function hash(s){var h=0,i;for(i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}

/* ---------- akses data ---------- */
function msgs(){return db.list('chat')}
function save(l){return db.put('chat',l.slice(-MAX))}
function me(){var s=db.session();return s?db.get('members',s.id):null}
function state(u){if(!u)return{ok:false,why:'visitor'};if(u.status==='nonaktif')return{ok:false,why:'off'};
 if(u.role==='admin')return{ok:true,adm:true};if(u.role!=='member')return{ok:false,why:'visitor'};
 if(db.status(u)==='kedaluwarsa')return{ok:false,why:'exp'};return{ok:true}}
function who(m,u){if(!m)return{n:'Member (dihapus)',m:{name:'?'}};if(m.role==='admin')return{n:'Admin Nama GYM',m:m,adm:true};
 var n=FF.first(m.name),ln=String(m.name||'').trim().split(/\s+/)[1];if(ln)n+=' '+ln.charAt(0)+'.';
 if(m.showPublic===false&&!u)return{n:'Member',m:{name:'Member'}};return{n:n,m:m}}
function post(m,text,extra){var l=msgs(),o={id:db.uid('c'),memberId:m.id,text:String(text).slice(0,LIM),at:new Date().toISOString(),r:{}};
 if(extra)for(var k in extra)o[k]=extra[k];if(m.demo&&m.role!=='admin'||extra&&extra.demo)o.demo=true;l.push(o);save(l);return o}
function react(id,e,uid){var l=msgs(),o=null;l.forEach(function(x){if(x.id===id){o=x;x.r=x.r||{};var a=x.r[e]||[],i=a.indexOf(uid);if(i>-1)a.splice(i,1);else a.push(uid);if(a.length)x.r[e]=a;else delete x.r[e]}});if(o)save(l)}
function typing(m){db.kset('chatTyping',m?{id:m.id,n:FF.first(m.name),u:Date.now()+2800}:null)}

/* ---------- seed riwayat demo ---------- */
function seed(){
 if(!w.FF.demo||!FF.demo.on())return;db.ctx.demo=true;
 try{var ms=db.list('members').filter(function(m){return m.demo&&m.role==='member'&&(db.status(m)==='aktif'||db.status(m)==='akan berakhir')}),adm=db.list('members').filter(function(m){return m.role==='admin'})[0];
 var keep=msgs().filter(function(x){return!x.demo});if(!ms.length){db.kset('chatVer',CV);return}
 var R=rng(20261017),now=Date.now(),t=now-72*36e5,out=[],id=0,last=[];
 function add(m,text,at,rp){var o={id:'cs'+(++id)+Math.floor(R()*1e6).toString(36),memberId:m.id,text:text,at:new Date(at).toISOString(),r:{},demo:true};if(rp)o.reply=rp;out.push(o);last.push(o);if(last.length>8)last.shift();return o}
 function mem(){return ms[Math.floor(R()*ms.length)]}
 function pk(a){return a[Math.floor(R()*a.length)]}
 var admDone=0;
 while(true){var step=(8+R()*32)*6e4;t+=step;var H=new Date(t).getHours();if(H<6)t+=(6-H)*36e5;else if(H>=23)t+=(30-H)*36e5;if(t>now-3*6e4)break;
  H=new Date(t).getHours();var x=R();
  if(adm&&x<.035&&admDone<D.adm.length){add(adm,D.adm[admDone++],t);continue}
  var m=mem();
  if(x<.2&&last.length){var q=last[Math.floor(R()*last.length)],qm=ms.filter(function(z){return z.id===q.memberId})[0],nm=qm?FF.first(qm.name):'bro';
   if(m.id===q.memberId)m=mem();add(m,pk(D.re)+(R()<.3?' '+nm:''),t,q.id);continue}
  if(x<.38){var Q=add(m,pk(D.gen),t),m2=mem();while(m2.id===m.id)m2=mem();if(R()<.8)add(m2,pk(D.ans),t+(1+R()*6)*6e4,Q.id);continue}
  if(x<.5&&H<11){add(m,pk(D.hi.slice(0,3)),t);continue}
  add(m,R()<.25?pk(D.hi):pk(D.gen),t)}
 if(adm&&out.length){var first=out[0],pin={id:'cspin',memberId:adm.id,text:PIN,at:new Date(new Date(first.at).getTime()-6e4).toISOString(),r:{},demo:true,pin:true};out.unshift(pin)}
 out.sort(function(a,b){return a.at<b.at?-1:1});
 out.forEach(function(o){if(o.pin||R()>.28)return;var k=1+Math.floor(R()*4),e=pk(RX),a=[],j;for(j=0;j<k;j++){var z=mem();if(a.indexOf(z.id)<0&&z.id!==o.memberId)a.push(z.id)}if(a.length)o.r[e]=a});
 db.put('chat',keep.concat(out).slice(-MAX));db.kset('chatVer',CV)}finally{db.ctx.demo=false}}

/* ---------- simulasi member lain ---------- */
function actives(){return db.list('members').filter(function(m){return m.demo&&m.role==='member'&&(db.status(m)==='aktif'||db.status(m)==='akan berakhir')})}
function admin(){return db.list('members').filter(function(m){return m.role==='admin'&&m.status!=='nonaktif'})[0]}
function say(m,text,extra){extra=extra||{};extra.demo=true;typing(m);setTimeout(function(){typing(null);db.ctx.demo=true;try{post(m,text,extra)}finally{db.ctx.demo=false}ping()},1400+r(1600))}
function tick(){if(!FF.demo||!FF.demo.on()||d.hidden)return;var H=new Date().getHours();if(H<6||H>=23)return;
 var s=db.kget('chatSim',{next:0});if(Date.now()<s.next)return;db.kset('chatSim',{next:Date.now()+30000+r(60000)});
 var as=actives();if(!as.length)return;var m=pick(as),L=msgs(),lm=L[L.length-1],txt=pick(AMB);
 if(lm&&lm.text===txt)txt=pick(D.gen);
 if(lm&&Math.random()<.35&&lm.memberId!==m.id&&!lm.del)say(m,pick(D.re),{reply:lm.id});else say(m,txt)}
function answer(u,o){if(!FF.demo||!FF.demo.on())return;var t=o.text,hit=null,i;for(i=0;i<CTX.length;i++)if(CTX[i][0].test(t)){hit=CTX[i];break}
 var as=actives().filter(function(m){return m.id!==u.id});if(!as.length)return;
 var q=!!hit||Math.random()<.45;if(!q)return;
 if(Math.random()<.7){setTimeout(function(){var L=msgs(),x=null;L.forEach(function(y){if(y.id===o.id)x=y});if(!x)return;var p=pick(as);x.r=x.r||{};x.r[pick(RX)]=[p.id];save(L);ping()},1500+r(2500))}
 setTimeout(function(){var from=hit&&hit[1]==='adm'&&admin()?admin():pick(as),txt=hit?hit[2]:pick(D.re),nm=FF.first(u.name);
  if(hit&&hit[1]==='mem'&&Math.random()<.4)txt='@'+nm+' '+txt;say(from,txt,{reply:o.id});
  if(Math.random()<.3){var b=pick(as);if(b.id!==from.id)setTimeout(function(){say(b,pick(D.re),{})},5000+r(4000))}},3000+r(3000))}

/* ---------- tampilan ---------- */
function dayLabel(iso){var a=new Date(iso),n=new Date(),k=Math.round((new Date(n.getFullYear(),n.getMonth(),n.getDate())-new Date(a.getFullYear(),a.getMonth(),a.getDate()))/864e5);
 if(k===0)return'Hari ini';if(k===1)return'Kemarin';return['Min','Sen','Sel','Rab','Kam','Jum','Sab'][a.getDay()]+', '+a.getDate()+' '+['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][a.getMonth()]}
function hm(iso){var a=new Date(iso);return p2(a.getHours())+'.'+p2(a.getMinutes())}
function ava(m){if(m&&m.role==='admin')return'<span class="av cav adm"><img src="logo.png" alt=""></span>';return FF.av(m,'cav')}
function snippet(o){return o.del?'Pesan dihapus':o.text.length>70?o.text.slice(0,70)+'…':o.text}
function render(keep){if(!list)return;var u=me(),st=state(u),L=msgs(),ms={},byId={},h='',prev=null,day='',pin=null,stick=list.scrollHeight-list.scrollTop-list.clientHeight<90;
 db.list('members').forEach(function(m){ms[m.id]=m});L.forEach(function(x){byId[x.id]=x;if(x.pin&&!x.del)pin=x});
 L.forEach(function(x){var dl=dayLabel(x.at);if(dl!==day){day=dl;h+='<div class="cds"><span>'+E(dl)+'</span></div>';prev=null}
  var mine=u&&x.memberId===u.id,m=ms[x.memberId],wh=who(m,u),grp=prev&&prev.memberId===x.memberId&&new Date(x.at)-new Date(prev.at)<3e5&&!x.reply,cls='cm '+(mine?'me':'ot')+(grp?' g':'')+(sel===x.id?' sel':'');
  h+='<div class="'+cls+'" data-id="'+x.id+'">'+(mine?'':(grp?'<span class="cav sp"></span>':ava(wh.m)))+'<div class="cb2">';
  if(!mine&&!grp)h+='<b class="cn" style="color:'+COLORS[hash(x.memberId)%COLORS.length]+'">'+E(wh.n)+(wh.adm?' <i class="cbd">Admin</i>':'')+'</b>';
  if(x.pin)h+='<span class="cpn">📌 Disematkan</span>';
  if(x.reply&&byId[x.reply]){var q=byId[x.reply],qw=who(ms[q.memberId],u);h+='<a class="cq" data-go="'+q.id+'"><b style="color:'+COLORS[hash(q.memberId)%COLORS.length]+'">'+E(qw.n)+'</b><span>'+E(snippet(q))+'</span></a>'}
  h+=x.del?'<span class="cx">🚫 Pesan ini telah dihapus</span>':'<span class="ctx">'+E(x.text)+'</span>';
  h+='<span class="ct">'+hm(x.at)+(mine?' <em>✓✓</em>':'')+'</span>';
  var rr=x.r||{},rk=Object.keys(rr).filter(function(k){return rr[k].length});if(rk.length&&!x.del)h+='<span class="crx">'+rk.map(function(k){return'<button type="button" data-rx="'+k+'" class="'+(u&&rr[k].indexOf(u.id)>-1?'on':'')+'"'+(st.ok?'':' disabled')+'>'+k+' '+rr[k].length+'</button>'}).join('')+'</span>';
  if(sel===x.id&&st.ok&&!x.del){h+='<span class="cac">'+RX.map(function(k){return'<button type="button" data-react="'+k+'" aria-label="Reaksi '+k+'">'+k+'</button>'}).join('')+'<button type="button" data-act="reply">Balas</button>'+((mine||st.adm)?'<button type="button" data-act="del">Hapus</button>':'')+(st.adm?'<button type="button" data-act="pin">'+(x.pin?'Lepas pin':'Sematkan')+'</button>':'')+'</span>'}
  h+='</div></div>';prev=x});
 var added=L.length-cnt;cnt=L.length;if(open&&!stick&&added>0&&keep!=='bottom')nNew+=added;
 if(!L.length)h='<div class="cempty"><b>Belum ada percakapan.</b><span>Member bisa memulai obrolan pertama di sini.</span></div>';
 var sc=list.scrollTop;list.innerHTML=h;if(stick||keep==='bottom')list.scrollTop=list.scrollHeight;else list.scrollTop=sc;
 var pb=box.querySelector('.cpin');pb.hidden=!pin;if(pin){pb.setAttribute('data-go',pin.id);pb.querySelector('span').textContent=pin.text}
 foot(st,u);head(L,u);if(open&&stick){nNew=0;newBtn()}}
function onsite(){if(Date.now()-onC.t>20000){onC.t=Date.now();onC.n=db.onsite(3).length}return onC.n}
function head(L,u){var s=box.querySelector('.chs'),t=db.kget('chatTyping',null),on=onsite(),mc=db.list('members').filter(function(m){return m.role==='member'&&m.status!=='nonaktif'}).length;
 if(t&&t.u>Date.now()&&(!u||t.id!==u.id))s.innerHTML='<span class="cty">'+E(t.n)+' sedang mengetik<i>.</i><i>.</i><i>.</i></span>';
 else s.textContent=mc+' member · '+on+' sedang di gym'}
function foot(st,u){var f=box.querySelector('.cft'),key=st.ok?'ok':st.why;if(f.getAttribute('data-k')===key)return;f.setAttribute('data-k',key);
 if(st.ok){f.innerHTML='<div class="crp" hidden><div><b></b><span></span></div><button type="button" class="cxx" aria-label="Batal balas">✕</button></div><div class="cem" hidden>'+EMO.map(function(e){return'<button type="button" data-emo="'+e+'">'+e+'</button>'}).join('')+'</div><form class="cfm"><button type="button" class="cemb" aria-label="Emoji">😊</button><textarea rows="1" maxlength="'+LIM+'" placeholder="Tulis pesan sebagai '+E(u?FF.first(u.name):'')+'…" aria-label="Tulis pesan"></textarea><button class="csd" aria-label="Kirim"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6 3.3 10l12.6 2-12.6 2z"/></svg></button></form>';
  inp=f.querySelector('textarea')}
 else{inp=null;rep=null;var msg=st.why==='exp'?'Membership kamu sudah kedaluwarsa. Perpanjang dulu untuk bisa chat lagi.':st.why==='off'?'Akun kamu dinonaktifkan. Hubungi admin.':'Hanya member yang bisa mengirim pesan. Kamu melihat grup ini sebagai pengunjung.';
  f.innerHTML='<div class="cro"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><p>'+msg+'</p>'+(st.why==='visitor'?'<div class="acts"><a class="btn s" href="login.html">Login</a><a class="btn s p" href="register.html">Daftar member</a></div>':st.why==='exp'?'<div class="acts"><a class="btn s p" href="member.html">Perpanjang</a></div>':'')+'</div>'}}
function newBtn(){var b=box.querySelector('.cnw');b.hidden=!nNew;b.textContent='↓ '+nNew+' pesan baru'}
function unread(){var u=me(),k='chatSeen:'+(u?u.id:'tamu'),s=db.kget(k,0),n=0;msgs().forEach(function(x){if(x.at&&new Date(x.at).getTime()>s&&(!u||x.memberId!==u.id)&&!x.del)n++});return n}
function badge(){if(!fab)return;var n=open?0:unread(),b=fab.querySelector('.cnb');b.textContent=n>99?'99+':n;b.hidden=!n}
function markSeen(){var u=me();db.kset('chatSeen:'+(u?u.id:'tamu'),Date.now());badge()}
function ping(){if(!box)return;render();if(open){markSeen()}else badge()}
function send(){var u=me(),st=state(u);if(!st.ok||!inp)return;var t=inp.value.replace(/\s+$/,'').replace(/^\s+/,'');if(!t)return;
 if(Date.now()-lastSend<1000){FF.toast('Pelan-pelan ya, tunggu sebentar.','err');return}
 var L=msgs(),lm=L[L.length-1];if(lm&&lm.memberId===u.id&&lm.text===t&&Date.now()-new Date(lm.at)<2e4){FF.toast('Pesan yang sama baru saja dikirim.','err');return}
 lastSend=Date.now();var o=post(u,t,rep?{reply:rep}:null);inp.value='';inp.style.height='';rep=null;repBar();db.log('Chat',u.id);render('bottom');markSeen();if(u.role==='member')answer(u,o)}
function repBar(){var b=box.querySelector('.crp');if(!b)return;if(!rep){b.hidden=true;return}var x=msgs().filter(function(y){return y.id===rep})[0];if(!x){rep=null;b.hidden=true;return}
 var m=db.get('members',x.memberId);b.hidden=false;b.querySelector('b').textContent=who(m,me()).n;b.querySelector('span').textContent=snippet(x);if(inp)inp.focus()}
function scrollTo(id){var e=list.querySelector('[data-id="'+id+'"]');if(!e)return;e.scrollIntoView({block:'center'});e.className+=' hl';setTimeout(function(){e.className=e.className.replace(' hl','')},1400)}
function build(){
 fab=d.createElement('button');fab.type='button';fab.id='cfab';fab.className='fab cfab'+(d.getElementById('fab')?' up':'');fab.setAttribute('aria-haspopup','dialog');fab.setAttribute('aria-expanded','false');fab.setAttribute('aria-controls','cb');
 fab.innerHTML='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12z"/></svg><span class="fl" aria-hidden="true">Chat</span><span class="cnb" hidden>0</span>';
 box=d.createElement('section');box.id='cb';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','Grup chat Nama GYM');
 box.innerHTML='<div class="chh"><img class="chl" src="logo.png" alt=""><div class="chn"><b>Komunitas Nama GYM</b><small class="chs"></small></div><button type="button" class="btn s" id="cbx" aria-label="Tutup chat">✕</button></div>'+
 '<button type="button" class="cpin" hidden><b>📌</b><span></span></button><div class="clist" id="clist" role="log" aria-live="polite" aria-label="Pesan grup"></div><button type="button" class="cnw" hidden></button><div class="cft"></div>';
 d.body.appendChild(box);d.body.appendChild(fab);list=box.querySelector('#clist')}
function openChat(){open=true;box.hidden=false;fab.setAttribute('aria-expanded','true');d.documentElement.className+=' cb-open';fit();render('bottom');markSeen();nNew=0;newBtn();setTimeout(function(){if(inp&&!('ontouchstart' in w))inp.focus()},40)}
function closeChat(ret){open=false;box.hidden=true;sel=null;fab.setAttribute('aria-expanded','false');d.documentElement.className=d.documentElement.className.replace(' cb-open','');if(ret)fab.focus();badge()}
function fit(){var v=w.visualViewport;if(!v||w.innerWidth>767){box.style.height='';box.style.top='';return}box.style.height=Math.max(260,v.height-16)+'px';box.style.top=(v.offsetTop+8)+'px';box.style.bottom='auto'}
function init(){if(w.FF.demo&&FF.demo.on()&&db.kget('chatVer',0)<CV)seed();build();badge();head(msgs(),me());
 fab.addEventListener('click',function(){open?closeChat(true):openChat()});box.querySelector('#cbx').addEventListener('click',function(){closeChat(true)});
 d.addEventListener('keydown',function(e){if(e.key==='Escape'&&open){if(sel){sel=null;render()}else closeChat(true)}});
 if(w.visualViewport){visualViewport.addEventListener('resize',function(){if(open)fit()});visualViewport.addEventListener('scroll',function(){if(open)fit()})}
 box.addEventListener('click',function(e){var t=e.target,b;
  if(t.closest('.cxx')){rep=null;repBar();return}
  if(t.closest('.cemb')){var em=box.querySelector('.cem');em.hidden=!em.hidden;return}
  if(b=t.closest('[data-emo]')){if(inp){inp.value+=b.getAttribute('data-emo');inp.focus()}return}
  if(b=t.closest('.cnw')){list.scrollTop=list.scrollHeight;nNew=0;newBtn();return}
  if(b=t.closest('.cpin')){scrollTo(b.getAttribute('data-go'));return}
  if(b=t.closest('[data-go]')){scrollTo(b.getAttribute('data-go'));return}
  var u=me(),st=state(u),row=t.closest('.cm');
  if(b=t.closest('[data-react],[data-rx]')){if(!st.ok||!row)return;react(row.getAttribute('data-id'),b.getAttribute('data-react')||b.getAttribute('data-rx'),u.id);sel=null;render();return}
  if(b=t.closest('[data-act]')){if(!st.ok||!row)return;var id=row.getAttribute('data-id'),a=b.getAttribute('data-act');
   if(a==='reply'){rep=id;sel=null;render();repBar()}
   else if(a==='del'){var L=msgs();L.forEach(function(x){if(x.id===id&&(x.memberId===u.id||st.adm)){x.del=true;x.text='';x.pin=false;x.r={}}});save(L);sel=null;render();FF.toast('Pesan dihapus')}
   else if(a==='pin'){var L2=msgs();L2.forEach(function(x){x.pin=(x.id===id&&!x.pin)});save(L2);sel=null;render()}return}
  if(row&&st.ok){var id2=row.getAttribute('data-id');sel=sel===id2?null:id2;render()}});
 box.addEventListener('input',function(e){if(e.target===inp){inp.style.height='auto';inp.style.height=Math.min(120,inp.scrollHeight)+'px'}});
 box.addEventListener('submit',function(e){e.preventDefault();send()});
 box.addEventListener('keydown',function(e){if(e.target===inp&&e.key==='Enter'&&!e.shiftKey&&!('ontouchstart' in w)){e.preventDefault();send()}});
 list.addEventListener('scroll',function(){if(list.scrollHeight-list.scrollTop-list.clientHeight<90&&nNew){nNew=0;newBtn()}});
 w.addEventListener('storage',function(e){if(!e.key||e.key==='ff_chat'||e.key==='ff_chatTyping'||e.key==='ff_session'||e.key==='ff_members'){var n0=msgs().length;render();if(e.key==='ff_chat'){var u=me();if(open){var d0=msgs().length-n0;if(list.scrollHeight-list.scrollTop-list.clientHeight>=90&&d0>0){nNew+=d0;newBtn()}markSeen()}else badge()}}});
 setInterval(function(){head(msgs(),me());if(!open)badge()},3000);
 setTimeout(function(){tick();simT=setInterval(tick,9000)},4000);
 FF.chat={open:openChat,seed:function(){db.kset('chatVer',0);seed();if(box)render()},render:function(){if(box)render()}}}
d.addEventListener('DOMContentLoaded',init);
})(window,document);
