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
