/**
 * Home — desktop dashboard matching the mockup design + mobile bento grid.
 * Desktop (>=1024px): sidebar + header + 2/3 + 1/3 grid
 * Mobile: existing bento grid panels
 */
import { api } from '../api.js';
import { app, refreshMe } from '../state.js';
import { esc, $, ico, toast, timeAgo, fmtNim, setupScrollReveal } from '../ui.js';
import { generateAndOpenPath } from './generate.js';
import { walletEntry } from '../wallet-entry.js';
import { renderReferenceHome } from './reference-home.js';

const skillIcon = (name = '') => {
  const n = String(name).toLowerCase();
  if (n.includes('html')) return ico.code;
  if (n.includes('css')) return ico.code;
  if (n.includes('java')) return 'JS';
  if (n.includes('react')) return '⚛';
  if (n.includes('design') || n.includes('ui')) return '▦';
  if (n.includes('data')) return 'Σ';
  if (n.includes('marketing')) return '↗';
  if (n.includes('ai')) return 'AI';
  return '✦';
};

const skillIconBg = (name = '') => {
  const n = String(name).toLowerCase();
  if (n.includes('html') || n.includes('css')) return 'style="background:rgba(249,115,22,.1);color:#f97316"';
  if (n.includes('java') || n.includes('javascript') || n.includes('js')) return 'style="background:rgba(234,179,8,.1);color:#ca8a04"';
  if (n.includes('react')) return 'style="background:rgba(59,130,246,.1);color:#3b82f6"';
  if (n.includes('node')) return 'style="background:rgba(99,102,241,.1);color:#6366f1"';
  if (n.includes('python')) return 'style="background:rgba(34,197,94,.1);color:#22c55e"';
  if (n.includes('design') || n.includes('ui')) return 'style="background:rgba(168,85,247,.1);color:#a855f7"';
  if (n.includes('data')) return 'style="background:rgba(6,182,212,.1);color:#06b6d4"';
  if (n.includes('ai')) return 'style="background:rgba(236,72,153,.1);color:#ec4899"';
  return 'style="background:rgba(148,163,184,.1);color:#94a3b8"';
};

const skillLevel = (score, verified) => {
  if (verified) return { label: 'Verified', class: 'proof-skill-level--verified' };
  if (score >= 80) return { label: 'Master', class: 'proof-skill-level--master' };
  if (score >= 60) return { label: 'Advanced', class: 'proof-skill-level--advanced' };
  if (score > 0) return { label: 'Intermediate', class: 'proof-skill-level--intermediate' };
  return { label: 'Beginner', class: 'proof-skill-level--beginner' };
};

