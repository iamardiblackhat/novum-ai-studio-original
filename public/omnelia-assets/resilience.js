/* Recovery stays independent of the animation and component bundles. No telemetry is sent. */
(() => {
  'use strict';
  if (window.OmneliaRecovery) return;
  const records = [];
  const seen = new Map();
  let notice;
  let pending;
  const codeOf = value => String(value || 'page-error').toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 64);
  const isAbort = error => error && error.name === 'AbortError';

  function clear(code) {
    const identity = code && codeOf(code);
    if (pending && (!identity || pending.code === identity)) pending = undefined;
    if (notice && (!identity || notice.dataset.recoveryCode === identity)) {
      notice.remove();
      notice = undefined;
    }
  }

  function notify(message, options = {}) {
    const code = codeOf(options.code);
    if (!document.body) { pending = { message, options, code }; return; }
    if (notice?.dataset.recoveryCode === code) return;
    clear();
    notice = document.createElement('aside');
    notice.className = 'recovery-notice';
    notice.dataset.recoveryCode = code;
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    notice.setAttribute('aria-atomic', 'true');
    const copy = document.createElement('p');
    copy.textContent = String(message || 'Some page features could not load. You can reload this page and try again.');
    const actions = document.createElement('div');
    actions.className = 'recovery-notice-actions';
    if (options.reload !== false) {
      const reload = document.createElement('button');
      reload.type = 'button';
      reload.textContent = 'Reload page';
      reload.addEventListener('click', () => window.location.reload());
      actions.append(reload);
    }
    if (options.services !== false) {
      const services = document.createElement('a');
      services.href = '/services/';
      services.textContent = 'Explore services';
      actions.append(services);
    }
    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'recovery-dismiss';
    dismiss.textContent = 'Dismiss';
    dismiss.setAttribute('aria-label', 'Dismiss recovery message');
    dismiss.addEventListener('click', () => clear(code));
    actions.append(dismiss);
    notice.append(copy, actions);
    document.body.append(notice);
  }

  function report(code, error, options = {}) {
    const identity = codeOf(code);
    const now = Date.now();
    // Only a stable category and timestamp are retained: never exception text, URLs or stacks.
    if (!seen.has(identity) || now - seen.get(identity) > 1000) {
      records.push({ code: identity, time: now, kind: isAbort(error) ? 'cancelled' : 'failure' });
      if (records.length > 20) records.shift();
      seen.set(identity, now);
      if (seen.size > 40) seen.delete(seen.keys().next().value);
    }
    if (!options.quiet && (!isAbort(error) || options.quiet === false)) notify(options.message, { ...options, code: identity });
  }

  function imageFailed(image) {
    if (!image || image.dataset.recoveryState === 'unavailable') return;
    // An empty result slot is intentional until a tool produces an image.
    if (!image.currentSrc && !image.getAttribute('src') && !image.getAttribute('srcset')) return;
    const current = image.currentSrc || image.src || '';
    let fallback = image.getAttribute('src') || '';
    const webp = /\.webp(?:[?#]|$)/i.test(current);
    // Only our exact generated responsive paths have a known same-art JPEG sibling.
    if (webp && !/\.(?:jpe?g|png)(?:[?#]|$)/i.test(fallback)) {
      try {
        const asset = new URL(current, window.location.href);
        const generated = asset.pathname.match(/^\/assets\/generated\/([a-z0-9][a-z0-9-]*)-(?:640|1280)\.webp$/i);
        if (asset.origin === window.location.origin && generated) fallback = `/assets/generated/${generated[1]}.${generated[1] === 'mascot-cutout' ? 'png' : 'jpg'}`;
      } catch { /* Invalid or unfamiliar image paths go directly to the neutral placeholder. */ }
    }
    if (webp && image.dataset.recoveryState !== 'retrying' && /\.(?:jpe?g|png)(?:[?#]|$)/i.test(fallback)) {
      image.dataset.recoveryState = 'retrying';
      image.closest('picture')?.querySelectorAll('source').forEach(source => source.remove());
      image.removeAttribute('srcset');
      image.removeAttribute('sizes');
      image.src = fallback;
      report('image-format-fallback', null, { quiet: true });
      return;
    }
    image.dataset.recoveryState = 'unavailable';
    const box = image.getBoundingClientRect();
    const replacement = document.createElement('span');
    replacement.className = `${image.className || ''} media-unavailable`.trim();
    replacement.dataset.imageFallback = 'true';
    replacement.style.maxWidth = '100%';
    if (box.width > 0 && box.height > 0) {
      replacement.style.width = `${box.width}px`;
      replacement.style.height = `${box.height}px`;
      replacement.style.aspectRatio = `${box.width} / ${box.height}`;
    } else {
      replacement.style.aspectRatio = `${Number(image.getAttribute('width')) || 3} / ${Number(image.getAttribute('height')) || 2}`;
      replacement.style.width = '100%';
    }
    const alt = image.getAttribute('alt') || '';
    const decorative = !alt || image.getAttribute('aria-hidden') === 'true' || image.closest('[aria-hidden="true"]');
    if (decorative) replacement.setAttribute('aria-hidden', 'true');
    else {
      replacement.setAttribute('role', 'group');
      replacement.setAttribute('aria-label', 'Unavailable artwork');
    }
    const symbol = document.createElement('span');
    symbol.className = 'media-unavailable-symbol';
    symbol.textContent = '◇';
    if (decorative) symbol.setAttribute('aria-hidden', 'true');
    else { symbol.setAttribute('role', 'img'); symbol.setAttribute('aria-label', `${alt}. Image currently unavailable.`); }
    const label = document.createElement('span');
    label.textContent = 'Artwork unavailable';
    replacement.append(symbol, label);
    if (!decorative) {
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'Retry image';
      retry.addEventListener('click', () => {
        delete image.dataset.recoveryState;
        replacement.replaceWith(image);
        image.src = image.getAttribute('src') || fallback;
      });
      replacement.append(retry);
    }
    image.replaceWith(replacement);
    report('image-unavailable', null, { quiet: true });
  }

  window.OmneliaRecovery = Object.freeze({
    notify, report, clear,
    get diagnostics() { return records.map(record => ({ ...record })); }
  });

  window.addEventListener('error', event => {
    const target = event.target;
    const tag = target?.tagName;
    if (tag === 'IMG') { imageFailed(target); return; }
    if (tag === 'SCRIPT') {
      const optionalMotion = /\/(?:motion|motion-effects)\.js(?:[?#]|$)/.test(target.src || '');
      report(optionalMotion ? 'motion-resource' : 'script-resource', null, {
        message: optionalMotion ? 'Some visual effects could not load. You can keep browsing or reload the page.' : 'Some interactive features could not load. Reload the page, or use the service links to continue.'
      });
      return;
    }
    if (tag === 'LINK' && target.rel === 'stylesheet') {
      report('stylesheet-resource', null, { message: 'Some page styling could not load. Reload this page to try again.' });
      return;
    }
    document.querySelector('.xp-loader')?.remove();
    report('page-script', event.error, { message: 'A page feature ran into a problem. You can reload the page or continue through the service links.' });
    // The native event is not cancelled; browser diagnostics remain available.
  }, true);
  window.addEventListener('unhandledrejection', event => {
    if (isAbort(event.reason)) { report('operation-cancelled', event.reason, { quiet: true }); return; }
    document.querySelector('.xp-loader')?.remove();
    report('page-promise', event.reason, { message: 'A page feature could not finish. Reload the page to try again, or continue browsing.' });
  });
  window.addEventListener('offline', () => notify('You’re offline. Loaded features still work; new pages and the city map may need a connection.', { code: 'offline', reload: false, services: false }));
  window.addEventListener('online', () => clear('offline'));
  document.addEventListener('load', event => {
    if (event.target?.tagName === 'IMG' && event.target.dataset.recoveryState === 'retrying') event.target.dataset.recoveryState = 'recovered';
  }, true);

  function ready() {
    if (pending) { const queued = pending; pending = undefined; notify(queued.message, queued.options); }
    document.querySelectorAll('img').forEach(image => {
      if (image.complete && image.naturalWidth === 0 && (image.currentSrc || image.loading !== 'lazy')) imageFailed(image);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
  setTimeout(() => {
    if (document.querySelector('[data-open-search]') && document.documentElement.dataset.interactiveFeatures !== 'ready') {
      report('components-timeout', null, { message: 'Interactive features are taking longer to load. You can reload this page or follow the service links.' });
    }
  }, 8000);
})();
