/**
 * Onboarding — PROOF entry experience.
 * Architecture notes:
 * - Public hash route rendered by main.js before a user exists.
 * - Starting a path calls /api/onboard, refreshes global state, then uses the
 *   shared generateAndOpenPath() flow so Learn/Onboarding/Home stay consistent.
 * - Wallet UI stays delegated to walletEntry(); views never touch providers.
 */
import { api } from '../api.js';
import { refreshMe, app } from '../state.js';
import { esc, $, toast, ico, setupScrollReveal } from '../ui.js';
import { generateAndOpenPath } from './generate.js';

const CATS = ['Code', 'Design', 'AI', 'Business', 'Marketing', 'DeFi', 'Languages', 'Data Science', 'More'];
const EXTRA_CATS = ['Web Development', 'Python', 'No-code', 'Data Analysis', 'Writing', 'Music'];

const SEARCH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>';
const LEVEL_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18v-4"/><path d="M12 18V8"/><path d="M18 18V5"/><rect x="4.5" y="14" width="3" height="4" rx="1"/><rect x="10.5" y="8" width="3" height="10" rx="1"/><rect x="16.5" y="5" width="3" height="13" rx="1"/></svg>';
const CLOCK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><path d="M12 8v4l2.8 2"/></svg>';
const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>';

const categoryButton = (label) => `<button class="onb-skill" data-cat="${esc(label)}" type="button"><span>${esc(label)}</span>${label === 'More' ? `<i>${CHEVRON}</i>` : ''}</button>`;
const navLink = (href, icon, label) => `<a href="${href}"${label === 'Home' ? ' aria-current="page"' : ''}><span>${icon}</span>${label}</a>`;

export async function screen(root) {
  document.body.classList.add('proof-route-onboarding');
  document.getElementById('app')?.classList.add('proof-route-onboarding');
  root.innerHTML = `
  <main class="proof-onboarding proof-onboarding-v2">
    <header class="onb-top reveal">
      <a class="onb-logo" href="#/onboarding" aria-label="PROOF"><img src="/assets/proof-logo.svg" alt="PROOF" /></a>
      <div class="onb-actions">
        <button class="onb-connect" id="btnConnect" type="button">${ico.wallet}<span>Connect</span></button>
        <button class="onb-icon" id="btnNotifications" aria-label="Notifications" type="button">
          ${ico.bell}
          <span class="onb-notification-count" data-count="${Number(app.unread || 0)}" hidden>${app.unread || ''}</span>
        </button>
      </div>
    </header>

    <div class="onb-layout">
      <section class="onb-copy reveal" aria-labelledby="onbTitle">
        <p class="onb-kicker">LEARN · PRACTICE · PROVE · EARN</p>
        <h1 id="onbTitle">Learn anything.<br/>Prove it.<br/><span>Earn with it.</span></h1>
        <p>Practical challenges that turn skill into verified ability and real NIM.</p>
        <div class="onb-proof-strip" aria-label="PROOF value summary">
          <span>🔥 Daily streaks</span>
          <span>✓ Verified proof</span>
          <span>🪙 NIM rewards</span>
        </div>
      </section>

      <section class="onb-panel reveal" aria-label="Create your first skill path">
        <form id="onboardingForm">
          <label class="onb-label" for="goalInput">What do you want to learn?</label>
          <div class="onb-search">${SEARCH_ICON}<input id="goalInput" placeholder="e.g. Web development, Python, DeFi" autocomplete="off" maxlength="120" /></div>

          <div class="onb-section-head"><b>Popular</b></div>
          <div class="onb-skills" id="skillPicks">${CATS.map(categoryButton).join('')}</div>
          <div class="onb-skills onb-more-skills" id="moreCategories" hidden>${EXTRA_CATS.map(categoryButton).join('')}</div>

          <label class="onb-label onb-label-spaced" for="lvl">Your level</label>
          <div class="onb-select-wrap">${LEVEL_ICON}<select id="lvl"><option value="">New to it</option><option value="beginner">Basics down</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>${CHEVRON}</div>

          <label class="onb-label onb-label-spaced" for="mpd">Time / day</label>
          <div class="onb-select-wrap">${CLOCK_ICON}<select id="mpd"><option value="20">20 min</option><option value="30" selected>30 min</option><option value="45">45 min</option><option value="60">1 hour+</option></select>${CHEVRON}</div>

          <button class="onb-start" id="btnStart" type="submit">Start my skill path <span>${ico.arrow}</span></button>
        </form>
        <div class="onb-meta">Free to start · proofs can earn up to 5 NIM each</div>
      </section>
    </div>

    <nav class="onb-bottom" aria-label="Primary navigation">
      ${navLink('#/', ico.home, 'Home')}${navLink('#/learn', ico.book, 'Learn')}${navLink('#/prove', ico.prove, 'Prove')}${navLink('#/work', ico.work, 'Work')}${navLink('#/profile', ico.profile, 'Profile')}
    </nav>
  </main>`;

  const input = $('#goalInput', root);
  root.querySelectorAll('[data-cat]').forEach((c) => c.addEventListener('click', () => {
    const cat = c.dataset.cat;
    if (cat === 'More') {
      const more = $('#moreCategories', root);
      const open = more.hidden;
      more.hidden = !open;
      c.classList.toggle('is-open', open);
      c.setAttribute('aria-expanded', String(open));
      return;
    }
    input.value = cat === 'Code' ? 'I want to learn web development' : `I want to learn ${cat.toLowerCase()}`;
    input.focus();
  }));

  $('#onboardingForm', root).addEventListener('submit', (e) => { e.preventDefault(); start(); });
  $('#btnNotifications', root).addEventListener('click', () => { location.hash = '#/notifications'; });
  $('#btnConnect', root).addEventListener('click', () => walletEntry(root));
  setupScrollReveal(root);

  async function start() {
    const goal = input.value.trim();
    if (goal.length < 3) { toast('Tell us what you want to learn ✍️', 'bad'); input.focus(); return; }
    const btn = $('#btnStart', root);
    btn.disabled = true;
    btn.classList.add('is-loading');
    try {
      const level = $('#lvl', root).value;
      const minutesPerDay = parseInt($('#mpd', root).value, 10);
      if (!app.me) {
        await api.post('/api/onboard', { goal, level, minutesPerDay });
        await refreshMe();
      } else await api.patch('/api/me', { prefs: { goal, level, minutesPerDay } });
      await generateAndOpenPath({ goal, level, minutesPerDay, anchor: document.getElementById('app') });
    } catch (e) {
      toast(esc(e.message), 'bad');
      btn.disabled = false;
      btn.classList.remove('is-loading');
    }
  }
}

