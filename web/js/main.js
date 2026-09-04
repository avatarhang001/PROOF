/**
 * PROOF — app shell + hash router.
 */
import { api } from './api.js';
import { app, refreshMe } from './state.js';
import { WalletService } from './wallet.js';
import { esc, $, ico } from './ui.js';
import './release-hardening.js';
import * as onboarding from './views/onboarding.js';
import * as home from './views/home.js';
import * as learn from './views/learn.js';
import * as prove from './views/prove.js';
import * as work from './views/work.js';
import * as profile from './views/profile.js';
import * as reviews from './views/reviews.js';
import * as socratic from './views/socratic.js';
import * as glossary from './views/glossary.js';
import * as misc from './views/misc.js';

const ROUTES = [
  ['onboarding', onboarding.screen, { public: true }],
  ['learn', learn.hub],
  ['learn/path/:id', learn.pathScreen],
  ['learn/lesson/:pathId/:topic', learn.lessonScreen],
  ['reviews', reviews.hub],
  ['reviews/:id', reviews.session],
  ['socratic', socratic.socratic],
  ['glossary', glossary.glossary],
  ['', home.screen],
  ['prove', prove.hub],
  ['prove/challenge/:id', prove.challenge],
  ['daily', misc.daily],
  ['work', work.work],
  ['profile', profile.profile],
  ['leaderboard', profile.leaderboard],
  ['notifications', misc.notifications],
  ['p/:id', misc.publicProfile],
];

const NAV = [
  { hash: '#/', label: 'Home', icon: ico.home },
  { hash: '#/learn', label: 'Learn', icon: ico.book },
  { hash: '#/reviews', label: 'Review', icon: ico.refresh },
  { hash: '#/prove', label: 'Prove', icon: ico.target },
  { hash: '#/work', label: 'Work', icon: ico.briefcase, mobile: false },
  { hash: '#/profile', label: 'You', icon: ico.user },
];

function routeMatch(path) {
  for (const [pattern, fn, meta] of ROUTES) {
    const a = pattern.split('/').filter(Boolean);
    const b = path.split('/').filter(Boolean);
    if (a.length !== b.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < a.length; i++) {
      if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]);
      else if (a[i] !== b[i]) { ok = false; break; }
    }
    if (ok) return { fn, params, meta };
  }
  return null;
}

function currentPath() {
  return location.hash.replace(/^#\/?/, '').split('?')[0];
}

function activeNav(hash) {
  const path = hash.replace(/^#\/?/, '').split('?')[0];
  if (!path) return '#/';
  if (path.startsWith('learn')) return '#/learn';
  if (path.startsWith('reviews')) return '#/reviews';
  if (path.startsWith('prove')) return '#/prove';
  if (path.startsWith('work')) return '#/work';
  if (path.startsWith('profile') || path.startsWith('leaderboard') || path.startsWith('notifications')) return '#/profile';
  return '#/';
}

function renderNav(root) {
  const active = activeNav(location.hash);
  root.innerHTML = NAV.map((n) => `<a href="${n.hash}" class="${active === n.hash ? 'active' : ''}"${n.mobile === false ? ' data-mobile="false"' : ''} aria-label="${esc(n.label)}"><span class="nav-icon">${n.icon}</span><span class="nav-label">${esc(n.label)}</span></a>`).join('');
}

async function boot() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;
  let nav = document.querySelector('.nav');
  if (!nav) {
    nav = document.createElement('nav');
    nav.className = 'nav';
    nav.setAttribute('aria-label', 'Primary navigation');
    document.body.appendChild(nav);
  }
  renderNav(nav);

  const render = async () => {
    renderNav(nav);
    const path = currentPath();
    const match = routeMatch(path);
    const route = match || { fn: onboarding.screen, params: {}, meta: { public: true } };
    const publicRoute = route.meta?.public;
    if (!publicRoute) {
      try { await refreshMe(); } catch (e) { console.warn('refreshMe failed', e); }
    }
    appRoot.className = 'screen';
    try {
      await route.fn(appRoot, route.params);
    } catch (e) {
      console.error(e);
      appRoot.innerHTML = `<div class="pad"><div class="card"><h1 class="h2">Something went wrong</h1><p class="sub mt8">${esc(e?.message || 'Unable to load this screen.')}</p><a class="btn btn-primary mt16" href="#/">Back home</a></div></div>`;
    }
  };

  window.addEventListener('hashchange', render);
  await render();
}

boot();