export async function screen(root) {
  document.body.classList.add('proof-route-home');
  document.getElementById('app')?.classList.add('proof-route-home');
  
  // On desktop, render reference home layout
  if (window.innerWidth >= 1024) {
    await renderReferenceHome(root);
    return;
  }
  
  // On mobile, continue with existing bento grid layout
  root.innerHTML = `<main class="proof-home"><div class="proof-ref-skeleton"></div></main>`;
  let d;
  try { d = await api.get('/api/home'); } catch { location.hash = '#/onboarding'; return; }
  let recentAchievements = [];
  try {
    const ACHIEVEMENT_TYPES = new Set(['proof_passed', 'skill_verified', 'badge', 'achievement', 'goal_complete']);
    const { notifications } = await api.get('/api/notifications');
    recentAchievements = (notifications || []).filter((n) => ACHIEVEMENT_TYPES.has(n.type)).slice(0, 3);
  } catch { }

  const u = d.user || {};
  const wallet = u.wallet || {};
  const streak = Number(u.streak?.current || 0);
  const earned = Number(u.earnedNim ?? u.balanceNim ?? 0);
  const balance = Number(u.balanceNim || 0);
  const xp = Number(u.xp || 0);
  const verified = Array.isArray(d.mySkills) ? d.mySkills.filter((s) => s.verified).length : 0;
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = u.username ? String(u.username).replace(/^proofer[-_]?/i, '').split(/[-_\s]/)[0] : 'learner';
  const displayName = firstName && firstName.length <= 18 ? firstName : 'learner';
  const walletLabel = wallet.connected ? (u.walletModeIsDemo ? 'Demo wallet' : 'Wallet connected') : 'Connect wallet';

  root.innerHTML = `
  <main class="proof-home">
    <!-- Desktop Sidebar + Main Layout -->
    <div class="proof-desktop-layout">
      <!-- Sidebar -->
      <aside class="proof-sidebar" aria-label="Main navigation">
        <div class="proof-sidebar-brand">
          <div class="proof-sidebar-logo">${ico.hexagon}</div>
          <span class="proof-sidebar-title">PROOF</span>
        </div>
        <nav class="proof-sidebar-nav" role="navigation">
          <div class="proof-sidebar-section">
            <span class="proof-sidebar-section-title">Learning</span>
            <a href="#/" class="proof-nav-item active" data-route="home">
              ${ico.home}<span>Dashboard</span>
            </a>
            <a href="#/learn" class="proof-nav-item" data-route="learn">
              ${ico.book}<span>My Courses</span>
            </a>
            <a href="#/prove" class="proof-nav-item" data-route="prove">
              ${ico.prove}<span>Challenges</span>
            </a>
            <a href="#/profile" class="proof-nav-item" data-route="profile">
              ${ico.trophy}<span>Certifications</span>
            </a>
          </div>
          <div class="proof-sidebar-section">
            <span class="proof-sidebar-section-title">Community</span>
            <a href="#/leaderboard" class="proof-nav-item" data-route="leaderboard">
              ${ico.trophy}<span>Leaderboard</span>
            </a>
            <a href="#/work" class="proof-nav-item" data-route="work">
              ${ico.users}<span>Forums</span>
            </a>
            <a href="#/reviews" class="proof-nav-item" data-route="reviews">
              ${ico.fire}<span>Streaks</span>
            </a>
          </div>
          <div class="proof-sidebar-section">
            <span class="proof-sidebar-section-title">Account</span>
            <a href="#/profile" class="proof-nav-item" data-route="wallet">
              ${ico.wallet}<span>Wallet</span>
            </a>
            <a href="#/settings" class="proof-nav-item" data-route="settings">
              ${ico.settings}<span>Settings</span>
            </a>
          </div>
        </nav>
        <div class="proof-sidebar-footer">
          <button class="proof-theme-toggle" id="desktopThemeToggle" type="button" aria-label="Toggle theme">
            ${ico.moon}<span>Dark Mode</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="proof-main-content">
        <!-- Desktop Header -->
        <header class="proof-desktop-header" role="banner">
          <div class="proof-header-left">
            <form class="proof-global-search" id="homeSearchForm" role="search">
              <label class="sr-only" for="homeSearch">Search courses, skills, or members</label>
              <span class="proof-search-icon" aria-hidden="true">${ico.search}</span>
              <input id="homeSearch" type="text" placeholder="Search courses, skills, or members…" autocomplete="off" maxlength="120" />
              <kbd class="proof-search-shortcut">⌘K</kbd>
            </form>
          </div>
          <div class="proof-header-right">
            <a href="#/notifications" class="proof-icon-btn" aria-label="Notifications">
              ${ico.bell}${app.unread ? `<span class="proof-notification-badge">${app.unread > 9 ? '9+' : app.unread}</span>` : ''}
            </a>
            <button class="proof-wallet-btn" id="referenceWallet" type="button">
              ${ico.wallet}<span>${esc(walletLabel)}</span>
            </button>
            <a href="#/profile" class="proof-avatar-btn" aria-label="Open profile">
              <span class="proof-avatar">${esc(String(u.avatar || '👤'))}</span>
            </a>
          </div>
        </header>

        <!-- Scrollable Content -->
        <div class="proof-content-scroll">
          <div class="proof-content-wrapper">
            <!-- Hero Section -->
            <section class="proof-hero" aria-labelledby="heroTitle">
              <div class="proof-hero-grid">
                <div class="proof-hero-copy">
                  <h1 id="heroTitle" class="proof-hero-title">${hello}, ${esc(displayName)}</h1>
                  <p class="proof-hero-subtitle">You're in the top 5% of learners this week. Keep that streak alive!</p>
                  <div class="proof-hero-actions">
                    <button class="proof-btn proof-btn-primary" id="resumeLearning">Resume Learning</button>
                    <button class="proof-btn proof-btn-secondary" id="viewProfile">View Profile</button>
                  </div>
                </div>
                <div class="proof-hero-stats" role="list" aria-label="Your learning stats">
                  <div class="proof-stat-card" role="listitem">
                    <div class="proof-stat-icon proof-stat-icon--streak">${ico.fire}</div>
                    <div class="proof-stat-value">${streak} Days</div>
                    <div class="proof-stat-label">Current Streak</div>
                  </div>
                  <div class="proof-stat-card" role="listitem">
                    <div class="proof-stat-icon proof-stat-icon--xp">${ico.award}</div>
                    <div class="proof-stat-value">${xp.toLocaleString()} XP</div>
                    <div class="proof-stat-label">Total Points</div>
                  </div>
                  <div class="proof-stat-card" role="listitem">
                    <div class="proof-stat-icon proof-stat-icon--lessons">${ico.checkCircle}</div>
                    <div class="proof-stat-value">${verified + 128}</div>
                    <div class="proof-stat-label">Lessons Done</div>
                  </div>
                  <div class="proof-stat-card" role="listitem">
                    <div class="proof-stat-icon proof-stat-icon--level">${ico.star}</div>
                    <div class="proof-stat-value">Level ${u.level || 12}</div>
                    <div class="proof-stat-label">Fullstack Pro</div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Main Content Grid -->
            <div class="proof-main-grid">
              <!-- Left Column (2/3) -->
              <div class="proof-main-left">
                ${continueLearningPanel(d.continueLearning)}
                ${skillMatrixPanel(d.mySkills)}
              </div>
              <!-- Right Column (1/3) -->
              <div class="proof-main-right">
                ${dailyChallengePanel(d.daily)}
                ${achievementsPanelDesktop(recentAchievements)}
                ${mentorsPanel()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout (existing bento grid) -->
    <section class="proof-mobile-layout" aria-label="PROOF dashboard">
      ${continuePanel(d.continueLearning)}
      ${proofPanel(d.daily)}
      ${skillsPanel(d.mySkills, d.trending)}
      ${achievementsPanel(recentAchievements)}
      ${recommendedPanel(d.recommendedSkills)}
      ${progressPanel(u)}
      ${trendingPanel(d)}
      ${sponsoredPanel(d)}
      ${discoveryPanel(d.discovery)}
    </section>
  </main>`;

  // Event listeners
  const launch = (value) => {
    const goal = String(value || '').trim();
    if (goal.length < 3) return toast('What do you want to learn? ✍️', 'bad');
    generateAndOpenPath({ goal, anchor: document.getElementById('app') }).catch((e) => toast(esc(e.message), 'bad'));
  };

  // Desktop search
  $('#homeSearchForm', root)?.addEventListener('submit', (e) => { e.preventDefault(); launch($('#homeSearch', root).value); });
  // Mobile search
  $('#homeSearchForm', root)?.addEventListener('submit', (e) => { e.preventDefault(); launch($('#homeSearch', root).value); });

  // Wallet
  $('#referenceWallet', root)?.addEventListener('click', () => wallet.connected ? (location.hash = '#/profile') : walletEntry(root));

  // Daily challenge
  $('#refStartProof', root)?.addEventListener('click', () => { if (!d.daily?.done) location.hash = '#/daily'; else location.hash = '#/prove'; });

  // Continue learning
  const openContinue = () => { location.hash = d.continueLearning?.id ? `#/learn/path/${d.continueLearning.id}` : '#/learn'; };
  $('#refContinue', root)?.addEventListener('click', (e) => {
    if (e.target.closest('a,button')) return;
    openContinue();
  });
  $('#refContinue', root)?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openContinue(); }
  });

  // Resume learning / View profile
  $('#resumeLearning', root)?.addEventListener('click', openContinue);
  $('#viewProfile', root)?.addEventListener('click', () => { location.hash = '#/profile'; });

  // Skill cards
  root.querySelectorAll('[data-ref-skill]').forEach((n) => n.addEventListener('click', () => launch(`I want to learn ${n.dataset.refSkill}`)));
  root.querySelectorAll('[data-ref-route]').forEach((n) => n.addEventListener('click', () => { location.hash = n.dataset.refRoute; }));
  root.querySelectorAll('[data-ref-task]').forEach((n) => n.addEventListener('click', () => n.dataset.refTask && openTask(n.dataset.refTask)));

  // Sidebar navigation
  root.querySelectorAll('.proof-nav-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = item.dataset.route;
      if (route) location.hash = `#/${route}`;
      root.querySelectorAll('.proof-nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Theme toggle
  $('#desktopThemeToggle', root)?.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    const btn = $('#desktopThemeToggle', root);
    if (btn) {
      btn.innerHTML = isDark ? `${ico.moon}<span>Dark Mode</span>` : `${ico.sun}<span>Light Mode</span>`;
    }
  });

  setupScrollReveal(root);
}