export async function walletEntry(root) {
  const { sheet } = await import('../ui.js'); const { environment, WalletService } = await import('../wallet.js'); const env = environment();
  const payBtn = `<button class="btn ${env.kind === 'nimiqpay' ? 'btn-primary' : 'btn-ghost'} btn-block" id="wNimiq">${ico.wallet} Connect Nimiq Pay</button>`; const hubBtn = `<button class="btn btn-primary btn-block" id="wHub">${ico.link} Connect Nimiq Hub</button>`; const demoBtn = `<button class="btn ${env.kind === 'nimiqpay' ? 'btn-soft' : 'btn-nim'} btn-block" id="wDemo">${ico.flask} Explore with demo wallet</button>`; let options, note;
  if (env.kind === 'nimiqpay') { options = payBtn + demoBtn; note = 'Running inside Nimiq Pay — your keys never leave the wallet. Rewards can be on-chain.'; } else if (env.kind === 'desktop') { options = hubBtn + demoBtn + `<button class="btn btn-ghost btn-block" id="wNimiq" style="opacity:.75">${ico.bolt} Nimiq Pay <span class="tiny">· mobile app only</span></button>`; note = 'Desktop detected → use Nimiq Hub for on-chain rewards, or explore instantly with the demo wallet.'; } else { options = hubBtn + demoBtn + payBtn; note = 'Use Nimiq Hub in this browser, or open PROOF inside Nimiq Pay for native wallet access.'; }
  const s = sheet(`<h2 class="h1">Connect your wallet</h2><p class="sub mt8">Your wallet holds your NIM rewards. Keys never leave it — you approve every action.</p><div class="wallet-options mt16">${options}</div><p class="tiny center mt8 wallet-note">${note}</p>`);
  s.el.querySelector('#wHub')?.addEventListener('click', async e => { const btn = e.currentTarget; btn.disabled = true; btn.classList.add('is-loading'); btn.innerHTML = `${ico.link} Connecting to Nimiq Hub…`; try { await WalletService.connectNimiqHub(); await refreshMe(); s.close(); toast('Nimiq Hub connected ✅ On-chain rewards enabled!', 'ok'); location.hash = '#/'; } catch (err) { btn.disabled = false; btn.classList.remove('is-loading'); btn.innerHTML = `${ico.link} Connect Nimiq Hub`; toast('Nimiq Hub connection failed. Please retry.', 'bad', 5000); } });
  s.el.querySelector('#wNimiq')?.addEventListener('click', async e => { const btn = e.currentTarget; if (env.kind === 'desktop') { toast('Nimiq Pay is mobile-only. On desktop, use Nimiq Hub.', '', 4200); return; } if (!env.inNimiqPay) { toast('Open PROOF inside Nimiq Pay to connect it. Browser users can use Nimiq Hub or demo wallet.', '', 5000); return; } btn.disabled = true; btn.classList.add('is-loading'); btn.innerHTML = `${ico.bolt} Connecting to Nimiq Pay…`; try { await WalletService.connectNimiqPay(); await refreshMe(); s.close(); toast('Nimiq Pay connected ✅ On-chain rewards enabled!', 'ok'); location.hash = '#/'; } catch (err) { btn.disabled = false; btn.classList.remove('is-loading'); btn.innerHTML = `${ico.bolt} Connect Nimiq Pay`; toast('Nimiq Pay connection failed. Please retry.', 'bad', 4500); } });
  s.el.querySelector('#wDemo').addEventListener('click', async e => { const btn = e.currentTarget; btn.disabled = true; btn.classList.add('is-loading'); btn.textContent = 'Creating demo wallet…'; try { await WalletService.connectDemo(); await refreshMe(); s.close(); toast('Demo wallet ready! Full experience with simulated rewards.', 'ok', 3500); location.hash = '#/'; } catch (err) { btn.disabled = false; btn.classList.remove('is-loading'); btn.innerHTML = `${ico.flask} Explore with demo wallet`; toast(err?.message || 'Could not create demo wallet. Please try again.', 'bad', 4000); } });
}
