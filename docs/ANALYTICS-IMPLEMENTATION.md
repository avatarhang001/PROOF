# 📊 Analytics & User Tracking Implementation Guide

## Overview

This guide shows you how to implement comprehensive analytics to track users, monitor activity, and prevent abuse.

---

## 🎯 What You Can Track (Already Available!)

Your system **already collects** extensive user data. Here's what you have:

### User Data Fields (from `users` table)

```javascript
{
  id: 'u_abc123',
  username: 'SwiftOtter42',
  avatar: '🦊',
  walletAddress: 'NQ... (or null for demo)',
  walletMode: 'nimiq' | 'demo' | 'disconnected',
  publicKey: '...',
  level: 5,
  xp: 1200,
  reputation: 75,
  balanceLuna: 150000,        // Current balance in Luna (÷100,000 = NIM)
  earnedLuna: 500000,         // Total earned (lifetime)
  proofsPassed: 25,
  proofsAttempted: 30,
  streak: {
    current: 7,
    longest: 14,
    lastDay: '2026-09-11'
  },
  isDemo: true,               // Demo user or real wallet
  prefs: {
    goal: 'career',
    level: 'intermediate',
    minutesPerDay: 30,
    style: 'practical',
    interests: ['web-development', 'ai']
  },
  createdAt: '2026-08-01T12:00:00Z',
  updatedAt: '2026-09-11T16:00:00Z'
}
```

### Transaction History (from `wallet_txs` table)

```javascript
{
  id: 'wtx_xyz',
  userId: 'u_abc123',
  kind: 'challenge_reward',    // Types: challenge_reward, daily_reward, tip, payment, payout
  direction: 'credit',         // credit | debit
  amountLuna: 100000,         // 1 NIM
  status: 'completed',         // pending | completed | failed
  ref: 'challenge_id',
  note: 'Web Development Challenge',
  meta: { challengeId, score: 85 },
  createdAt: '2026-09-11T14:30:00Z'
}
```

### Challenge Attempts (from `attempts` table)

```javascript
{
  id: 'attempt_123',
  userId: 'u_abc123',
  challengeId: 'ch_xyz',
  status: 'passed',            // pending | passed | failed
  score: 85,
  evaluation: { ... },         // AI evaluation details
  rewarded: true,
  rewardAmountLuna: 100000,
  submittedAt: '2026-09-11T14:25:00Z',
  evaluatedAt: '2026-09-11T14:26:00Z'
}
```

---

## 📈 Analytics API Endpoints (New)

Let me create API endpoints for real-time analytics:

### 1. Admin Analytics Dashboard Endpoint

