/**
 * Settings — appearance (theme), language, and account actions.
 */
import { api } from '../api.js';
import { app, refreshMe } from '../state.js';
import { WalletService } from '../wallet.js';
import { esc, ico, toast, walletStatusBadge } from '../ui.js';
import { applyTheme } from '../theme.js';
import { setLanguage, t, LANGUAGES } from '../i18n.js';

export async function screen(root) {
  const prefs = app.me?.prefs || {};
  const theme = prefs.theme || 'system';
  const language = prefs.language || 'en';

  const THEME_CHOICES = [
    ['light', '☀️', t('settings_theme_light')],
    ['dark', '🌙', t('settings_theme_dark')],
    ['system', '💻', t('settings_theme_system')],
  ];

  root.innerHTML = `<div class="pad bento-read" style="padding-top:max(14px, env(safe-area-inset-top))">
    <div class="row-between">
      <h1 class="h1">${t('settings_title')}</h1>
      <div id="walletStatusPlaceholder"></div>
    </div>

    <div class="card mt16">
      <b class="tiny" style="text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">${t('settings_appearance')}</b>
      <div class="row-between mt12" style="flex-wrap:wrap;gap:10px">
        <span>${esc(t('settings_theme'))}</span>
        <div class="row" style="gap:8px" id="themeChips">
          ${THEME_CHOICES.map(([id, emoji, label]) => `<button type="button" class="chip ${id === theme ? 'chip-primary' : ''}" data-theme-choice="${id}">${emoji} ${esc(label)}</button>`).join('')}
        </div>
      </div>
      <div class="row-between mt16" style="flex-wrap:wrap;gap:10px">
        <span>${esc(t('settings_language'))}</span>
        <select id="langSelect" class="input" style="width:auto;min-width:150px">
          ${LANGUAGES.map((l) => `<option value="${l.code}" ${l.code === language ? 'selected' : ''}>${esc(l.label)}</option>`).join('')}
        </select>
      </div>
      <p class="tiny mt8" style="color:var(--muted)">${esc(t('settings_language_hint'))}</p>
    </div>

    <div class="card mt16">
      <b class="tiny" style="text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">${esc(t('settings_notifications'))}</b>
      <p class="sub mt8">${esc(t('settings_notifications_hint'))}</p>
      <a href="#/notifications" class="btn btn-soft btn-sm mt8">${ico.bell} ${esc(t('nav_notifications'))}</a>
    </div>

    <div class="card mt16">
      <b class="tiny" style="text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">${esc(t('settings_account'))}</b>
      <button class="btn btn-ghost btn-sm mt12" id="logout">${esc(t('settings_signout'))}</button>
    </div>
  </div>`;

  const walletStatusEl = root.querySelector('#walletStatusPlaceholder');
  if (walletStatusEl) walletStatusEl.innerHTML = walletStatusBadge(app.me?.wallet?.mode, app.me?.walletModeIsDemo);

  root.querySelectorAll('#themeChips [data-theme-choice]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const choice = btn.dataset.themeChoice;
      applyTheme(choice); // instant feedback
      root.querySelectorAll('#themeChips .chip').forEach((c) => c.classList.toggle('chip-primary', c === btn));
      try {
        await api.patch('/api/me', { prefs: { theme: choice } });
        await refreshMe();
      } catch {
        toast("Couldn't save that — try again.", 'bad');
      }
    });
  });

  root.querySelector('#langSelect').addEventListener('change', async (e) => {
    const code = e.target.value;
    setLanguage(code); // instant feedback
    window.dispatchEvent(new CustomEvent('proof:language-changed'));
    try {
      await api.patch('/api/me', { prefs: { language: code } });
      await refreshMe();
    } catch {
      toast("Couldn't save that — try again.", 'bad');
    }
    screen(root); // re-render this screen's own text in the new language
  });

  root.querySelector('#logout').addEventListener('click', async () => {
    await api.post('/api/auth/logout');
    WalletService.disconnect();
    location.hash = '#/onboarding';
    setTimeout(() => location.reload(), 60);
  });
}
