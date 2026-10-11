(function(d){
d.addEventListener('DOMContentLoaded',function(){
var db=FF.db,s=db.settings(),pk=db.list('packages').filter(function(p){return p.active});
function card(p){var ended=p.promoEnd&&p.promoEnd<db.today();
return'<article class="card pk'+(p.popular?' pop':'')+'">'+(p.popular?'<span class="bd g">Populer</span>':'')+'<h3>'+FF.esc(p.name)+'</h3><div class="price">'+(p.price==null?'<small>Harga belum dikonfirmasi</small>':FF.rp(p.price))+'</div><p>'+(p.months?p.months+' bulan':'')+(p.bonus?' + bonus '+p.bonus+' bulan':'')+'</p><p class="mut">'+FF.esc(p.note)+'</p>'+(p.promoEnd?'<p class="mut">Periode promo s.d. '+FF.tgl(p.promoEnd)+(ended?' <b>(sudah berakhir — konfirmasi ke admin)</b>':'')+'</p>':'')+(p.price==null?'<span class="bd y">Harga dan ketentuan perlu dikonfirmasi</span>':'<a class="btn p" href="register.html?pkg='+encodeURIComponent(p.id)+'">Daftar</a>')+'</article>'}
function put(id,type){var e=d.getElementById(id),l=pk.filter(function(p){return p.type===type});e.innerHTML=l.length?l.map(card).join(''):'<p class="mut">Belum ada paket aktif.</p>'}
put('pk','member');put('pt','pt');
d.getElementById('mgm').innerHTML='<h3>Member Get Member</h3><p>'+FF.esc(s.mgm)+'</p><span class="bd y">'+FF.esc(s.mgmStatus)+'</span>';
var g=d.getElementById('ctaWa');var u=FF.wa(s.phone1);if(g&&u)g.href=u+'?text='+encodeURIComponent('Halo FUN FITNESS, saya mau tanya promo.');
d.getElementById('year').textContent=new Date().getFullYear();
});
})(document);