// ===== DESKTOP PANELS =====

function continueLearningPanel(p) {
  if (!p) {
    return `<div class="proof-panel proof-panel-continue">
      <div class="proof-panel-header">
        <h2>Continue Learning</h2>
        <a href="#/learn" class="proof-panel-link">View Roadmap</a>
      </div>
      <div class="proof-empty-state">
        <span>✦</span>
        <b>Start your first skill path</b>
        <p>Tell PROOF what you want to learn and get a practical path in seconds.</p>
        <button class="proof-btn proof-btn-primary" id="homeCreateFirst">Choose a skill</button>
      </div>
    </div>`;
  }
  const day = p.days?.find((x) => x.items?.some((i) => !i.lessonDone && !i.practiceDone && !i.attempt)) || p.days?.[p.days.length - 1];
  const item = day?.items?.find((i) => !i.lessonDone && !i.practiceDone && !i.attempt) || day?.items?.[0];
  const pct = Math.max(0, Math.min(100, Number(p.percent || 0)));
  return `<div class="proof-panel proof-panel-continue proof-clickable" id="refContinue" tabindex="0" role="button" aria-label="Continue ${esc(p.title || 'learning path')}">
    <div class="proof-panel-header">
      <h2>Continue Learning</h2>
      <a href="#/learn/path/${esc(p.id)}" class="proof-panel-link">View Roadmap</a>
    </div>
    <div class="proof-course-card">
      <div class="proof-course-thumb" style="background: linear-gradient(135deg, var(--primary-soft), var(--nim-soft));">
        <span class="proof-course-play">${ico.play}</span>
      </div>
      <div class="proof-course-info">
        <div class="proof-course-meta">
          <span class="proof-badge proof-badge--advanced">Advanced</span>
          <span class="proof-course-time">~${Number(p.minutesPerDay) || 30} min/day</span>
        </div>
        <h3>${esc(p.title || 'Skill Path')}</h3>
        <p>Day ${esc(day?.day || 1)} · ${esc(item?.title || 'Next lesson')}</p>
        <div class="proof-progress-bar">
          <div class="proof-progress-fill" style="width: ${pct}%"></div>
        </div>
        <div class="proof-progress-meta">
          <span>${pct}% complete</span>
          <span>${p.days?.length || 0} lessons total</span>
        </div>
      </div>
    </div>
  </div>`;
}

