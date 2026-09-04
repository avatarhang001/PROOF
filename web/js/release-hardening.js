/**
 * Final release hardening.
 * Keeps disabled controls visually disabled without falsely implying loading.
 */

const style = document.createElement('style');
style.id = 'proof-release-hardening';
style.textContent = `
  /* Disabled is not the same thing as loading. */
  button.btn-primary:disabled::after,
  button.btn-secondary:disabled::after,
  button.btn-ghost:disabled::after,
  button.btn-soft:disabled::after,
  button.btn-nim:disabled::after,
  button.btn-ok:disabled::after {
    content: none !important;
    animation: none !important;
  }

  /* Only explicit loading controls receive a spinner. */
  button.is-loading {
    position: relative;
    pointer-events: none;
    cursor: wait;
  }

  button.is-loading::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    width: 14px;
    height: 14px;
    margin-top: -7px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: proof-release-spin .6s linear infinite;
    opacity: .65;
  }

  @keyframes proof-release-spin {
    to { transform: rotate(360deg); }
  }
`;

document.head.appendChild(style);

// Defensive final normalizer for the known lesson navigation regression.
// This is intentionally scoped to #next; it does not mutate arbitrary buttons.
const normalizeLessonNext = () => {
  const button = document.getElementById('next');
  if (!button || !button.textContent.includes('<svg')) return;
  const label = button.textContent.replace(/\s*<svg[\\s\\S]*$/i, '').trim() || 'Next';
  button.textContent = label;
};

const observer = new MutationObserver(normalizeLessonNext);
observer.observe(document.body, { subtree: true, childList: true, characterData: true });
window.addEventListener('hashchange', normalizeLessonNext);