```javascript
// server/index.js

/* ── ADMIN ANALYTICS ────────────────────────────────────────────────────── */
route('GET', '/api/admin/analytics', async (ctx) => {
  const { user, query, res } = ctx;
  
  // TODO: Add admin authentication check
  // if (!user.isAdmin) throw httpError(403, 'FORBIDDEN', 'Admin only');
  
  const timeRange = query.get('range') || '24h'; // 24h, 7d, 30d, all
  const now = Date.now();
  const cutoff = timeRange === '24h' ? now - 86400000
               : timeRange === '7d' ? now - 604800000
               : timeRange === '30d' ? now - 2592000000
               : 0;

  // Get all users
  const allUsers = await store.all('users');
  const allAttempts = await store.all('attempts');
  const allTransactions = await store.all('wallet_txs');
  
  // Filter by time range
  const recentUsers = allUsers.filter(u => new Date(u.createdAt).getTime() > cutoff);
  const recentAttempts = allAttempts.filter(a => new Date(a.submittedAt || a.createdAt).getTime() > cutoff);
  const recentTxs = allTransactions.filter(t => new Date(t.createdAt).getTime() > cutoff);
  
  // Calculate metrics
  const analytics = {
    // User Metrics
    users: {
      total: allUsers.length,
      new: recentUsers.length,
      demo: allUsers.filter(u => u.isDemo).length,
      real: allUsers.filter(u => !u.isDemo).length,
      active: recentAttempts.map(a => a.userId).filter((v, i, a) => a.indexOf(v) === i).length,
    },
    
    // Activity Metrics
    activity: {
      totalAttempts: recentAttempts.length,
      passedAttempts: recentAttempts.filter(a => a.status === 'passed').length,
      failedAttempts: recentAttempts.filter(a => a.status === 'failed').length,
      averageScore: Math.round(recentAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / recentAttempts.length),
    },
    
    // Economy Metrics
    economy: {
      totalDistributed: Math.round(recentTxs
        .filter(t => t.direction === 'credit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amountLuna, 0) / 100000), // Convert to NIM
      totalCirculating: Math.round(allUsers.reduce((sum, u) => sum + u.balanceLuna, 0) / 100000),
      averageBalance: Math.round(allUsers.reduce((sum, u) => sum + u.balanceLuna, 0) / allUsers.length / 100000),
      rewardsToday: Math.round(recentTxs
        .filter(t => t.kind.includes('reward') && t.direction === 'credit')
        .reduce((sum, t) => sum + t.amountLuna, 0) / 100000),
    },
    
    // Top Users
    topUsers: allUsers
      .sort((a, b) => b.earnedLuna - a.earnedLuna)
      .slice(0, 10)
      .map(u => ({
        id: u.id,
        username: u.username,
        level: u.level,
        earned: Math.round(u.earnedLuna / 100000),
        proofs: u.proofsPassed,
      })),
    
    // Abuse Detection
    suspicious: await detectSuspiciousActivity(store, cutoff),
  };
  
  json(res, 200, analytics);
});

// Helper function to detect suspicious patterns
async function detectSuspiciousActivity(store, cutoffTime) {
  const users = await store.all('users');
  const attempts = await store.all('attempts');
  const txs = await store.all('wallet_txs');
  
  const suspicious = [];
  
  for (const user of users) {
    const flags = [];
    const userAttempts = attempts.filter(a => a.userId === user.id);
    const userTxs = txs.filter(t => t.userId === user.id && new Date(t.createdAt).getTime() > cutoffTime);
    const rewardTxs = userTxs.filter(t => t.kind.includes('reward'));
    
    // Flag 1: Hitting daily cap consistently
    const daysAtCap = rewardTxs.filter(t => {
      const dayRewards = rewardTxs
        .filter(r => r.createdAt.startsWith(t.createdAt.slice(0, 10)))
        .reduce((sum, r) => sum + r.amountLuna, 0);
      return dayRewards >= 1500000; // 15 NIM
    }).length;
    
    if (daysAtCap > 7) flags.push('hits_daily_cap_often');
    
    // Flag 2: High attempt rate
    const attemptsPerDay = userAttempts.length / 30;
    if (attemptsPerDay > 20) flags.push('high_attempt_rate');
    
    // Flag 3: Low score variance (bot-like behavior)
    const scores = userAttempts.filter(a => a.score).map(a => a.score);
    if (scores.length > 10) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / scores.length;
      if (variance < 50) flags.push('low_score_variance');
    }
    
    // Flag 4: Earned too much too fast
    const earnedNim = user.earnedLuna / 100000;
    const accountAgeHours = (Date.now() - new Date(user.createdAt).getTime()) / 3600000;
    if (accountAgeHours < 168 && earnedNim > 100) flags.push('rapid_earnings');
    
    if (flags.length >= 2) {
      suspicious.push({
        userId: user.id,
        username: user.username,
        flags,
        earned: Math.round(earnedNim),
        attempts: userAttempts.length,
        accountAge: Math.round(accountAgeHours / 24) + ' days',
      });
    }
  }
  
  return suspicious.sort((a, b) => b.flags.length - a.flags.length);
}

/* ── USER ACTIVITY LOGS ────────────────────────────────────────────────── */
route('GET', '/api/admin/users/:id/activity', async (ctx) => {
  const { params, res } = ctx;
  
  // TODO: Add admin authentication
  
  const user = await store.get('users', params.id);
  if (!user) throw httpError(404, 'NOT_FOUND', 'User not found');
  
  const [attempts, txs, skills, achievements] = await Promise.all([
    store.filter('attempts', a => a.userId === params.id),
    store.filter('wallet_txs', t => t.userId === params.id),
    store.filter('user_skills', s => s.userId === params.id),
    store.filter('user_achievements', a => a.userId === params.id),
  ]);
  
  json(res, 200, {
    user: {
      id: user.id,
      username: user.username,
      level: user.level,
      xp: user.xp,
      reputation: user.reputation,
      balance: Math.round(user.balanceLuna / 100000),
      earned: Math.round(user.earnedLuna / 100000),
      proofsPassed: user.proofsPassed,
      proofsAttempted: user.proofsAttempted,
      streak: user.streak,
      createdAt: user.createdAt,
      isDemo: user.isDemo,
    },
    activity: {
      attempts: attempts.length,
      passed: attempts.filter(a => a.status === 'passed').length,
      failed: attempts.filter(a => a.status === 'failed').length,
      averageScore: Math.round(attempts.reduce((s, a) => s + (a.score || 0), 0) / attempts.length),
    },
    economy: {
      totalTransactions: txs.length,
      rewardsReceived: txs.filter(t => t.kind.includes('reward') && t.direction === 'credit').length,
      tips: {
        received: txs.filter(t => t.kind === 'tip' && t.direction === 'credit').length,
        sent: txs.filter(t => t.kind === 'tip' && t.direction === 'debit').length,
      },
    },
    skills: skills.map(s => ({
      skill: s.skillSlug,
      score: s.score,
      tier: s.tier,
      verified: s.verified,
    })),
    achievements: achievements.length,
    recentActivity: attempts
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 20)
      .map(a => ({
        challengeId: a.challengeId,
        status: a.status,
        score: a.score,
        rewarded: a.rewarded,
        timestamp: a.submittedAt,
      })),
  });
});

/* ── REAL-TIME METRICS ────────────────────────────────────────────────── */
route('GET', '/api/admin/metrics/realtime', async (ctx) => {
  const { res } = ctx;
  
  // TODO: Add admin authentication
  
  const now = Date.now();
  const last24h = now - 86400000;
  const last1h = now - 3600000;
  
  const [attempts, txs] = await Promise.all([
    store.all('attempts'),
    store.all('wallet_txs'),
  ]);
  
  const recent24h = attempts.filter(a => new Date(a.submittedAt || a.createdAt).getTime() > last24h);
  const recent1h = attempts.filter(a => new Date(a.submittedAt || a.createdAt).getTime() > last1h);
  
  const txs24h = txs.filter(t => new Date(t.createdAt).getTime() > last24h);
  
  json(res, 200, {
    timestamp: new Date().toISOString(),
    last24Hours: {
      attempts: recent24h.length,
      passed: recent24h.filter(a => a.status === 'passed').length,
      activeUsers: [...new Set(recent24h.map(a => a.userId))].length,
      nimDistributed: Math.round(txs24h
        .filter(t => t.direction === 'credit' && t.kind.includes('reward'))
        .reduce((s, t) => s + t.amountLuna, 0) / 100000),
    },
    lastHour: {
      attempts: recent1h.length,
      passed: recent1h.filter(a => a.status === 'passed').length,
      activeUsers: [...new Set(recent1h.map(a => a.userId))].length,
    },
  });
});
```

