/**
 * Reference Layout - Injects sidebar and topbar matching screenshot design
 */
import { ico, esc } from './ui.js';

const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: 'home', href: '#/' },
  { key: 'learn', label: 'Learn', icon: 'book', href: '#/learn' },
  { key: 'reviews', label: 'Review', icon: 'clock', href: '#/reviews' },
  { key: 'prove', label: 'Prove', icon: 'prove', href: '#/prove' },
  { key: 'work', label: 'Work', icon: 'work', href: '#/work' },
  { key: 'teach', label: 'Teach', icon: 'users', href: '#/work/teach' },
  { key: 'leaderboard', label: 'Leaderboard', icon: 'trophy', href: '#/leaderboard' },
  { key: 'notifications', label: 'Notifications', icon: 'bell', href: '#/notifications' },
  { key: 'profile', label: 'Profile', icon: 'profile', href: '#/profile' },
  { key: 'glossary', label: 'Glossary', icon: 'book', href: '#/glossary' },
  { key: 'socratic', label: 'Socratic', icon: 'chat', href: '#/socratic' },
  { key: 'settings', label: 'Settings', icon: 'settings', href: '#/settings' },
];

function getActiveKey() {
  const path = location.hash.replace(/^#\/?/, '');
  const segments = path.split('/');
  
  if (segments[0] === 'work' && segments[1] === 'teach') return 'teach';
  return segments[0] || 'home';
}

let layoutInjected = false;

function injectReferenceLayout() {
  if (!window.app?.me || layoutInjected) return;
  if (window.innerWidth < 1024) return; // Only on desktop
  
  const activeKey = getActiveKey();
  const u = window.app.me || {};
  const wallet = u.wallet || {};
  const unread = window.app.unread || 0;
  const isDark = false; // Always use light theme for reference layout to match screenshot
  
  // Remove existing layout elements
  document.getElementById('ref-sidebar')?.remove();
  document.getElementById('ref-topbar')?.remove();
  
  // Create sidebar with LIGHT colors
  const sidebar = document.createElement('div');
  sidebar.id = 'ref-sidebar';
  sidebar.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: 240px;
    height: 100vh;
    background: #FFFFFF;
    border-right: 1px solid #E5E7EB;
    z-index: 1000;
    overflow-y: auto;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
  `;
  
  sidebar.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding: 0 8px;">
      <div style="width: 32px; height: 32px; background: #F59E0B; border-radius: 8px; display: grid; place-items: center; font-size: 18px;">◆</div>
      <span style="font-family: var(--font-headings); font-size: 18px; font-weight: 700; letter-spacing: 0.15em; color: #111827;">PROOF</span>
    </div>
    
    <nav style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
      ${NAV_ITEMS.map(item => `
        <a href="${item.href}" 
           data-nav-key="${item.key}"
           style="
             display: flex;
             align-items: center;
             gap: 12px;
             padding: 10px 12px;
             border-radius: 8px;
             font-size: 14px;
             font-weight: ${item.key === activeKey ? '600' : '500'};
             color: ${item.key === activeKey ? '#6366F1' : '#6B7280'};
             background: ${item.key === activeKey ? '#EEF2FF' : 'transparent'};
             text-decoration: none;
             transition: all 0.15s;
           "
           onmouseover="if('${item.key}' !== '${activeKey}') this.style.background='#F3F4F6'"
           onmouseout="if('${item.key}' !== '${activeKey}') this.style.background='transparent'">
          ${ico[item.icon]}
          <span>${item.label}</span>
          ${item.key === 'notifications' && unread ? `<span style="margin-left: auto; min-width: 20px; height: 20px; padding: 0 6px; background: #F59E0B; color: #fff; border-radius: 10px; font-size: 11px; font-weight: 700; display: grid; place-items: center;">${unread > 9 ? '9+' : unread}</span>` : ''}
        </a>
      `).join('')}
    </nav>
    
    <div style="padding-top: 16px; border-top: 1px solid #F3F4F6;">
      <button id="ref-theme-toggle" 
              style="
                width: 100%;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                border: none;
                border-radius: 8px;
                background: transparent;
                font-size: 14px;
                font-weight: 500;
                color: #6B7280;
                cursor: pointer;
                transition: all 0.15s;
              "
              onmouseover="this.style.background='#F3F4F6'"
              onmouseout="this.style.background='transparent'">
        ${ico.moon}
        <span>Theme</span>
      </button>
    </div>
  `;
  
  // Create topbar with LIGHT colors
  const topbar = document.createElement('div');
  topbar.id = 'ref-topbar';
  topbar.style.cssText = `
    position: fixed;
    left: 240px;
    top: 0;
    right: 0;
    height: 80px;
    background: #FFFFFF;
    border-bottom: 1px solid #E5E7EB;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    gap: 32px;
  `;
  
  const walletLabel = wallet.connected ? (u.walletModeIsDemo ? 'Demo wallet' : 'Connected') : 'Connect wallet';
  
  topbar.innerHTML = `
    <div style="flex: 1; max-width: 600px;">
      <form id="ref-search-form" style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 18px;
        height: 48px;
        background: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 12px;
      ">
        <span style="color: #9CA3AF; display: flex; align-items: center;">${ico.search}</span>
        <input 
          id="ref-search-input"
          type="text" 
          placeholder="Search skills, paths, proofs, or users…" 
          style="
            flex: 1;
            border: none;
            background: transparent;
            outline: none;
            font-size: 14px;
            color: #111827;
          "
        />
        <kbd style="
          padding: 4px 8px;
          background: #F3F4F6;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
        ">Ctrl K</kbd>
      </form>
    </div>
    
    <div style="display: flex; align-items: center; gap: 12px;">
      <a href="#/notifications" style="
        position: relative;
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        background: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 10px;
        color: #374151;
        text-decoration: none;
      ">
        ${ico.bell}
        ${unread ? `<span style="position: absolute; top: -4px; right: -4px; min-width: 20px; height: 20px; padding: 0 6px; display: grid; place-items: center; background: #F59E0B; color: #fff; border: 2px solid #F3F4F6; border-radius: 10px; font-size: 11px; font-weight: 700;">${unread > 9 ? '9+' : unread}</span>` : ''}
      </a>
      
      <button id="ref-wallet-btn" style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 18px;
        height: 44px;
        background: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #1F2937;
        cursor: pointer;
      ">
        ${ico.wallet}
        <span>${esc(walletLabel)}</span>
      </button>
      
      <a href="#/profile" style="
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #FEF3C7, #FCD34D);
        border: 2px solid #FBBF24;
        border-radius: 10px;
        text-decoration: none;
        font-size: 20px;
      ">${esc(String(u.avatar || '👤'))}</a>
    </div>
  `;
  
  // Inject into DOM
  document.body.appendChild(sidebar);
  document.body.appendChild(topbar);
  
  // Add event listeners
  document.getElementById('ref-theme-toggle')?.addEventListener('click', () => {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    injectReferenceLayout(); // Re-render with new theme
  });
  
  document.getElementById('ref-wallet-btn')?.addEventListener('click', () => {
    if (wallet.connected) {
      location.hash = '#/profile';
    } else {
      // Trigger wallet connection
      import('./wallet-entry.js').then(({ walletEntry }) => {
        walletEntry(document.getElementById('app'));
      });
    }
  });
  
  // Search keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('ref-search-input')?.focus();
    }
  });
  
  layoutInjected = true;
}

// Update active nav on route change
window.addEventListener('hashchange', () => {
  if (!layoutInjected) return;
  const activeKey = getActiveKey();
  document.querySelectorAll('[data-nav-key]').forEach(el => {
    const key = el.dataset.navKey;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const isActive = key === activeKey;
    el.style.fontWeight = isActive ? '600' : '500';
    el.style.color = isActive ? '#6366F1' : (isDark ? 'rgba(251,248,237,0.7)' : '#6B7280');
    el.style.background = isActive ? (isDark ? 'rgba(99,102,241,0.15)' : '#EEF2FF') : 'transparent';
  });
});


// Export the function
export { injectReferenceLayout };
