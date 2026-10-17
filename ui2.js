/* ui2.js — animasi muncul ringan + kartu bersorot (≈0.6 KB) */
(function(){if(!('IntersectionObserver'in window))return;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08});
function scan(){document.querySelectorAll('.card:not(.rv),.tk>div:not(.rv)').forEach(function(n,i){n.classList.add('rv');n.style.transitionDelay=Math.min(i%6,5)*50+'ms';io.observe(n)})}
scan();var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(scan,80)}).observe(document.body,{childList:true,subtree:true})})();