---

## 🖥️ Admin Dashboard UI (React)

Create a simple admin dashboard component:

```typescript
// web-react/src/pages/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';

interface Analytics {
  users: {
    total: number;
    new: number;
    demo: number;
    real: number;
    active: number;
  };
  activity: {
    totalAttempts: number;
    passedAttempts: number;
    failedAttempts: number;
    averageScore: number;
  };
  economy: {
    totalDistributed: number;
    totalCirculating: number;
    averageBalance: number;
    rewardsToday: number;
  };
  topUsers: Array<{
    username: string;
    level: number;
    earned: number;
    proofs: number;
  }>;
  suspicious: Array<{
    username: string;
    flags: string[];
    earned: number;
    attempts: number;
  }>;
}

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    // Refresh every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`, {
        credentials: 'include',
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>No data available</div>;

  return (
    <div className="admin-dashboard">
      <h1>📊 Platform Analytics</h1>

      {/* Time Range Selector */}
      <div className="time-range">
        <button onClick={() => setTimeRange('24h')} className={timeRange === '24h' ? 'active' : ''}>
          24 Hours
        </button>
        <button onClick={() => setTimeRange('7d')} className={timeRange === '7d' ? 'active' : ''}>
          7 Days
        </button>
        <button onClick={() => setTimeRange('30d')} className={timeRange === '30d' ? 'active' : ''}>
          30 Days
        </button>
        <button onClick={() => setTimeRange('all')} className={timeRange === 'all' ? 'active' : ''}>
          All Time
        </button>
      </div>

      {/* User Metrics */}
      <section className="metrics-section">
        <h2>👥 Users</h2>
        <div className="metrics-grid">
          <MetricCard title="Total Users" value={analytics.users.total} icon="👥" />
          <MetricCard title="New Users" value={analytics.users.new} icon="🆕" />
          <MetricCard title="Active Users" value={analytics.users.active} icon="🟢" />
          <MetricCard 
            title="Real Wallets" 
            value={`${analytics.users.real} (${Math.round(analytics.users.real / analytics.users.total * 100)}%)`} 
            icon="💳" 
          />
        </div>
      </section>

      {/* Activity Metrics */}
      <section className="metrics-section">
        <h2>📈 Activity</h2>
        <div className="metrics-grid">
          <MetricCard title="Total Attempts" value={analytics.activity.totalAttempts} icon="📝" />
          <MetricCard title="Passed" value={analytics.activity.passedAttempts} icon="✅" color="green" />
          <MetricCard title="Failed" value={analytics.activity.failedAttempts} icon="❌" color="red" />
          <MetricCard title="Avg Score" value={`${analytics.activity.averageScore}%`} icon="📊" />
        </div>
      </section>

      {/* Economy Metrics */}
      <section className="metrics-section">
        <h2>💰 Economy</h2>
        <div className="metrics-grid">
          <MetricCard title="NIM Distributed" value={`${analytics.economy.totalDistributed} NIM`} icon="💸" />
          <MetricCard title="Total Circulating" value={`${analytics.economy.totalCirculating} NIM`} icon="💎" />
          <MetricCard title="Avg Balance" value={`${analytics.economy.averageBalance} NIM`} icon="💰" />
          <MetricCard title="Rewards Today" value={`${analytics.economy.rewardsToday} NIM`} icon="🎁" />
        </div>
      </section>

      {/* Top Users */}
      <section className="metrics-section">
        <h2>🏆 Top Earners</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Level</th>
              <th>Earned</th>
              <th>Proofs</th>
            </tr>
          </thead>
          <tbody>
            {analytics.topUsers.map(user => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>Level {user.level}</td>
                <td>{user.earned} NIM</td>
                <td>{user.proofs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Suspicious Activity */}
      {analytics.suspicious.length > 0 && (
        <section className="metrics-section alert">
          <h2>⚠️ Suspicious Activity Detected</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Flags</th>
                <th>Earned</th>
                <th>Attempts</th>
              </tr>
            </thead>
            <tbody>
              {analytics.suspicious.map(user => (
                <tr key={user.username} className="warning-row">
                  <td>{user.username}</td>
                  <td>
                    {user.flags.map(flag => (
                      <span key={flag} className="flag-badge">{flag}</span>
                    ))}
                  </td>
                  <td className="highlight">{user.earned} NIM</td>
                  <td>{user.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon, color }: any) {
  return (
    <div className={`metric-card ${color || ''}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-title">{title}</div>
    </div>
  );
}
```

---

## 📊 Simple SQL Queries (For Supabase Dashboard)

If you're using Supabase, you can run these queries directly in the SQL editor:

### 1. User Count & Growth

```sql
-- Total users
SELECT COUNT(*) as total_users FROM "User";

-- New users today
SELECT COUNT(*) as new_today 
FROM "User" 
WHERE "createdAt"::date = CURRENT_DATE;

-- New users this week
SELECT COUNT(*) as new_this_week 
FROM "User" 
WHERE "createdAt" >= NOW() - INTERVAL '7 days';

-- Growth over time (daily)
SELECT 
  "createdAt"::date as date,
  COUNT(*) as new_users
FROM "User"
GROUP BY "createdAt"::date
ORDER BY date DESC
LIMIT 30;
```

### 2. Active Users

```sql
-- Active users today (made an attempt)
SELECT COUNT(DISTINCT "userId") as active_today
FROM "ChallengeAttempt"
WHERE "submittedAt"::date = CURRENT_DATE;

-- Active users this week
SELECT COUNT(DISTINCT "userId") as active_this_week
FROM "ChallengeAttempt"
WHERE "submittedAt" >= NOW() - INTERVAL '7 days';
```

### 3. Economy Metrics

```sql
-- Total NIM distributed
SELECT 
  SUM("amountLuna") / 100000.0 as total_nim_distributed
FROM "WalletTransaction"
WHERE direction = 'credit' 
  AND kind LIKE '%reward%'
  AND status = 'completed';

-- NIM distributed today
SELECT 
  SUM("amountLuna") / 100000.0 as nim_today
FROM "WalletTransaction"
WHERE direction = 'credit' 
  AND kind LIKE '%reward%'
  AND status = 'completed'
  AND "createdAt"::date = CURRENT_DATE;

-- Total circulating NIM
SELECT 
  SUM("balanceLuna") / 100000.0 as total_circulating
FROM "User";
```

### 4. Top Users

```sql
-- Top earners
SELECT 
  username,
  level,
  "earnedLuna" / 100000.0 as earned_nim,
  "proofsPassed"
FROM "User"
ORDER BY "earnedLuna" DESC
LIMIT 10;

-- Most active users (by attempts)
SELECT 
  u.username,
  COUNT(a.id) as total_attempts,
  SUM(CASE WHEN a.status = 'passed' THEN 1 ELSE 0 END) as passed
FROM "User" u
JOIN "ChallengeAttempt" a ON a."userId" = u.id
GROUP BY u.id, u.username
ORDER BY total_attempts DESC
LIMIT 10;
```

### 5. Suspicious Activity Detection

```sql
-- Users hitting daily cap frequently
SELECT 
  u.username,
  u."earnedLuna" / 100000.0 as total_earned,
  COUNT(DISTINCT DATE(t."createdAt")) as days_with_rewards,
  u."createdAt"::date as account_created
FROM "User" u
JOIN "WalletTransaction" t ON t."userId" = u.id
WHERE t.kind LIKE '%reward%' 
  AND t.direction = 'credit'
  AND t."createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.username, u."earnedLuna", u."createdAt"
HAVING SUM(t."amountLuna") / 100000.0 > 400  -- More than 400 NIM in 30 days
ORDER BY total_earned DESC;

-- High frequency attempters
SELECT 
  u.username,
  COUNT(a.id) as attempts_last_24h,
  u."createdAt"::date as account_age
FROM "User" u
JOIN "ChallengeAttempt" a ON a."userId" = u.id
WHERE a."submittedAt" >= NOW() - INTERVAL '24 hours'
GROUP BY u.id, u.username, u."createdAt"
HAVING COUNT(a.id) > 20  -- More than 20 attempts in 24h
ORDER BY attempts_last_24h DESC;
```

---

## 🔔 Alerts & Monitoring

### Automated Alerts (Email/Slack)

```javascript
// server/monitoring.js

export async function checkAndAlert(store) {
  const alerts = [];
  
  // Check 1: Pool usage spike
  const todayRewards = await getTodayRewards(store);
  if (todayRewards > 20000) {
    alerts.push({
      level: 'warning',
      message: `High pool usage: ${todayRewards} NIM distributed today`,
    });
  }
  
  // Check 2: New accounts spike
  const newUsers = await getNewUsersToday(store);
  if (newUsers > 100) {
    alerts.push({
      level: 'warning',
      message: `Account creation spike: ${newUsers} new users today`,
    });
  }
  
  // Check 3: Suspicious user
  const suspicious = await detectSuspiciousActivity(store, Date.now() - 86400000);
  if (suspicious.length > 5) {
    alerts.push({
      level: 'alert',
      message: `${suspicious.length} suspicious accounts detected`,
      users: suspicious.map(s => s.username),
    });
  }
  
  // Send alerts (implement your preferred method)
  if (alerts.length > 0) {
    await sendAlerts(alerts); // Email, Slack, Discord, etc.
  }
  
  return alerts;
}

// Run every hour
setInterval(() => checkAndAlert(store), 3600000);
```

---

## 🎯 Quick Implementation Steps

### 1. Add Analytics Endpoints (5 minutes)
Copy the analytics routes from above into `server/index.js`

### 2. Create Admin Dashboard Page (30 minutes)
Create `AdminDashboard.tsx` component in your React app

### 3. Add Admin Authentication (10 minutes)
```javascript
// Add isAdmin field to users
// Check in admin routes:
if (!user?.isAdmin) throw httpError(403, 'FORBIDDEN', 'Admin only');
```

### 4. Set Up Monitoring (optional, 1 hour)
- Configure email/Slack webhooks
- Add alert checking cron job
- Set up Supabase dashboard queries

---

## ✅ Summary

**You already have all the data you need!**

✅ **User Identity:** Username, wallet address, creation date  
✅ **User Activity:** Attempts, scores, streaks, proofs  
✅ **Economy:** Earnings, balances, transactions  
✅ **Behavior:** Timestamps, patterns, anomalies  

**Just need to expose it via:**
1. Admin API endpoints (provided above)
2. Admin dashboard UI (provided above)
3. SQL queries for Supabase (provided above)

**Your analytics are comprehensive and ready to deploy!** 📊✅
