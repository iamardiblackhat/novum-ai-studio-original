const root = document.documentElement;
root.classList.remove('no-js');
root.classList.add('js-ready');

// Compact mobile navigation.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
const menuLabels = {mk:['Отвори навигација','Затвори навигација'],sq:['Hap navigimin','Mbyll navigimin']}[root.lang] || ['Open navigation','Close navigation'];

const menuBackground = new Map();
function lockMenuBackground() {
  for (const element of document.body.children) {
    if (element.contains(menuButton) || element.contains(navigation) || element.matches('script,style,link')) continue;
    if (!menuBackground.has(element)) menuBackground.set(element, element.hasAttribute('inert'));
    element.setAttribute('inert', '');
  }
}
function unlockMenuBackground() {
  for (const [element, wasInert] of menuBackground) if (!wasInert) element.removeAttribute('inert');
  menuBackground.clear();
}
function closeMenu({ returnFocus = false } = {}) {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', menuLabels[0]);
  navigation?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  unlockMenuBackground();
  if (returnFocus) menuButton?.focus();
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? menuLabels[1] : menuLabels[0]);
  navigation?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  if (open) {
    lockMenuBackground();
    // Focus after the visible state is applied; opening animation must not hide the link.
    requestAnimationFrame(() => {
      if (menuButton.getAttribute('aria-expanded') === 'true' && document.activeElement === menuButton) navigation?.querySelector('a[href]')?.focus({ preventScroll: true });
    });
  } else unlockMenuBackground();
});

// Keep keyboard focus inside the open overlay and its close button.
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab' || menuButton?.getAttribute('aria-expanded') !== 'true') return;
  const items = [menuButton, ...navigation.querySelectorAll('a[href]:not([tabindex="-1"])')];
  const index = items.indexOf(document.activeElement);
  const next = index < 0 ? (event.shiftKey ? items.length - 1 : 1) : (index + (event.shiftKey ? -1 : 1) + items.length) % items.length;
  event.preventDefault();
  items[next]?.focus({ preventScroll: true });
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu({ returnFocus: true });
});

// Service lab: real tabs pair useful copy with a matching interface visualization.
const serviceTabs = [...document.querySelectorAll('.service-tab')];
const servicePanels = [...document.querySelectorAll('.service-panel')];

function selectService(index, moveFocus = false) {
  if (!serviceTabs.length || !servicePanels.length) return;
  const safeIndex = (index + serviceTabs.length) % serviceTabs.length;
  serviceTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === safeIndex;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  servicePanels.forEach((panel, panelIndex) => {
    const active = panelIndex === safeIndex;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
    panel.setAttribute('aria-hidden', String(!active));
  });
  if (moveFocus) serviceTabs[safeIndex].focus();
}

serviceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectService(index));
  tab.addEventListener('keydown', (event) => {
    let next = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index + 1;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = serviceTabs.length - 1;
    if (next !== null) {
      event.preventDefault();
      selectService(next, true);
    }
  });
});
if (serviceTabs.length) selectService(Math.max(0, serviceTabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true')));

// ARDI character carousel: manual controls always work; motion pauses on focus/hover and for reduced motion.
const carousel = document.querySelector('#ardi-carousel');
const slides = carousel ? [...carousel.querySelectorAll('.persona-slide')] : [];
const selectors = carousel ? [...carousel.querySelectorAll('[data-carousel-to]')] : [];
const previousButton = carousel?.querySelector('[data-carousel-prev]');
const nextButton = carousel?.querySelector('[data-carousel-next]');
const pauseButton = carousel?.querySelector('[data-carousel-pause]');
const progressBar = carousel?.querySelector('.carousel-progress span');
const liveStatus = carousel?.querySelector('[data-carousel-status]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const rotationDuration = 9000;
let activeSlide = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
let rotationTimer = 0;
let announceTimer = 0;
let pointerInsideCarousel = false;
let focusInsideCarousel = false;
let rotationPausedByUser = reducedMotion.matches;
let touchStartX = null;

function shouldRotate() {
  return slides.length > 1 && !reducedMotion.matches && !rotationPausedByUser && !pointerInsideCarousel && !focusInsideCarousel && !document.hidden;
}

function updatePauseButton() {
  if (!pauseButton) return;
  if (reducedMotion.matches) {
    rotationPausedByUser = true;
    pauseButton.disabled = true;
    pauseButton.textContent = 'Motion reduced';
    pauseButton.setAttribute('aria-pressed', 'true');
    pauseButton.setAttribute('aria-label', 'Automatic carousel rotation is disabled by your reduced-motion setting');
    return;
  }
  pauseButton.disabled = false;
  pauseButton.setAttribute('aria-pressed', String(rotationPausedByUser));
  pauseButton.textContent = rotationPausedByUser ? 'Play rotation' : 'Pause rotation';
  pauseButton.setAttribute('aria-label', rotationPausedByUser ? 'Play carousel rotation' : 'Pause carousel rotation');
}

function resetRotation() {
  window.clearTimeout(rotationTimer);
  if (progressBar) {
    progressBar.classList.remove('is-running');
    progressBar.style.animationDuration = `${rotationDuration}ms`;
    progressBar.style.transform = 'scaleX(0)';
    void progressBar.offsetWidth;
    progressBar.style.transform = '';
    if (shouldRotate()) progressBar.classList.add('is-running');
  }
  if (shouldRotate()) {
    rotationTimer = window.setTimeout(() => showSlide(activeSlide + 1, false), rotationDuration);
  }
}

function showSlide(index, announce = true) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === activeSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
    slide.hidden = !active;
    slide.id ||= `ardi-slide-${slideIndex + 1}`;
    const selector = selectors[slideIndex];
    if (selector) {
      selector.id ||= `ardi-selector-${slideIndex + 1}`;
      selector.setAttribute('aria-controls', slide.id);
      selector.setAttribute('aria-selected', String(active));
      selector.tabIndex = active ? 0 : -1;
      slide.setAttribute('role', 'tabpanel');
      slide.setAttribute('aria-labelledby', selector.id);
    }
  });
  if (liveStatus) {
    liveStatus.setAttribute('aria-live', announce ? 'polite' : 'off');
    const name = slides[activeSlide].getAttribute('aria-label')?.split(': ').at(-1) || 'ARDI character';
    liveStatus.textContent = `${name}, character ${activeSlide + 1} of ${slides.length}.`;
    window.clearTimeout(announceTimer);
    if (announce) announceTimer = window.setTimeout(() => liveStatus.setAttribute('aria-live', 'off'), 1300);
  }
  resetRotation();
}

