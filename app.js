(function(w,d){
var FF=w.FF=w.FF||{};
try{d.documentElement.setAttribute('data-theme',localStorage.getItem('ff_theme')||'dark')}catch(e){}
FF.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
FF.rp=function(n){if(n==null||n==='')return'—';try{return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)}catch(e){return'Rp'+String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')}};
var BL=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
FF.tgl=function(s){if(!s)return'—';var x=new Date(s.length>10?s:s+'T00:00:00');return isNaN(x)?'—':x.getDate()+' '+BL[x.getMonth()]+' '+x.getFullYear()};
FF.jam=function(s){var x=new Date(s);return FF.tgl(s)+' '+('0'+x.getHours()).slice(-2)+':'+('0'+x.getMinutes()).slice(-2)};
FF.wa=function(p){var n=String(p||'').replace(/\D/g,'');if(n.indexOf('0')===0)n='62'+n.slice(1);return/^62\d{9,12}$/.test(n)?'https://wa.me/'+n:null};
FF.badge=function(s){var c={aktif:'g','akan berakhir':'y',kedaluwarsa:'r',menunggu:'y',nonaktif:'r',disetujui:'g',ditolak:'r',dibatalkan:'r'}[s]||'';return'<span class="bd '+c+'">'+FF.esc(s)+'</span>'};
FF.toast=function(msg,type){var b=d.getElementById('toasts');if(!b){b=d.createElement('div');b.id='toasts';b.setAttribute('aria-live','polite');d.body.appendChild(b)}var t=d.createElement('div');t.className='toast '+(type||'');t.textContent=msg;b.appendChild(t);setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t)},3500)};
FF.csv=function(name,rows){var s='\uFEFF'+rows.map(function(r){return r.map(function(c){return'"'+String(c==null?'':c).replace(/"/g,'""')+'"'}).join(';')}).join('\r\n');var a=d.createElement('a');a.href=URL.createObjectURL(new Blob([s],{type:'text/csv;charset=utf-8'}));a.download=name;d.body.appendChild(a);a.click();d.body.removeChild(a)};
d.addEventListener('DOMContentLoaded',function(){
var t=d.getElementById('theme');if(t)t.addEventListener('click',function(){var n=d.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';d.documentElement.setAttribute('data-theme',n);try{localStorage.setItem('ff_theme',n)}catch(e){}});
var m=d.getElementById('menu');if(m)m.addEventListener('click',function(){d.body.classList.toggle('menu')});
d.querySelectorAll('[data-s]').forEach(function(e){var v=FF.db.settings()[e.getAttribute('data-s')];if(v!=null)e.textContent=v});
d.querySelectorAll('[data-link]').forEach(function(e){var k=e.getAttribute('data-link'),s=FF.db.settings(),u=k==='wa'?FF.wa(s.phone1):s[k];if(u)e.href=u;else e.style.display='none'});
});
})(window,document);
