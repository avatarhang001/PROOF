/**
 * Reference Home Page - Matches screenshot exactly
 */
import { api } from '../api.js';
import { esc, ico } from '../ui.js';

export async function renderReferenceHome(root) {
  // Fetch data
  let d;
  try { d = await api.get('/api/home'); } catch { location.hash = '#/onboarding'; return; }
  
  const u = d.user || {};
  const streak = Number(u.streak?.current || 0);
  const xp = Number(u.xp || 0);
  const verified = Array.isArray(d.mySkills) ? d.mySkills.filter((s) => s.verified).length : 0;
  const earned = Number(u.earnedNim ?? u.balanceNim ?? 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = u.username ? String(u.username).replace(/^proofer[-_]?/i, '').split(/[-_\s]/)[0] : 'learner';
  
  // Get actual continue learning data
  const continueLearning = d.continueLearning || null;
  const hasPath = !!continueLearning;
  let pathData = {
    title: 'Start your first skill path',
    lesson: 'Tell PROOF what you want to learn',
    progress: 0,
    timeLeft: '',
    lessons: 0,
    rating: 0
  };
  
  if (hasPath) {
    const day = continueLearning.days?.find((x) => x.items?.some((i) => !i.lessonDone && !i.practiceDone && !i.attempt)) || continueLearning.days?.[continueLearning.days.length - 1];
    const item = day?.items?.find((i) => !i.lessonDone && !i.practiceDone && !i.attempt) || day?.items?.[0];
    pathData = {
      title: continueLearning.title || 'Skill Path',
      lesson: `Lesson ${day?.day || 1} · ${item?.title || 'Next lesson'}`,
      progress: Math.max(0, Math.min(100, Number(continueLearning.percent || 0))),
      timeLeft: `${continueLearning.minutesPerDay || 30} min left`,
      lessons: continueLearning.days?.length || 0,
      rating: 4.7
    };
  }
  
  // Get actual skills data
  const mySkills = (d.mySkills || []).slice(0, 4);
  const skillsToDisplay = mySkills.length > 0 ? mySkills : [
    { skillSlug: 'html', score: 0, verified: false },
    { skillSlug: 'css', score: 0, verified: false },
    { skillSlug: 'javascript', score: 0, verified: false },
    { skillSlug: 'react', score: 0, verified: false }
  ];
  
  const getSkillIcon = (slug) => {
    const s = String(slug).toLowerCase();
    if (s.includes('html')) return { icon: 'HTML', bg: 'rgba(249,115,22,0.1)', color: '#f97316' };
    if (s.includes('css')) return { icon: 'CSS', bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
    if (s.includes('javascript') || s.includes('js')) return { icon: 'JS', bg: 'rgba(234,179,8,0.1)', color: '#ca8a04' };
    if (s.includes('react')) return { icon: '⚛', bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
    if (s.includes('python')) return { icon: 'Py', bg: 'rgba(34,197,94,0.1)', color: '#22c55e' };
    if (s.includes('node')) return { icon: 'Node', bg: 'rgba(99,102,241,0.1)', color: '#6366f1' };
    return { icon: '✦', bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' };
  };
  
  const getSkillLevel = (score, verified) => {
    if (verified) return { label: 'Proficient', class: 'proficient' };
    if (score >= 60) return { label: 'Intermediate', class: 'intermediate' };
    if (score > 0) return { label: 'Learning', class: 'learning' };
    return { label: 'Not started', class: 'learning' };
  };
  
  // Get actual daily challenge
  const daily = d.daily || {};
  const hasDailyChallenge = !!daily.title;
  
  // Get actual achievements
  let recentAchievements = [];
  try {
    const ACHIEVEMENT_TYPES = new Set(['proof_passed', 'skill_verified', 'badge', 'achievement', 'goal_complete']);
    const { notifications } = await api.get('/api/notifications');
    recentAchievements = (notifications || []).filter((n) => ACHIEVEMENT_TYPES.has(n.type)).slice(0, 3);
  } catch { }
  
  // Get recommended skills
  const recommendedSkills = (d.recommendedSkills || []).slice(0, 3);
  if (recommendedSkills.length === 0) {
    recommendedSkills.push(
      { name: 'JavaScript Basics', description: 'Build dynamic websites', duration: '~3h', lessons: 12, rating: 4.8, level: 'Beginner' },
      { name: 'React Fundamentals', description: 'Component-based UI', duration: '~4h', lessons: 13, rating: 4.7, level: 'Intermediate' },
      { name: 'UI/UX Design', description: 'Design beautiful interfaces', duration: '~2h', lessons: 9, rating: 4.6, level: 'Beginner' }
    );
  }
  
  root.innerHTML = `
    <div class="ref-home-wrapper">
    <!-- Hero Section -->
    <div class="ref-hero">
      <div class="ref-hero-content">
        <h1>${greeting}, ${esc(firstName)}! 👋</h1>
        <p>Keep going. Your next proof is closer than you think.</p>
        
        <div class="ref-hero-stats">
          <div class="ref-stat-card">
            <div class="ref-stat-icon ref-stat-icon--streak">🔥</div>
            <div>
              <div class="ref-stat-value">${streak}</div>
              <div class="ref-stat-label">Day streak</div>
            </div>
          </div>
          
          <div class="ref-stat-card">
            <div class="ref-stat-icon ref-stat-icon--xp">🏆</div>
            <div>
              <div class="ref-stat-value">${xp.toLocaleString()}</div>
              <div class="ref-stat-label">XP</div>
            </div>
          </div>
          
          <div class="ref-stat-card">
            <div class="ref-stat-icon ref-stat-icon--skills">🛡️</div>
            <div>
              <div class="ref-stat-value">${verified}</div>
              <div class="ref-stat-label">Verified skills</div>
            </div>
          </div>
          
          <div class="ref-stat-card">
            <div class="ref-stat-icon ref-stat-icon--nim">💰</div>
            <div>
              <div class="ref-stat-value">${earned.toFixed(1)}</div>
              <div class="ref-stat-label">NIM earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content Grid -->
    <div class="ref-main-grid">
      <!-- Left Column -->
      <div>
        <!-- Continue Learning -->
        <div class="ref-panel">
          <div class="ref-panel-header">
            <h2>Continue learning</h2>
            <a href="#/learn" class="ref-panel-link">View path</a>
          </div>
          
          <div class="ref-course-card">
            ${hasPath ? `
              <div class="ref-course-thumb">🎓</div>
              <div class="ref-course-info">
                <h3>${esc(pathData.title)}</h3>
                <p>${esc(pathData.lesson)}</p>
                <div class="ref-progress-bar">
                  <div class="ref-progress-fill" style="width: ${pathData.progress}%"></div>
                </div>
                <div class="ref-progress-text">${pathData.progress}%</div>
                <div class="ref-course-meta">
                  ${pathData.timeLeft ? `<span>⏱ ${esc(pathData.timeLeft)}</span>` : ''}
                  ${pathData.lessons > 0 ? `<span>📚 ${pathData.lessons} lessons</span>` : ''}
                  <span>⭐ ${pathData.rating}</span>
                </div>
              </div>
            ` : `
              <div style="text-align: center; padding: 32px;">
                <div style="font-size: 48px; margin-bottom: 16px;">✦</div>
                <h3 style="margin: 0 0 8px 0;">Start your first skill path</h3>
                <p style="margin: 0 0 16px 0; color: #6B7280;">Tell PROOF what you want to learn and get a practical path in seconds.</p>
                <button onclick="location.hash='#/learn'" style="padding: 12px 24px; background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">Choose a skill</button>
              </div>
            `}
          </div>
        </div>
        
        <!-- Skills you're building -->
        <div class="ref-panel" style="margin-top: 24px;">
          <div class="ref-panel-header">
            <h2>Skills you're building</h2>
            <a href="#/profile" class="ref-panel-link">View all</a>
          </div>
          
          <div class="ref-skills-grid">
            ${skillsToDisplay.map(skill => {
              const skillIcon = getSkillIcon(skill.skillSlug);
              const level = getSkillLevel(skill.score, skill.verified);
              const name = String(skill.skillSlug || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              return `
                <div class="ref-skill-card">
                  <div class="ref-skill-icon" style="background: ${skillIcon.bg}; color: ${skillIcon.color};">${skillIcon.icon}</div>
                  <div class="ref-skill-name">${esc(name)}</div>
                  <div class="ref-skill-progress">${skill.score}%</div>
                  <div class="ref-skill-level ref-skill-level--${level.class}">${level.label}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
      
      <!-- Right Column -->
      <div>
        <!-- Today's Proof -->
        <div class="ref-panel">
          <div class="ref-panel-header">
            <h2>Today's proof</h2>
            <a href="#/prove" class="ref-panel-link">View all</a>
          </div>
          
          <div class="ref-proof-card">
            ${hasDailyChallenge ? `
              <div class="ref-proof-badge">${esc(daily.category || 'Frontend Challenge')}</div>
              <h3>${esc(daily.title)}</h3>
              <p>${esc(daily.description || '')}</p>
              
              <div class="ref-proof-reward">
                <div class="ref-proof-reward-badge">+${daily.rewardNim || 1} NIM</div>
                <div class="ref-proof-reward-label">${daily.done ? 'Completed' : 'Popular'}</div>
              </div>
              
              ${daily.timeMin ? `
                <div style="font-size: 13px; color: #6B7280; margin-bottom: 16px;">
                  ⏱ ~${daily.timeMin} min
                </div>
              ` : ''}
              
              <button class="ref-proof-btn" onclick="location.hash='#/daily'">${daily.done ? 'Review proof' : 'Start proof'} →</button>
            ` : `
              <div style="text-align: center; padding: 24px;">
                <div style="font-size: 48px; margin-bottom: 12px;">⚡</div>
                <h3 style="margin: 0 0 8px 0;">No challenge today</h3>
                <p style="margin: 0; color: #6B7280; font-size: 14px;">Check back tomorrow for a new proof!</p>
              </div>
            `}
          </div>
        </div>
        
        <!-- Recent Achievements -->
        <div class="ref-panel" style="margin-top: 24px;">
          <div class="ref-panel-header">
            <h2>Recent achievements</h2>
            <a href="#/notifications" class="ref-panel-link">View all</a>
          </div>
          
          <div class="ref-achievements-list">
            ${recentAchievements.length > 0 ? recentAchievements.map(achievement => `
              <div class="ref-achievement-item">
                <div class="ref-achievement-icon">${esc(achievement.emoji || '🏆')}</div>
                <div class="ref-achievement-info">
                  <div class="ref-achievement-title">${esc(achievement.title)}</div>
                  <div class="ref-achievement-desc">${esc(achievement.body || '')}</div>
                </div>
                <div class="ref-achievement-reward">${achievement.rewardNim ? `+${achievement.rewardNim} NIM` : achievement.rewardXP ? `+${achievement.rewardXP} XP` : ''}</div>
              </div>
            `).join('') : `
              <div style="text-align: center; padding: 24px; color: #6B7280; font-size: 14px;">
                Your achievements will show up here as you complete proofs and unlock badges.
              </div>
            `}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recommended Section -->
    <div class="ref-panel">
      <div class="ref-panel-header">
        <h2>Recommended for you</h2>
        <a href="#/learn" class="ref-panel-link">View all</a>
      </div>
      
      <div class="ref-recommended-grid">
        ${recommendedSkills.map(skill => `
          <div class="ref-recommended-card">
            <h4>${esc(skill.name || skill.slug || 'Course')}</h4>
            <p>${esc(skill.description || skill.reason || 'Learn new skills')}</p>
            <div class="ref-recommended-meta">
              <span>${skill.duration || '~3h'} · ${skill.lessons || skill.challengeCount || 10} lessons</span>
              <span>⭐ ${skill.rating || 4.5}</span>
            </div>
            <div class="ref-recommended-badge">${skill.level || 'Beginner'}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- Bottom Grid -->
    <div class="ref-bottom-grid" style="margin-top: 24px;">
      <div class="ref-panel">
        <div class="ref-panel-header">
          <h2>Trending proofs</h2>
          <a href="#/prove" class="ref-panel-link">View all</a>
        </div>
        <div class="ref-trending-list">
          <p style="color: #6B7280; font-size: 14px;">Popular challenges coming soon...</p>
        </div>
      </div>
      
      <div class="ref-panel">
        <div class="ref-panel-header">
          <h2>Sponsored</h2>
          <a href="#/work" class="ref-panel-link">View all</a>
        </div>
        <div class="ref-sponsored-list">
          <p style="color: #6B7280; font-size: 14px;">Sponsored opportunities coming soon...</p>
        </div>
      </div>
    </div>
    </div>
  `;
}