function skillMatrixPanel(mySkills = []) {
  const skills = [
    { name: 'HTML/CSS', icon: ico.code, score: 100, verified: true },
    { name: 'JavaScript', icon: ico.code, score: 85, verified: false },
    { name: 'React', icon: ico.code, score: 78, verified: false },
    { name: 'Node.js', icon: ico.code, score: 55, verified: false },
  ];
  // Merge with actual user skills if available
  const userSkills = mySkills?.slice(0, 4) || [];
  const displaySkills = userSkills.length ? userSkills.map(s => ({
    name: s.skillSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    icon: skillIcon(s.skillSlug),
    score: s.score,
    verified: s.verified
  })) : skills;

  return `<div class="proof-panel proof-panel-skills">
    <h2 class="proof-panel-title">Skill Matrix</h2>
    <div class="proof-skill-matrix">
      ${displaySkills.map((s) => {
        const level = skillLevel(s.score, s.verified);
        return `<div class="proof-skill-card">
          <div class="proof-skill-icon" ${skillIconBg(s.name)}>${s.icon}</div>
          <div class="proof-skill-name">${esc(s.name)}</div>
          <span class="proof-skill-level ${level.class}">${esc(level.label)}</span>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function dailyChallengePanel(daily = {}) {
  const done = !!daily.done;
  const timeMin = Number(daily.timeMin) || 15;
  return `<div class="proof-panel proof-panel-challenge">
    <div class="proof-challenge-badge">
      <span class="proof-live-indicator" aria-hidden="true"></span>
      <span>Daily Challenge</span>
    </div>
    <h3>${esc(daily.title || 'Build a Glassmorphic Navigation Bar')}</h3>
    <p>${esc(daily.description || 'Create a modern glassmorphic nav with backdrop blur, responsive breakpoints, and smooth animations.')}</p>
    <div class="proof-challenge-reward">
      <span class="proof-challenge-xp">+${daily.rewardXP || 250} XP</span>
      <span class="proof-challenge-badge-text">UI Wizard Badge</span>
    </div>
    <button class="proof-btn proof-btn-challenge" id="refStartProof" ${done ? 'disabled' : ''}>
      ${done ? 'Completed' : 'Start Proof'}
    </button>
    <div class="proof-challenge-accent" aria-hidden="true">${ico.zap}</div>
  </div>`;
}

function achievementsPanelDesktop(recentAchievements = []) {
  const items = recentAchievements.length ? recentAchievements : [
    { emoji: ico.trophy, title: 'Fast Learner', desc: 'Finished 5 lessons in 1 day', unlocked: true },
    { emoji: ico.github, title: 'Open Sourcer', desc: 'First PR merged in platform repo', unlocked: true },
    { emoji: ico.lock, title: 'Hackathon Winner', desc: 'Locked until Season 3', unlocked: false },
  ];
  return `<div class="proof-panel proof-panel-achievements">
    <div class="proof-panel-header">
      <h2>Achievements</h2>
      <a href="#/notifications" class="proof-panel-link">${ico.chevronRight}</a>
    </div>
    <div class="proof-achievements-list">
      ${items.map((a, i) => `
        <div class="proof-achievement-item ${!a.unlocked ? 'proof-achievement--locked' : ''}" ${i === 2 && !a.unlocked ? 'style="opacity: 0.5;"' : ''}>
          <div class="proof-achievement-icon ${a.unlocked ? '' : 'proof-achievement-icon--locked'}">
            ${a.emoji}
          </div>
          <div>
            <div class="proof-achievement-title">${esc(a.title)}</div>
            <div class="proof-achievement-desc">${esc(a.desc)}</div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>`;
}

function mentorsPanel() {
  const mentors = [
    { name: 'Sarah Drasner', role: 'Senior Dev at Google', avatar: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Dan Abramov', role: 'React Core Team', avatar: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Kent C. Dodds', role: 'Epic React Instructor', avatar: 'https://i.pravatar.cc/150?u=3' },
  ];
  return `<div class="proof-panel proof-panel-mentors">
    <h2 class="proof-panel-title">Top Mentors</h2>
    <div class="proof-mentors-list">
      ${mentors.map(m => `
        <div class="proof-mentor-item">
          <div class="proof-mentor-info">
            <img src="${esc(m.avatar)}" alt="" class="proof-mentor-avatar" />
            <div>
              <div class="proof-mentor-name">${esc(m.name)}</div>
              <div class="proof-mentor-role">${esc(m.role)}</div>
            </div>
          </div>
          <button class="proof-mentor-follow" type="button" aria-label="Follow ${esc(m.name)}">${ico.plus}</button>
        </div>
      `).join('')}
    </div>
  </div>`;
}

// ===== MOBILE PANELS (existing) =====

function continuePanel(p) {
  if (!p) {
    return `<article class="proof-panel proof-panel-continue reveal"><header><h2>Continue learning</h2><a href="#/learn">View paths</a></header><div class="proof-empty-state"><span>✦</span><b>Start your first skill path</b><p>Tell PROOF what you want to learn and get a practical path in seconds.</p><button id="homeCreateFirst" type="button">Choose a skill</button></div></article>`;
  }
  const day = p.days?.find((x) => x.items?.some((i) => !i.lessonDone && !i.practiceDone && !i.attempt)) || p.days?.[p.days.length - 1];
  const item = day?.items?.find((i) => !i.lessonDone && !i.practiceDone && !i.attempt) || day?.items?.[0];
  const pct = Math.max(0, Math.min(100, Number(p.percent || 0)));
  return `<article class="proof-panel proof-panel-continue proof-clickable reveal" id="refContinue" tabindex="0" role="button" aria-label="Continue ${esc(p.title || 'learning path')}">
    <header><h2>Continue learning</h2><a href="#/learn/path/${esc(p.id)}">View path</a></header>
    <div class="proof-course-row">
      <div class="proof-course-art"></><span>✦</span></div>
      <div class="proof-course-main"><h3>${esc(p.title || 'Skill Path')}</h3><p>Day ${esc(day?.day || 1)} · ${esc(item?.title || 'Next lesson')}</p><div class="proof-progress"><i style="width:${pct}%"></i></div></div>
      <b class="proof-percent">${pct}%</b>
    </div>
    <footer><span>◷ ~${Number(p.minutesPerDay) || 30} min/day</span><span>▤ ${p.days?.length || 0} lessons</span></footer>
  </article>`;
}

function proofPanel(daily = {}) {
  const done = !!daily.done;
  const timeMin = Number(daily.timeMin) || null;
  return `<article class="proof-panel proof-panel-today reveal">
    <header><h2>Today's proof</h2><a href="#/daily">View all</a></header>
    <div class="proof-label-row"><span>● Daily challenge</span><em>${done ? 'Completed' : 'Popular'}</em></div>
    <h3>${esc(daily.title || 'Build a responsive pricing card')}</h3>
    <p>${timeMin ? `<span>◷ ~${timeMin} min</span>` : ''}<strong>+${Number(daily.rewardNim || 1)} NIM</strong></p>
    <button id="refStartProof" type="button">${done ? 'Review proof' : 'Start proof'} <span>→</span></button>
  </article>`;
}

function skillsPanel(mySkills = [], trending = []) {
  const items = (mySkills || []).slice(0, 4);
  const trendFallback = (trending || []).slice(0, 4 - items.length).map((s) => ({ skillSlug: s.slug || s.name, score: 0, verified: false }));
  const list = [...items, ...trendFallback].slice(0, 4);
  if (!list.length) {
    return `<article class="proof-panel proof-panel-skills reveal"><header><h2>Skills you're building</h2><a href="#/profile">View all</a></header><div class="proof-empty-inline">Start a skill path and your real progress will show up here.</div></article>`;
  }
  return `<article class="proof-panel proof-panel-skills reveal"><header><h2>Skills you're building</h2><a href="#/profile">View all</a></header><div class="proof-skill-grid">${list.map((s) => {
    const name = String(s.skillSlug || 'new skill').replace(/-/g, ' ');
    const score = Number(s.score || 0);
    return `<button type="button" data-ref-skill="${esc(name)}"><strong>${esc(skillIcon(name))}</strong><span><b>${esc(name)}</b><small>${score}%</small><em>${s.verified ? 'Verified' : score >= 60 ? 'Intermediate' : score > 0 ? 'Learning' : 'Not started'}</em></span></button>`;
  }).join('')}</div></article>`;
}

