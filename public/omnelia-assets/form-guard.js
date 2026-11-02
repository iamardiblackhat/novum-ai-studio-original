/* Opt-in preparation for future forms. The submission endpoint must validate this field too. */
(() => {
  'use strict';
  const fieldName = 'company_website_confirm';
  const prepared = new WeakSet();
  function prepare(form) {
    if (!(form instanceof HTMLFormElement) || prepared.has(form) || !form.matches('[data-omnelia-form]')) return;
    prepared.add(form);
    if (!form.querySelector(`[name="${fieldName}"]`)) {
      const box = document.createElement('div');
      box.className = 'form-honeypot';
      box.setAttribute('aria-hidden', 'true');
      const label = document.createElement('label');
      label.textContent = 'Leave this field empty';
      const input = document.createElement('input');
      input.type = 'text'; input.name = fieldName; input.autocomplete = 'off'; input.tabIndex = -1;
      input.setAttribute('aria-hidden', 'true'); input.setAttribute('data-form-honeypot', '');
      label.append(input); box.append(label); form.append(box);
    }
    form.addEventListener('submit', event => {
      const traps = [...form.querySelectorAll(`[name="${fieldName}"]`)];
      if (traps.length !== 1 || traps.some(input => input.value !== '')) {
        event.preventDefault(); event.stopImmediatePropagation();
        window.OmneliaRecovery?.notify('We couldn’t submit this form. Refresh the page and try again.', { code: 'form-submission', reload: true });
        form.dispatchEvent(new CustomEvent('omnelia:form-blocked', { bubbles: true }));
      }
    }, true);
  }
  function scan(root) {
    if (root.matches?.('form[data-omnelia-form]')) prepare(root);
    root.querySelectorAll?.('form[data-omnelia-form]').forEach(prepare);
  }
  window.OmneliaForms = Object.freeze({ prepare, fieldName });
  function start() {
    scan(document);
    new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => { if (node.nodeType === 1) scan(node); }))).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
