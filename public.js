(function(d){
d.addEventListener('DOMContentLoaded',function(){
var db=FF.db,s=db.settings(),t=db.today(),E=FF.esc,pk=db.list('packages').filter(function(p){return p.active});
function wa(txt){var u=FF.wa(s[s.waPrimary||'phone1']||s.phone1);return u?u+'?text='+encodeURIComponent(txt):''}
function card(p){var ended=p.promoEnd&&p.promoEnd<t,li=[],w=wa('Halo FUN FITNESS, saya mau tanya paket '+p.name);
if(p.months)li.push(p.months+' bulan membership');if(p.bonus)li.push('Bonus '+p.bonus+' bulan membership');
if(p.type==='pt'&&p.bonus)li.push('Ketentuan bonus menunggu konfirmasi resmi');if(p.promoEnd)li.push(ended?'Promo berakhir '+FF.tgl(p.promoEnd):'Promo berlaku s.d. '+FF.tgl(p.promoEnd));
return'<article class="card pk'+(p.popular?' pop':'')+(ended?' off':'')+'">'+(p.popular?'<span class="bd g" style="align-self:flex-start">Paket Populer</span>':'')+(ended?'<span class="bd r" style="align-self:flex-start">Promo berakhir</span>':'')+'<h3>'+E(p.name)+'</h3><div class="price">'+(p.price==null?'<small>Harga belum dikonfirmasi</small>':FF.rp(p.price))+'</div><ul>'+li.map(function(x){return'<li>'+E(x)+'</li>'}).join('')+'</ul>'+(p.note?'<p class="mut" style="font-size:13px">'+E(p.note)+'</p>':'')+(p.price==null?'<span class="bd y" style="align-self:flex-start">Harga dan ketentuan perlu dikonfirmasi</span>':'')+'<div class="acts">'+(p.price!=null&&!ended?'<a class="btn p" href="register.html?pkg='+encodeURIComponent(p.id)+'">Daftar</a>':'')+(w?'<a class="btn" href="'+w+'" target="_blank" rel="noopener">Tanya admin</a>':'')+'</div></article>'}
function put(id,type){var l=pk.filter(function(p){return p.type===type});d.getElementById(id).innerHTML=l.length?l.map(card).join(''):'<p class="mut">Belum ada paket aktif. Hubungi admin untuk info terbaru.</p>'}
put('pk','member');put('pt','pt');
var live=pk.filter(function(p){return!(p.promoEnd&&p.promoEnd<t)}).slice(0,4);
d.getElementById('heroPromo').innerHTML='<h3>Promo & paket</h3>'+(live.map(function(p){return'<div class="it"><span>'+E(p.name)+(p.bonus?'<br><small style="color:#A6ADB7">Bonus '+p.bonus+' bulan</small>':'')+'</span><b>'+(p.price==null?'Tanya admin':FF.rp(p.price))+'</b></div>'}).join('')||'<p>Hubungi admin untuk info promo.</p>')+'<p style="margin:12px 0 0"><a href="#paket" style="color:#fff;font-weight:700">Lihat semua paket</a></p>';
d.getElementById('mgm').innerHTML='<h3>Member Get Member</h3><p>'+E(s.mgm)+'</p><span class="bd y">'+E(s.mgmStatus)+'</span>';
var g=d.getElementById('ctaWa'),u=wa('Halo FUN FITNESS, saya mau tanya promo.');if(u){g.href=u;g.target='_blank';g.rel='noopener'}else g.style.display='none';
var bw=d.getElementById('barWa');if(u)bw.href=u;else bw.style.display='none';var hw=d.getElementById('heroWa');if(u)hw.href=u;else hw.style.display='none';
var ph=[s.phone1,s.phone2,s.phone3].filter(function(x){return x&&x.trim()}),h=ph.length?ph.map(function(x){var w=FF.wa(x);return w?'<a href="'+w+'" target="_blank" rel="noopener">'+E(x)+'</a>':E(x)}).join(' &nbsp;•&nbsp; '):'Kontak belum tersedia';
d.getElementById('contact').innerHTML=h;d.getElementById('fcontact').innerHTML=h;
d.getElementById('year').textContent=new Date().getFullYear();
var G=[['gym-interior.jpg','Interior FUN FITNESS'],['hero-gym.jpg','Area latihan FUN FITNESS'],['gym-treadmill.jpg','Treadmill'],['gym-dumbbell.jpg','Dumbbell'],['gym-mesin.jpg','Mesin latihan']],gl=d.getElementById('gal'),lb=d.getElementById('lb');
gl.innerHTML=G.map(function(x){return'<figure><img src="'+x[0]+'" alt="'+x[1]+'" loading="lazy"></figure>'}).join('');
function bad(i){var f=i.parentNode;if(f.parentNode)f.parentNode.removeChild(f);if(!gl.querySelector('img'))gl.innerHTML='<div class="card" style="grid-column:1/-1"><p class="mut" style="margin:0">Foto galeri akan segera hadir. Lihat Instagram kami untuk foto terbaru.</p><p style="margin:12px 0 0"><a class="btn p" href="'+s.ig+'" target="_blank" rel="noopener">Lihat Instagram</a></p></div>'}
gl.querySelectorAll('img').forEach(function(i){i.addEventListener('error',function(){bad(i)});if(i.complete&&!i.naturalWidth)bad(i)});
gl.addEventListener('click',function(e){var i=e.target.tagName==='IMG'?e.target:null;if(i){lb.querySelector('img').src=i.src;lb.querySelector('img').alt=i.alt;lb.className='on'}});
lb.addEventListener('click',function(){lb.className=''});d.addEventListener('keydown',function(e){if(e.key==='Escape')lb.className=''});
d.querySelectorAll('.nav nav a').forEach(function(a){a.addEventListener('click',function(){d.body.classList.remove('menu')})});

var regs=pk.filter(function(x){return x.type==='reguler'}),grp='dewasa';
function reg(){var l=regs.filter(function(x){return x.group===grp}),e=d.getElementById('reg');e.innerHTML=l.length?l.map(function(x){var w=wa('Halo FUN FITNESS, saya mau tanya paket '+x.name),nm=x.name.indexOf(' - ')>-1?x.name.split(' - ')[1]:x.name;return'<article class="card rc'+(x.popular?' pop':'')+'">'+(x.popular?'<span class="bd g">Populer</span>':'')+'<b class="rd">'+E(nm)+'</b><div class="price">'+(x.price==null?'<small>Tanya admin</small>':FF.rp(x.price))+'</div><div class="acts">'+(x.price!=null?'<a class="btn p s" href="register.html?pkg='+encodeURIComponent(x.id)+'">Daftar</a>':'')+(w?'<a class="btn s" href="'+w+'" target="_blank" rel="noopener">Tanya</a>':'')+'</div></article>'}).join(''):'<p class="mut">Belum ada paket pada kategori ini.</p>'}
[].forEach.call(d.querySelectorAll('.seg button'),function(b){b.addEventListener('click',function(){grp=b.getAttribute('data-g');[].forEach.call(d.querySelectorAll('.seg button'),function(x){x.className=x===b?'on':''});reg()})});reg();
d.getElementById('regwrap').style.display=regs.length?'':'none';
var fe=[];if(s.feeVisit!=null&&s.feeVisit!=='')fe.push(['Visit harian',FF.rp(+s.feeVisit)]);if(s.feeReg!=null&&s.feeReg!=='')fe.push(['Registrasi member baru',FF.rp(+s.feeReg)]);
d.getElementById('fees').innerHTML=fe.map(function(x){return'<div class="tile"><b>'+x[1]+'</b><span>'+x[0]+'</span></div>'}).join('');
var ig=(s.ig||'').replace(/\/+$/,'').split('/').pop();d.getElementById('social').innerHTML=(s.ig?'<a href="'+E(s.ig)+'" target="_blank" rel="noopener">@'+E(ig)+'</a>':'')+(s.fbName?' &nbsp;&bull;&nbsp; Facebook: '+E(s.fbName):'');
var shareUrl=location.href.split('#')[0].split('?')[0];
[].forEach.call(d.querySelectorAll('.sharebtn'),function(b){b.addEventListener('click',function(e){e.preventDefault();var txt=s.shareText||'';if(navigator.share){navigator.share({title:'FUN FITNESS',text:txt,url:shareUrl}).catch(function(){})}else{window.open('https://wa.me/?text='+encodeURIComponent(txt+' '+shareUrl),'_blank')}})});

var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
var mp=pk.filter(function(x){return x.type==='member'&&x.price!=null&&!(x.promoEnd&&x.promoEnd<t)}).map(function(x){return x.price}),hasPt=pk.some(function(x){return x.type==='pt'}),tl=[[s.hours,'Jam operasional']];
if(mp.length)tl.push([FF.rp(Math.min.apply(null,mp)),'Membership mulai dari']);if(hasPt)tl.push(['Personal Training','Paket 2 dan 5 sesi tersedia']);
d.getElementById('tiles').innerHTML=tl.map(function(x){return'<div class="tile"><b>'+E(x[0])+'</b><span>'+E(x[1])+'</span></div>'}).join('');
if('IntersectionObserver' in window&&!rm){var rv=d.querySelectorAll('.sh,.ab>div,.card,.poster,.tile');[].forEach.call(rv,function(e){e.className+=' rv'});
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.className+=' in';io.unobserve(x.target)}})},{threshold:.06});[].forEach.call(rv,function(e){io.observe(e)})}
if('IntersectionObserver' in window){var lk={};[].forEach.call(d.querySelectorAll('.nav nav a[href^="#"]'),function(a){lk[a.getAttribute('href').slice(1)]=a});
var so=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){for(var k in lk)lk[k].className=lk[k].className.replace(' on','');if(lk[x.target.id])lk[x.target.id].className+=' on'}})},{rootMargin:'-45% 0px -50% 0px'});Object.keys(lk).forEach(function(k){var e=d.getElementById(k);if(e)so.observe(e)})}
var sp=d.createElement('div'),tk=0;sp.id='sp';d.body.appendChild(sp);
window.addEventListener('scroll',function(){if(tk)return;tk=1;requestAnimationFrame(function(){var h=d.documentElement.scrollHeight-window.innerHeight;sp.style.width=(h>0?window.pageYOffset/h*100:0)+'%';tk=0})},{passive:true});
});
})(document);
