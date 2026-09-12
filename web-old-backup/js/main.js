/**
 * PROOF — app shell + hash router.
 */
import { api } from './api.js';
import { app, refreshMe } from './state.js';
import { WalletService } from './wallet.js';
import { esc, $, ico } from './ui.js';
import { applyTheme, cachedThemeMode } from './theme.js';
import { setLanguage, cachedLanguage, detectBrowserLanguage, t } from './i18n.js';
import { injectReferenceLayout } from './reference-layout.js';
import './release-hardening.js';
import * as onboarding from './views/onboarding-mobile-ref.js';
import * as home from './views/home.js';
import * as learn from './views/learn.js';
import * as prove from './views/prove.js';
import * as work from './views/work.js';
import * as profile from './views/profile.js';
import * as reviews from './views/reviews.js';
import * as socratic from './views/socratic.js';
import * as glossary from './views/glossary.js';
import * as misc from './views/misc.js';
import * as settings from './views/settings.js';

const ROUTES = [
  ['onboarding', onboarding.screen, { public: true }],
  ['learn', learn.hub], ['learn/path/:id', learn.pathScreen], ['learn/lesson/:pathId/:topic', learn.lessonScreen],
  ['learn/document', learn.documentUploadScreen],
  ['reviews', reviews.hub], ['reviews/:id', reviews.session], ['socratic', socratic.socratic], ['glossary', glossary.glossary],
  ['', home.screen], ['prove', prove.hub], ['prove/challenge/:id', prove.challengeScreen], ['prove/attempt/:id', prove.attemptScreen],
  ['daily', (screen) => prove.challengeScreen(screen, { id: 'daily' })], ['work', work.hub], ['work/:tab', work.hub],
  ['profile', profile.screen], ['leaderboard', misc.leaderboardScreen], ['notifications', misc.notificationsScreen], ['u/:username', misc.publicProfileScreen, { public: true }],
  ['settings', settings.screen],
];

const NAV = [
  { key: 'home', href: '#/', ico: 'home', i18n: 'nav_home', match: ['', 'onboarding'], mobile: true },
  { key: 'learn', href: '#/learn', ico: 'learn', i18n: 'nav_learn', match: ['learn'], mobile: true },
  { key: 'reviews', href: '#/reviews', ico: 'clock', i18n: 'nav_review', match: ['reviews'], mobile: false },
  { key: 'prove', href: '#/prove', ico: 'prove', i18n: 'nav_prove', match: ['prove', 'daily'], mobile: true },
  { key: 'work', href: '#/work', ico: 'work', i18n: 'nav_work', match: ['work'], mobile: true },
  { key: 'teach', href: '#/work/teach', ico: 'users', i18n: 'nav_teach', match: ['work'], tab: 'teach', mobile: false },
  { key: 'leaderboard', href: '#/leaderboard', ico: 'trophy', i18n: 'nav_leaderboard', match: ['leaderboard'], mobile: false },
  { key: 'notifications', href: '#/notifications', ico: 'bell', i18n: 'nav_notifications', match: ['notifications'], mobile: false },
  { key: 'profile', href: '#/profile', ico: 'profile', i18n: 'nav_profile', match: ['profile'], mobile: true },
  { key: 'glossary', href: '#/glossary', ico: 'book', i18n: 'nav_glossary', match: ['glossary'], mobile: false },
  { key: 'socratic', href: '#/socratic', ico: 'chat', i18n: 'nav_socratic', match: ['socratic'], mobile: false },
  { key: 'settings', href: '#/settings', ico: 'settings', i18n: 'nav_settings', match: ['settings'], mobile: false },
];

const appEl = () => document.getElementById('app');
let navRendered = false;
let reviewsDueCount = 0;
let notificationsUnreadCount = 0;

async function updateReviewsCount() {
  if (!app.me) return;
  try {
    const res = await api.get('/api/reviews/stats');
    reviewsDueCount = res.stats.dueToday || 0;
    notificationsUnreadCount = Number(app.me.unread || 0);
    updateNavBadge();
  } catch (e) { /* non-critical */ }
}

function updateNavBadge() {
  const nav = document.getElementById('bottomNav');
  if (!nav) return;
  const reviewLink = nav.querySelector('a[href="#/reviews"]');
  if (!reviewLink) return;
  let badge = reviewLink.querySelector('.nav-badge');
  if (reviewsDueCount > 0) {
    if (!badge) { badge = document.createElement('span'); badge.className = 'nav-badge'; reviewLink.appendChild(badge); }
    badge.textContent = reviewsDueCount > 9 ? '9+' : reviewsDueCount;
  } else if (badge) badge.remove();
}