function achievementsPanel(recentAchievements = []) {
  if (!recentAchievements.length) {
    return `<article class="proof-panel proof-panel-achievements reveal"><header><h2>Recent achievements</h2><a href="#/notifications">View all</a></header><div class="proof-empty-inline">Your wins will show up here as you pass proofs and unlock badges.</div></article>`;
  }
  const rewardTag = (n) => {
    const m = String(n.body || '').match(/\+[\d.]+\s*(XP|NIM)/i);
    return m ? m[0] : timeAgo(n.createdAt);
  };
  return `<article class="proof-panel proof-panel-achievements reveal"><header><h2>Recent achievements</h2><a href="#/notifications">View all</a></header>${recentAchievements.map((n) => `<div class="proof-achievement"><i>${esc(n.emoji || '🔔')}</i><span><b>${esc(n.title)}</b><small>${esc(n.body || '')}</small></span><strong>${esc(rewardTag(n))}</strong></div>`).join('')}</article>`;
}

function recommendedPanel(recommendedSkills = []) {
  if (!recommendedSkills.length) {
    return `<article class="proof-panel proof-panel-recommended reveal"><header><h2>Recommended for you</h2><a href="#/learn">View all</a></header><div class="proof-empty-inline">Verify a few more skills and we'll surface what's in demand next.</div></article>`;
  }
  return `<article class="proof-panel proof-panel-recommended reveal"><header><h2>Recommended for you</h2><a href="#/learn">View all</a></header><div class="proof-recommend-grid">${recommendedSkills.slice(0, 3).map((s) => {
    const name = String(s.name || s.slug || '').replace(/-/g, ' ');
    return `<button type="button" data-ref-skill="${esc(name)}"><b>${esc(s.emoji || skillIcon(name))}</b><span><strong>${esc(name)}</strong><small>${esc(s.reason || 'Matched to your next step')}</small></span></button>`;
  }).join('')}</div></article>`;
}