selectors.forEach((button, index) => {
  button.addEventListener('click', () => showSlide(index));
  button.addEventListener('keydown', (event) => {
    let next = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index + 1;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = selectors.length - 1;
    if (next !== null) {
      event.preventDefault();
      const target = (next + selectors.length) % selectors.length;
      showSlide(target);
      selectors[target].focus();
    }
  });
});
previousButton?.addEventListener('click', () => showSlide(activeSlide - 1));
nextButton?.addEventListener('click', () => showSlide(activeSlide + 1));
pauseButton?.addEventListener('click', () => {
  rotationPausedByUser = !rotationPausedByUser;
  updatePauseButton();
  resetRotation();
});

carousel?.addEventListener('mouseenter', () => {
  pointerInsideCarousel = true;
  resetRotation();
});
carousel?.addEventListener('mouseleave', () => {
  pointerInsideCarousel = false;
  resetRotation();
});
carousel?.addEventListener('focusin', () => {
  focusInsideCarousel = true;
  resetRotation();
});
carousel?.addEventListener('focusout', (event) => {
  if (!carousel.contains(event.relatedTarget)) {
    focusInsideCarousel = false;
    resetRotation();
  }
});
carousel?.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') touchStartX = event.clientX;
});
carousel?.addEventListener('pointerup', (event) => {
  if (touchStartX === null) return;
  const distance = event.clientX - touchStartX;
  touchStartX = null;
  if (Math.abs(distance) > 62) showSlide(activeSlide + (distance < 0 ? 1 : -1));
});
document.addEventListener('visibilitychange', resetRotation);
reducedMotion.addEventListener?.('change', (event) => {
  if (event.matches) rotationPausedByUser = true;
  updatePauseButton();
  resetRotation();
});
updatePauseButton();
if (slides.length) showSlide(activeSlide, false);

// Lightweight signal mesh: hairline links and pixel traces, limited to the hero and paused off-screen.
const canvas = document.querySelector('.signal-field');
const hero = document.querySelector('.hero');
const context = canvas?.getContext('2d', { alpha: true });
if (canvas && hero && context) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let points = [];
  let frame = 0;
  let inView = false;
  let pointer = { x: -1000, y: -1000 };
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);

  function resizeField() {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const count = Math.max(24, Math.min(68, Math.round(width / 18)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .22,
      vy: (Math.random() - .5) * .16,
      phase: Math.random() * Math.PI * 2
    }));
    if (reduced.matches) drawField(0, false);
    else startField();
  }

  function drawField(time, animate = true) {
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      if (animate) {
        point.x += point.vx;
        point.y += point.vy;
        point.phase += .008;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
      }
      for (let j = i + 1; j < points.length; j += 1) {
        const other = points[j];
        const dx = point.x - other.x;
        const dy = point.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 148) {
          const alpha = (1 - distance / 148) * .13;
          context.strokeStyle = `rgba(116, 191, 222, ${alpha})`;
          context.lineWidth = .65;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }
      const signal = .26 + Math.sin(point.phase + time * .0004) * .17;
      context.fillStyle = `rgba(161, 194, 242, ${signal})`;
      context.fillRect(point.x, point.y, 1.2, 1.2);
      const cursorDistance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
      if (cursorDistance < 180) {
        context.strokeStyle = `rgba(163, 139, 244, ${(1 - cursorDistance / 180) * .27})`;
        context.lineWidth = .75;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(pointer.x, pointer.y);
        context.stroke();
      }
    }
  }

  function animateField(time) {
    if (!inView || document.hidden || reduced.matches) { frame = 0; return; }
    drawField(time, true);
    frame = window.requestAnimationFrame(animateField);
  }

  function startField() {
    if (!inView || document.hidden || reduced.matches || frame) return;
    frame = window.requestAnimationFrame(animateField);
  }

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer = { x: -1000, y: -1000 }; }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { window.cancelAnimationFrame(frame); frame = 0; }
    else startField();
  });
  reduced.addEventListener?.('change', () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    if (reduced.matches) drawField(0, false);
    else startField();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) startField();
      else { window.cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: 0.01 }).observe(hero);
  } else {
    inView = true;
    startField();
  }
  new ResizeObserver(resizeField).observe(hero);
  resizeField();
}
