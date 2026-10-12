/* Tombol Live (pojok kanan bawah, seperti chat box): member yang sedang di gym + peringkat member paling rajin.
   Data dari check-in 3 jam terakhir. Hanya nama depan & foto member yang mengizinkan (kotak centang di dashboard member). */
(function(w,d){
if(!w.FF||!FF.db)return;
var db=FF.db,E=FF.esc,HRS=3,tab='on',per='month',fab,box,tm;
function ago(iso){var m=Math.max(0,Math.round((Date.now()-new Date(iso).getTime())/6e4));if(m<2)return'baru saja';if(m<60)return m+' menit lalu';var h=Math.floor(m/60);return h+' jam '+(m%60?m%60+' mnt ':'')+'lalu'}
function monthStart(){return db.today().slice(0,7)+'-01'}
function onsite(){var cut=Date.now()-HRS*36e5,seen={},ms={},out=[];db.list('members').forEach(function(m){ms[m.id]=m});
 db.list('visits').slice().reverse().forEach(function(v){var m=ms[v.memberId];if(!m||seen[m.id]||new Date(v.at).getTime()<cut)return;seen[m.id]=1;if(m.status!=='nonaktif'&&m.showPublic!==false)out.push({m:m,at:v.at})});
 out.sort(function(a,b){return a.at<b.at?1:-1});return out}
function build(){
 fab=d.createElement('button');fab.id='fab';fab.type='button';fab.className='fab';fab.setAttribute('aria-haspopup','dialog');fab.setAttribute('aria-expanded','false');fab.setAttribute('aria-controls','lv');
 fab.innerHTML='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/></svg><span class="fc" id="fc">0</span><span class="fl" aria-hidden="true">Live</span>';
 box=d.createElement('section');box.id='lv';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','Live di FUN FITNESS');
 box.innerHTML='<div class="lvh"><span class="live"></span><div><b>Live di FUN FITNESS</b><small id="lvs"></small></div><button type="button" class="btn s" id="lvx" aria-label="Tutup">✕</button></div>'+
 '<div class="lvt" role="tablist"><button type="button" role="tab" id="tOn" aria-selected="true" aria-controls="pOn">Sedang di gym <i id="tOnN">0</i></button><button type="button" role="tab" id="tRk" aria-selected="false" aria-controls="pRk">Peringkat</button></div>'+
 '<div class="lvb" id="pOn" role="tabpanel" aria-labelledby="tOn"></div>'+
 '<div class="lvb" id="pRk" role="tabpanel" aria-labelledby="tRk" hidden><div class="seg sm" role="group" aria-label="Periode"><button type="button" data-p="month" class="on">Bulan ini</button><button type="button" data-p="all">Semua waktu</button></div><div id="rk"></div></div>'+
 '<p class="lvn" id="lvn">Berdasarkan check-in 3 jam terakhir. Hanya nama depan dan foto member yang mengizinkan.</p>';
 d.body.appendChild(box);d.body.appendChild(fab)}
function viewOn(){var l=onsite(),c=db.counts(),e=d.getElementById('pOn');
 e.innerHTML=l.length?l.map(function(x){var L=db.level(c[x.m.id]||0);return'<div class="lr">'+FF.av(x.m)+'<div class="lm"><b>'+E(FF.first(x.m.name))+'</b><span>'+ago(x.at)+'</span></div><span class="bd g">Lv '+L.lv+' · '+L.name+'</span></div>'}).join(''):
 (function(){var H=new Date().getHours();return H>=6&&H<23?'<div class="lempty"><b>Belum ada check-in dalam 3 jam terakhir.</b><span>Jadilah yang pertama latihan hari ini.</span><a class="btn p s" href="register.html">Daftar member</a></div>':'<div class="lempty"><b>Gym sedang tutup.</b><span>Buka lagi pukul 06.00. Sampai jumpa besok pagi!</span><a class="btn p s" href="register.html">Daftar member</a></div>'})();
 return l.length}
function medal(i){return i===0?'m1':i===1?'m2':i===2?'m3':''}
function viewRk(){var since=per==='month'?monthStart():null,all=db.ranking(since,false),pub=all.filter(function(x){return x.m.showPublic!==false}),top=pub.slice(0,10),mx=top.length?top[0].n:1,c=db.counts(),e=d.getElementById('rk'),s=db.session(),mine='';
 if(s&&s.role==='member'){var pos=-1;all.forEach(function(x,i){if(x.m.id===s.id)pos=i});var me=db.get('members',s.id);if(me)mine='<div class="lme">Kamu: '+(pos>-1?'peringkat <b>#'+(pos+1)+'</b> dari '+all.length+' · '+all[pos].n+' kunjungan':'belum ada kunjungan '+(per==='month'?'bulan ini':'tercatat'))+'</div>'}
 e.innerHTML=(top.length?top.map(function(x,i){var L=db.level(c[x.m.id]||0);return'<div class="lr rk"><b class="rn '+medal(i)+'">'+(i+1)+'</b>'+FF.av(x.m)+'<div class="lm"><b>'+E(FF.first(x.m.name))+'</b><div class="rbar"><i style="width:'+Math.max(6,x.n/mx*100)+'%"></i></div></div><div class="rv2"><b>'+x.n+'x</b><span>Lv '+L.lv+'</span></div></div>'}).join(''):'<div class="lempty"><b>Belum ada data kunjungan.</b><span>Peringkat muncul setelah member check-in.</span></div>')+mine}
function refresh(){if(!fab)return;var n=0;try{n=viewOn();viewRk()}catch(x){}
 d.getElementById('fc').textContent=n;d.getElementById('fc').className='fc'+(n?'':' z');d.getElementById('tOnN').textContent=n;
 var demo=db.list('members').some(function(m){return m.demo&&m.role==='member'});
 d.getElementById('lvs').innerHTML=(n?n+' member sedang latihan':(new Date().getHours()>=6&&new Date().getHours()<23?'Belum ada yang check-in':'Gym sedang tutup'))+(demo?' <span class="bd y">DEMO</span>':'');
 fab.setAttribute('aria-label','Live: '+n+' member sedang di gym. Buka daftar dan peringkat.')}
function setTab(t){tab=t;var on=t==='on';d.getElementById('tOn').setAttribute('aria-selected',on);d.getElementById('tRk').setAttribute('aria-selected',!on);d.getElementById('pOn').hidden=!on;d.getElementById('pRk').hidden=on;
 d.getElementById('lvn').textContent=on?'Berdasarkan check-in 3 jam terakhir. Hanya nama depan dan foto member yang mengizinkan.':'Peringkat berdasarkan jumlah kunjungan. Hanya member yang mengizinkan tampil.'}
function open(){refresh();box.hidden=false;fab.setAttribute('aria-expanded','true');d.documentElement.className+=' lv-open';setTimeout(function(){d.getElementById('lvx').focus()},30)}
function close(ret){box.hidden=true;fab.setAttribute('aria-expanded','false');d.documentElement.className=d.documentElement.className.replace(' lv-open','');if(ret)fab.focus()}
function init(){build();refresh();
 fab.addEventListener('click',function(){box.hidden?open():close(true)});
 d.getElementById('lvx').addEventListener('click',function(){close(true)});
 d.getElementById('tOn').addEventListener('click',function(){setTab('on')});d.getElementById('tRk').addEventListener('click',function(){setTab('rk');viewRk()});
 box.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){var t=e.target;if(t.id==='tOn'){setTab('rk');d.getElementById('tRk').focus()}else if(t.id==='tRk'){setTab('on');d.getElementById('tOn').focus()}}});
 [].forEach.call(box.querySelectorAll('.seg button'),function(b){b.addEventListener('click',function(){per=b.getAttribute('data-p');[].forEach.call(box.querySelectorAll('.seg button'),function(x){x.className=x===b?'on':''});viewRk()})});
 d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!box.hidden)close(true)});
 d.addEventListener('click',function(e){if(!box.hidden&&!box.contains(e.target)&&!fab.contains(e.target))close(false)});
 w.addEventListener('storage',function(){refresh()});setInterval(refresh,30000);FF.refresh=refresh}
d.addEventListener('DOMContentLoaded',init);
})(window,document);