function progressPanel(u = {}) {
  const xp = Number(u.xp || 0);
  const level = Number(u.level || 1);
  const pct = Math.max(8, Math.min(100, Number(u.levelProgress || ((xp % 500) / 5) || 22)));
  return `<article class="proof-panel proof-panel-progress reveal"><header><h2>Your progress</h2><a href="#/profile">Details</a></header><div class="proof-progress-card"><div class="proof-ring" style="--pct:${pct}%"><b>${Math.round(pct)}%</b></div><span><strong>Level ${level}</strong><small>${xp.toLocaleString()} / ${Math.max(500, Math.ceil((xp + 1) / 500) * 500)} XP</small><i><b style="width:${pct}%"></b></i></span></div></article>`;
}

function trendingPanel(d) {
  const list = (d.trending || []).slice(0, 3);
  return `<article class="proof-panel proof-panel-wide reveal"><header><h2>Trending proofs</h2><a href="#/learn">View all</a></header><div class="proof-mini-cards">${list.length ? list.map((s) => `<button type="button" data-ref-skill="${esc(s.name || s.slug)}"><b>${esc(s.emoji || '✦')}</b><span>${esc(s.name || s.slug)}<small>${s.learners || ''} learners</small></span></button>`).join('') : '<div class="proof-empty-inline">Popular proofs will appear here as the marketplace grows.</div>'}</div></article>`;
}

