/**
 * Theme — resolves 'light' | 'dark' | 'system' to an actual applied
 * theme and sets it on <html data-theme="...">.
 *
 * The user's actual preference lives server-side in user.prefs.theme
 * (see PATCH /api/me) so it follows them across devices — that's the
 * real source of truth. The localStorage cache here exists only so the
 * correct theme applies instantly on page load, before the network
 * round-trip to fetch the profile completes (avoiding a flash of the
 * wrong theme); it's overwritten the moment server prefs are known.
 */
const CACHE_KEY = 'proof_theme_pref';

export function resolveTheme(mode) {
  if (mode === 'dark' || mode === 'light') return mode;
  return (window.matchMedia?.('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

export function applyTheme(mode = 'system') {
  const resolved = resolveTheme(mode);
  document.documentElement.setAttribute('data-theme', resolved);
  try { localStorage.setItem(CACHE_KEY, mode); } catch { /* storage unavailable — theme still applies for this load */ }
  return resolved;
}

export function cachedThemeMode() {
  try { return localStorage.getItem(CACHE_KEY) || 'system'; } catch { return 'system'; }
}
