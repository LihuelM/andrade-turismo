/* =========================================================
   Andrade Turismo — sitio · JavaScript
   ---------------------------------------------------------
   El slider del hero es 100% CSS (@keyframes andradeSlide):
   un loop infinito hacia la izquierda con un clon de la 1ª
   foto al final, para que el reinicio sea invisible y nunca
   "rebobine" hacia la derecha.
   Este script solo sincroniza los puntos de paginación con
   esa línea de tiempo (21s en total ÷ 3 fotos = 7s por foto).
   ========================================================= */
(function () {
  'use strict';

  var SLIDE_MS = 7000;   // duración visible de cada foto
  var SLIDES = 3;        // fotos reales (sin contar el clon)

  var dotsWrap = document.getElementById('heroDots');
  if (!dotsWrap) return;

  var dots = dotsWrap.querySelectorAll('.dot');

  // Respeta a quien prefiere menos movimiento: deja la 1ª activa y sale.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var start = performance.now();
  var current = -1;

  function tick(now) {
    var elapsed = now - start;
    var active = Math.floor(elapsed / SLIDE_MS) % SLIDES;
    if (active !== current) {
      current = active;
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('dot--active', i === active);
      }
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

(function(){
  var section = document.getElementById('experience');
  if(!section) return;
  var bg = section.querySelector('.experience__bg');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) return;

  var ticking = false;
  function update(){
    var rect = section.getBoundingClientRect();
    var vh = window.innerHeight;
    var progress = (rect.top - vh) / (rect.height + vh) * -1;
    var speed = parseFloat(bg.dataset.parallax) || 0.25;
    var offset = (progress - 0.5) * rect.height * speed;
    bg.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    ticking = false;
  }
  function onScroll(){
    if(!ticking){ window.requestAnimationFrame(update); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  update();
})();