function sponsoredPanel(d) {
  const list = (d.sponsored || []).slice(0, 3);
  return `<article class="proof-panel proof-panel-wide reveal"><header><h2>Sponsored challenges</h2><a href="#/work/sponsored">View all</a></header><div class="proof-mini-cards">${list.length ? list.map((s) => `<button type="button" data-ref-route="#/work/sponsored"><b>${esc(s.emoji || '◈')}</b><span>${esc(s.title)}<small>${fmtNim(s.poolNim || 0)} NIM pool · ${s.participants || 0} proofers</small></span></button>`).join('') : '<div class="proof-empty-inline">Sponsored proof challenges will appear here.</div>'}</div></article>`;
}

function discoveryPanel(discovery = {}) {
  const top = discovery.topProofers || [];
  const tasks = discovery.newTasks || [];
  if (!top.length && !tasks.length) return '';
  return `<article class="proof-panel proof-panel-community proof-panel-wide reveal"><header><h2>Alive on PROOF</h2><a href="#/leaderboard">Leaderboard</a></header><div class="proof-community-grid"><div>${top.slice(0, 3).map((t, i) => `<button type="button" data-ref-route="#/leaderboard"><small>${i + 1}</small><b>${esc(t.avatar || '👤')}</b><span>${esc(t.username || 'proofer')}</span></button>`).join('')}</div><div>${tasks.slice(0, 2).map((t) => `<button type="button" data-ref-task="${esc(t.id)}"><span>${esc(t.title)}</span><small>${timeAgo(t.postedAt)}</small></button>`).join('')}</div></div></article>`;
}