function renderNav(activeKey, activeTab) {
  if (!navRendered) {
    const nav = document.createElement('nav');
    nav.className = 'nav';
    nav.id = 'bottomNav';
    nav.setAttribute('aria-label', 'Primary navigation');
    nav.innerHTML = NAV.map((n) =>
      `<a href="${n.href}" data-key="${n.key}" data-mobile="${n.mobile}" aria-label="${esc(t(n.i18n))}"><span class="nav-ico" data-ico="${n.ico}"></span><span class="nav-label">${esc(t(n.i18n))}</span></a>`
    ).join('');
    appEl().after(nav);
    navRendered = true;
    updateReviewsCount();
    setInterval(updateReviewsCount, 300000);
  }
  const nav = document.getElementById('bottomNav');
  nav.querySelectorAll('a').forEach((a) => {
    const item = NAV.find((n) => n.key === a.dataset.key);
    // Items with a `tab` (e.g. Teach, under /work/teach) only light up on
    // that exact tab; the plain Work entry lights up for every OTHER tab
    // under /work (find-work, sponsored, the bare route) so the two never
    // both appear active at once despite sharing the same route segment.
    const tabMatches = item.tab ? item.tab === activeTab : activeTab !== 'teach';
    a.classList.toggle('active', item.match.includes(activeKey) && tabMatches);
    const span = a.querySelector('.nav-ico');
    if (span && !span.dataset.done) { span.innerHTML = ico[item.ico]; span.dataset.done = '1'; }
  });
  updateNavBadge();
}

/** Re-applies nav label text after a live language change (settings.js calls this). */
export function relabelNav() {
  const nav = document.getElementById('bottomNav');
  if (!nav) return;
  nav.querySelectorAll('a').forEach((a) => {
    const item = NAV.find((n) => n.key === a.dataset.key);
    if (!item) return;
    const label = t(item.i18n);
    a.setAttribute('aria-label', label);
    const labelEl = a.querySelector('.nav-label');
    if (labelEl) labelEl.textContent = label;
  });
}

function parseHash() { const raw = location.hash.replace(/^#\/?/, ''); return raw.split('?')[0]; }

async function router() {
  const path = parseHash(); const segs = path.split('/').filter(Boolean);
  for (const [pattern, view, opts = {}] of ROUTES) {
    const pp = pattern.split('/').filter(Boolean); if (pp.length !== segs.length) continue;
    const params = {}; let ok = true;
    for (let i = 0; i < pp.length; i++) { if (pp[i].startsWith(':')) params[pp[i].slice(1)] = decodeURIComponent(segs[i]); else if (pp[i] !== segs[i]) { ok = false; break; } }
    if (!ok) continue;
    if (!opts.public && !app.me) { location.hash = '#/onboarding'; return; }
    const activeKey = pp[0] || '';
    const activeTab = params.tab || null;
    if (!opts.public) {
      renderNav(activeKey, activeTab);
      injectReferenceLayout(); // Inject sidebar and topbar for all authenticated pages
    } else {
      document.getElementById('bottomNav')?.remove();
      document.getElementById('ref-sidebar')?.remove();
      document.getElementById('ref-topbar')?.remove();
      navRendered = false;
    }
    const routeClasses = ['home', 'onboarding', 'learn', 'reviews', 'prove', 'profile', 'work', 'leaderboard', 'notifications', 'glossary', 'socratic', 'settings'];
    routeClasses.forEach((name) => { document.body.classList.remove(`proof-route-${name}`); appEl().classList.remove(`proof-route-${name}`); });
    const routeClass = activeKey === '' ? 'home' : activeKey === 'reviews' ? 'reviews' : activeKey;
    document.body.classList.add(`proof-route-${routeClass}`);
    appEl().classList.add(`proof-route-${routeClass}`);
    const screen = document.createElement('div');
    screen.id = 'main-content';
    screen.className = `screen${pp.length === 1 ? ' proof-hub-screen' : ''}`;
    screen.innerHTML = `<div class="pad" style="padding-top:max(16px, env(safe-area-inset-top))"><div class="skeleton" style="height:120px;border-radius:20px"></div><div class="skeleton mt12" style="height:84px;border-radius:16px"></div><div class="skeleton mt12" style="height:84px;border-radius:16px"></div></div>`;
    appEl().replaceChildren(screen);
    
    // Ensure skip link exists
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
    try { await view(screen, params); }
    catch (e) { screen.innerHTML = `<div class="pad" style="padding-top:60px;text-align:center"><div style="font-size:40px">🌧️</div><h2 class="h1 mt8">Something hiccuped</h2><p class="sub mt8">${esc(e.message || 'Please try again.')}</p><button class="btn btn-soft mt16" onclick="location.reload()">Reload</button></div>`; }
    
    window.scrollTo({ top: 0 }); return;
  }
  location.hash = '#/';
}

window.addEventListener('hashchange', router);
window.addEventListener('proof:language-changed', relabelNav);
applyTheme(cachedThemeMode());
setLanguage(cachedLanguage() || detectBrowserLanguage());
(async function boot() {
  WalletService.restore();
  const me = await refreshMe();
  if (me?.user?.prefs) {
    applyTheme(me.user.prefs.theme || 'system');
    setLanguage(me.user.prefs.language || cachedLanguage() || detectBrowserLanguage());
  }
  if (!me) location.hash = location.hash.startsWith('#/u/') ? location.hash : '#/onboarding';
  app.booted = true; router();
})();
export { api, app };