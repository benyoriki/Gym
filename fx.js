/* fx.js: kartu "Gym Live" di hero (data nyata: orang sekarang, check-in hari ini, jam ramai), sorotan kursor,
   navbar & tombol Live yang beradaptasi saat scroll. Ringan: tanpa library, hanya transform/opacity. */
(function(w,d){
var rm=w.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches,hov=w.matchMedia&&matchMedia('(hover:hover)').matches;
function p2(n){return('0'+n).slice(-2)}
function cu(el,n){if(rm||!(n>0)){el.textContent=n;return}var t0=performance.now(),D=800;(function f(){var k=Math.min(1,(performance.now()-t0)/D);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})()}
var first=true;
function tele(){var el=d.getElementById('tele'),db=w.FF&&FF.db;if(!el||!db)return;
 var now=new Date(),H=now.getHours(),open=H>=6&&H<23,t0=Date.now()-14*864e5,today=db.today(),prof=[],i,ci=0,mx=0;
 for(i=0;i<17;i++)prof.push(0);
 db.list('visits').forEach(function(v){var t=new Date(v.at),h=t.getHours();if(t.getTime()<t0)return;if(h>=6&&h<=22)prof[h-6]++;if(db.ymd(t)===today)ci++});
 prof.forEach(function(x){if(x>mx)mx=x});
 var ons=db.onsite(3).length,act=db.list('members').filter(function(m){if(m.role!=='member')return false;var s=db.status(m);return s==='aktif'||s==='akan berakhir'}).length,
 cur=open?prof[H-6]:0,ratio=mx?cur/mx:0,lbl=!open?'Tutup':!mx?'Belum ada data':ratio>=.7?'Ramai':ratio>=.4?'Sedang':'Santai',
 bars=prof.map(function(x,k){return'<i class="'+(open&&k===H-6?'now':'')+'" style="--i:'+k+';--h:'+(mx?Math.max(8,Math.round(x/mx*100)):8)+'"></i>'}).join('');
 el.innerHTML='<div class="th"><span class="ts'+(open?'':' off')+'"><i></i>Gym live</span><span class="tc" id="teleClock">'+p2(H)+'.'+p2(now.getMinutes())+'</span></div>'+
 '<p class="tsub">'+(open?'Buka sekarang · tutup 23.00':'Tutup · buka lagi 06.00')+'</p>'+
 '<div class="tk"><div><b data-n="'+ons+'">0</b><span>Sedang di gym</span></div><div><b data-n="'+ci+'">0</b><span>Check-in hari ini</span></div><div><b data-n="'+act+'">0</b><span>Member aktif</span></div></div>'+
 '<div class="tl"><b>Jam ramai</b><span>Sekarang: '+lbl+'</span></div><div class="tb" aria-hidden="true">'+bars+'</div><div class="tx2" aria-hidden="true"><span>06</span><span>10</span><span>14</span><span>18</span><span>22</span></div>'+
 '<button type="button" class="btn p" id="teleGo">Lihat siapa yang latihan</button>';
 [].forEach.call(el.querySelectorAll('[data-n]'),function(b){var n=+b.getAttribute('data-n');if(first)cu(b,n);else b.textContent=n});first=false}
d.addEventListener('DOMContentLoaded',function(){
 tele();setInterval(function(){if(!d.hidden)tele()},30000);
 setInterval(function(){var c=d.getElementById('teleClock');if(c&&!d.hidden){var n=new Date();c.textContent=p2(n.getHours())+'.'+p2(n.getMinutes())}},5000);
 w.addEventListener('storage',tele);
 d.addEventListener('click',function(e){if(e.target.id==='teleGo'){var f=d.getElementById('fab');if(f)f.click()}});
 var nav=d.querySelector('.nav'),tk=0,idle=0;
 w.addEventListener('scroll',function(){if(tk)return;tk=1;requestAnimationFrame(function(){tk=0;var y=w.pageYOffset,f=d.getElementById('fab');if(nav)nav.className=nav.className.replace(' sc','')+(y>8?' sc':'');
  if(f){f.classList.toggle('min',y>160);clearTimeout(idle);if(y>160)idle=setTimeout(function(){f.classList.remove('min')},900)}})},{passive:true});
});
if(hov&&!rm){var raf=0,lx,ly,lt;d.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var el=e.target.closest&&e.target.closest('.card,.tile');if(!el||el.classList.contains('mapc'))return;lx=e.clientX;ly=e.clientY;lt=el;if(raf)return;
 raf=requestAnimationFrame(function(){raf=0;var r=lt.getBoundingClientRect();lt.style.setProperty('--mx',(lx-r.left)+'px');lt.style.setProperty('--my',(ly-r.top)+'px');if(!lt.classList.contains('fx'))lt.classList.add('fx')})},{passive:true})}
})(window,document);