export async function openTask(taskId) {
  const { sheet } = await import('../ui.js');
  let d;
  try { d = (await api.get(`/api/market/tasks/${taskId}`)).task; } catch (e) { return toast(esc(e.message), 'bad'); }
  const q = d.qualification;
  
  const headerHtml = `<div class="row-between"><span class="chip chip-nim">${ico.coin} ${fmtNim(d.budgetNim)} NIM</span><span class="tiny">${timeAgo(d.postedAt)} · ${d.applications} applicants</span></div><h2 class="h1 mt8">${esc(d.title)}</h2><p class="sub mt8">${esc(d.description)}</p>`;
  
  const tagsHtml = d.tags?.length ? `<div class="chip-row mt8">${d.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>` : '';
  
  const minProofHtml = d.minProof ? `<div class="card mt16" style="box-shadow:none;background:var(--surface-2)"><div class="row-between"><span class="tiny">REQUIREMENT</span><b style="font-size:13px">${esc(d.minProof.skillSlug.replace(/-/g, ' '))} ${d.minProof.min}+</b></div><div class="qmeter mt8"><i style="width:${Math.min(100, q.yourScore)}%"></i><em style="left:${d.minProof.min}%"></em></div><div class="row-between mt8"><span class="tiny">your proof: <b>${q.yourScore}%</b></span><span class="chip ${q.qualified ? 'chip-ok' : 'chip-bad'}">${q.qualified ? '✓ qualified' : esc(q.reason)}</span></div></div>` : '<div class="card mt16" style="box-shadow:none;background:var(--surface-2)"><span class="tiny">Open to all proofers</span></div>';
  
  const applicationHtml = d.myApplication 
    ? `<div class="card mt12" style="box-shadow:none;background:var(--primary-soft)"><b style="font-size:14px">Application ${esc(d.myApplication.status)}</b>${d.myApplication.status === 'accepted' ? `<p class="sub mt8">Accepted! Deliver the work, then mark it complete to receive ${fmtNim(d.budgetNim)} NIM.</p><button class="btn btn-ok btn-block mt8" id="btnComplete">${ico.check} Mark delivered & get paid</button>` : '<p class="sub mt8">Waiting for the client.</p>'}</div>`
    : `<div class="field mt16"><label class="label">Your pitch (1–2 sentences)</label><textarea id="pitch" class="input" maxlength="400" placeholder="Why you're the right fit…"></textarea></div><button class="btn btn-primary btn-block mt8" id="applyBtn">${ico.send} Apply</button>`;
  
  const s = sheet(headerHtml + tagsHtml + minProofHtml + applicationHtml);
  s.el.querySelector('#applyBtn')?.addEventListener('click', async () => {
    try {
      await api.post(`/api/market/tasks/${taskId}/apply`, { pitch: s.el.querySelector('#pitch').value });
      s.close(); toast('Applied! 🎯', 'ok'); screen(document.querySelector('.screen'));
    } catch (e) { toast(esc(e.message), 'bad'); }
  });
  s.el.querySelector('#btnComplete')?.addEventListener('click', async () => {
    try {
      await api.post(`/api/market/tasks/${taskId}/complete`);
      s.close(); toast('Marked complete — payout incoming 💸', 'ok'); screen(document.querySelector('.screen'));
    } catch (e) { toast(esc(e.message), 'bad'); }
  });
}