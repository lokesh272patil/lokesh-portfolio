// Minimal gesture + tilt + cursor controller for slides
(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = document.querySelector('.dots');
  const cursor = document.getElementById('custom-cursor');
  let index = 0;
  let startY = 0;
  let isTouch = false;

  function buildDots() {
    slides.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.dataset.i = i;
      btn.addEventListener('click', () => goTo(i));
      dots.appendChild(btn);
    });
    updateDots();
  }

  function updateDots() {
    Array.from(dots.children).forEach((b, i) => b.classList.toggle('active', i === index));
  }

  function showSlide(i) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    updateDots();
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function goTo(i) {
    index = clamp(i, 0, slides.length - 1);
    showSlide(index);
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  // touch gestures
  function onTouchStart(e) {
    isTouch = true;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
  }
  function onTouchEnd(e) {
    if (!isTouch) return;
    const endY = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY);
    const dy = endY - startY;
    if (dy < -40) next();
    if (dy > 40) prev();
    isTouch = false;
  }

  // keyboard
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') next();
    if (e.key === 'ArrowUp' || e.key === 'PageUp') prev();
  });

  // tilt effect for cards
  function attachTilt() {
    const tilts = document.querySelectorAll('.tilt');
    tilts.forEach(el => {
      el.addEventListener('pointermove', (ev) => {
        const r = el.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width;
        const py = (ev.clientY - r.top) / r.height;
        const rotY = (px - 0.5) * 12;
        const rotX = (0.5 - py) * 8;
        el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
      el.addEventListener('click', () => {
        const link = el.dataset.link;
        if (link) window.open(link, '_blank');
      });
    });
  }

  // custom cursor
  function attachCursor() {
    if (!cursor) return;
    document.addEventListener('pointermove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }

  // init touch listeners on main element
  function attachGesture() {
    const el = document.querySelector('.slides');
    el.addEventListener('touchstart', onTouchStart, {passive: true});
    el.addEventListener('touchend', onTouchEnd, {passive: true});
    el.addEventListener('pointerdown', onTouchStart);
    el.addEventListener('pointerup', onTouchEnd);
  }

  // initialize
  buildDots();
  attachTilt();
  attachCursor();
  attachGesture();
  showSlide(0);
})();