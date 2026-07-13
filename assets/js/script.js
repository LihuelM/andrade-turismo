/* =========================================================
   Slider del hero
   - Avance automático cada 5 segundos
   - Navegación manual mediante los puntos
   - Sincroniza la tarjeta y el fondo desenfocado
   ========================================================= */
(function () {
  'use strict';

  var SLIDE_MS = 5000;
  var TRANSITION_MS = 900;
  var SLIDES = 3;

  var dotsWrap = document.getElementById('heroDots');
  var cardTrack = document.querySelector('.hero__card-track');
  var backdropTrack = document.querySelector('.hero__backdrop-track');

  if (!dotsWrap || !cardTrack || !backdropTrack) return;

  var dots = Array.prototype.slice.call(
    dotsWrap.querySelectorAll('.dot')
  );

  var tracks = [cardTrack, backdropTrack];

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var current = 0;
  var autoplayTimer = null;
  var cloneResetTimer = null;
  var movingToClone = false;

  /*
   * Desactiva la animación CSS original para que el slider
   * pase a ser controlado completamente por JavaScript.
   */
  tracks.forEach(function (track) {
    track.style.animation = 'none';
    track.style.transition = reduceMotion
      ? 'none'
      : 'transform ' + TRANSITION_MS + 'ms cubic-bezier(.6, 0, .2, 1)';
  });

  /*
   * Convierte los puntos actuales en controles accesibles,
   * sin necesidad de modificar el HTML.
   */
  dots.forEach(function (dot, index) {
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', 'Mostrar imagem ' + (index + 1));
    dot.style.cursor = 'pointer';
  });

  function updateDots(index) {
    dots.forEach(function (dot, dotIndex) {
      var isActive = dotIndex === index;

      dot.classList.toggle('dot--active', isActive);

      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  function setTransform(index) {
    var offset = index * 25;

    tracks.forEach(function (track) {
      track.style.transform =
        'translate3d(-' + offset + '%, 0, 0)';
    });
  }

  function moveTo(index) {
    tracks.forEach(function (track) {
      track.style.transition = reduceMotion
        ? 'none'
        : 'transform ' + TRANSITION_MS + 'ms cubic-bezier(.6, 0, .2, 1)';
    });

    setTransform(index);
  }

  function snapTo(index) {
    tracks.forEach(function (track) {
      track.style.transition = 'none';
    });

    setTransform(index);

    /*
     * Fuerza al navegador a aplicar el salto instantáneo
     * antes de restaurar la transición.
     */
    cardTrack.offsetHeight;

    tracks.forEach(function (track) {
      track.style.transition = reduceMotion
        ? 'none'
        : 'transform ' + TRANSITION_MS + 'ms cubic-bezier(.6, 0, .2, 1)';
    });
  }

  function stopAutoplay() {
    window.clearTimeout(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();

    if (reduceMotion || document.hidden) return;

    autoplayTimer = window.setTimeout(function () {
      nextSlide();
      startAutoplay();
    }, SLIDE_MS);
  }

  function nextSlide() {
    window.clearTimeout(cloneResetTimer);

    /*
     * Avanza normalmente entre las tres imágenes reales.
     */
    if (current < SLIDES - 1) {
      current += 1;

      updateDots(current);
      moveTo(current);
      return;
    }

    /*
     * Desde la última imagen avanza hasta el clon de la
     * primera para mantener el loop continuo.
     */
    current = 0;
    movingToClone = true;

    updateDots(current);
    moveTo(SLIDES);

    /*
     * Una vez terminada la transición hacia el clon,
     * vuelve a la primera imagen sin animación.
     */
    cloneResetTimer = window.setTimeout(function () {
      snapTo(0);
      movingToClone = false;
    }, TRANSITION_MS + 60);
  }

  function selectSlide(index) {
    if (index < 0 || index >= SLIDES) return;

    window.clearTimeout(cloneResetTimer);

    /*
     * Si se hace clic mientras está terminando el loop,
     * normaliza primero la posición.
     */
    if (movingToClone) {
      snapTo(0);
      movingToClone = false;
    }

    current = index;

    updateDots(current);
    moveTo(current);

    /*
     * Reinicia el tiempo automático después de una
     * selección manual.
     */
    startAutoplay();
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      selectSlide(index);
    });

    dot.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectSlide(index);
      }
    });
  });

  /*
   * Detiene el autoplay cuando la pestaña no está visible
   * y lo reactiva cuando el usuario regresa.
   */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  updateDots(current);
  snapTo(current);
  startAutoplay();
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
