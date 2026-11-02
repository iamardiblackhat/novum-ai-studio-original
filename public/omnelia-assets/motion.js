// Small native interactions inspired by the selected Framer component patterns.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const headings = document.querySelectorAll('.match-hero h1, .reference-home section h2:not(.match-features h2):not(.match-values h2), .route-hero h1, .route-section-heading h2, .route-band h2, .route-band h3');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  headings.forEach((heading) => {
    // Animate text nodes without changing the heading's accessible name or serif spans.
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let wordIndex = 0;
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part.trim()) { fragment.append(document.createTextNode(part)); return; }
        const span = document.createElement('span');
        span.className = 'motion-word';
        span.textContent = part;
        span.style.setProperty('--word-delay', `${Math.min(wordIndex++, 10) * 65}ms`);
        fragment.append(span);
      });
      node.replaceWith(fragment);
    });
    heading.classList.add('motion-heading');
    revealObserver.observe(heading);
  });
  motionPreference.addEventListener('change', (event) => {
    if (event.matches) {
      headings.forEach((heading) => heading.classList.add('motion-visible'));
      revealObserver.disconnect();
    }
  });
}

const family = document.querySelector('.family-carousel');
if (family && !family.querySelector('[data-ardi-stack]')) {
  const track = family.querySelector('.family-portraits');
  const cards = [...track.children];
  const controls = family.querySelector('.family-controls');
  const previous = family.querySelector('[data-family-prev]');
  const next = family.querySelector('[data-family-next]');
  const position = family.querySelector('[data-family-position]');
  let activeIndex = 0;
  let scrollFrame = 0;
  family.classList.add('is-enhanced');
  controls.hidden = false;
  track.tabIndex = 0;
  track.setAttribute('aria-label', 'ARDI characters. Use left and right arrow keys to browse.');
  cards.forEach((card, index) => {
    card.setAttribute('aria-label', `${card.querySelector('h3').textContent}, ${index + 1} of ${cards.length}. ${card.querySelector('p').textContent}`);
  });
  function update(index) {
    activeIndex = index;
    cards.forEach((card, cardIndex) => card.classList.toggle('is-focused', cardIndex === index));
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
    position.textContent = `${index + 1} of ${cards.length} · ${cards[index].querySelector('h3').textContent}`;
  }
  function go(index) {
    const target = Math.max(0, Math.min(cards.length - 1, index));
    track.scrollTo({ left: cards[target].offsetLeft - cards[0].offsetLeft, behavior: motionPreference.matches ? 'instant' : 'smooth' });
    update(target);
  }
  previous.addEventListener('click', () => go(activeIndex - 1));
  next.addEventListener('click', () => go(activeIndex + 1));
  track.addEventListener('keydown', (event) => {
    const target = { ArrowLeft: activeIndex - 1, ArrowRight: activeIndex + 1, Home: 0, End: cards.length - 1 }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    go(target);
  });
  track.addEventListener('focusin', (event) => {
    const index = cards.indexOf(event.target.closest('a'));
    if (index !== -1) go(index);
  });
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      let nearest = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const currentDistance = Math.abs(card.offsetLeft - cards[0].offsetLeft - track.scrollLeft);
        if (currentDistance < distance) { distance = currentDistance; nearest = index; }
      });
      if (nearest !== activeIndex) update(nearest);
    });
  }, { passive: true });
  update(0);
}

// Give the fixed header a readable surface after leaving the top of the hero.
const motionHeader = document.querySelector('.site-header');
function updateHeaderSurface() { motionHeader?.classList.toggle('is-scrolled', window.scrollY > 40); }
window.addEventListener('scroll', updateHeaderSurface, { passive: true });
updateHeaderSurface();
