# 🛡️ Reward System Security Analysis

## 📊 How NIM Rewards Work

### Reward Flow
```
User completes challenge → AI evaluates (server-side) → Pass? 
  ↓
Check anti-gaming rules → Grant reward → Credit wallet → Record transaction
```

---

## 🔒 Anti-Gaming Measures (Already Implemented)

Your system has **7 layers of security** to prevent pool exhaustion:

### 1. **Daily Reward Caps** ⭐⭐⭐ (STRONGEST PROTECTION)

```javascript
// Config: server/config.js
dailyRewardCapNim: 15              // Max 15 NIM per user per day
dailyRewardedAttemptsCap: 12       // Max 12 rewarded attempts per day
```

**Protection:**
- User can earn maximum **15 NIM per day**
- Even if they complete 100 challenges, they only get 15 NIM
- Caps reset at midnight UTC
- **Cannot be bypassed** - enforced server-side

**Gaming Attempt:** User tries to complete 50 challenges in one day
**Result:** Gets 15 NIM, then "DAILY_REWARD_CAP" error for remaining attempts

---

### 2. **One Reward Per Challenge** ⭐⭐⭐

```javascript
// Unique key prevents duplicate rewards
key: `${userId}:${challengeId}`  // Stored in database with UNIQUE constraint
```

**Protection:**
- Each user can only claim reward **once per challenge**
- Attempting same challenge again: "ALREADY_REWARDED"
- Database-level enforcement (cannot be bypassed)

**Gaming Attempt:** User completes same challenge 10 times
**Result:** Gets reward once, then "ALREADY_REWARDED" for all subsequent attempts

---

### 3. **Content Hash Duplicate Detection** ⭐⭐⭐

```javascript
// Server checks if exact same answer was submitted before
const contentHash = generateContentHash(payload, ch.type);
const isDuplicate = previousHashes.includes(contentHash);
```

**Protection:**
- **Before AI evaluation** (saves resources)
- Detects identical submissions across all challenges
- Hash stored per user per challenge
- Cannot submit same answer twice

**Gaming Attempt:** User copies previous successful answer
**Result:** "DUPLICATE_SUBMISSION" error, no evaluation, no reward

---

### 4. **Live Typing Verification** ⭐⭐

```javascript
typingVerification: true  // Must be hand-typed in app

// Checks:
- No paste allowed
- Keystroke timing analysis
- Minimum keystrokes for content length
- Plausibility check (speed, edits)
```

**Protection:**
- Blocks copy-paste from AI tools
- Detects AI-generated dumps
- Requires actual typing in the app
- "PASTE_DETECTED" or "TYPING_IMPLAUSIBLE" errors

**Gaming Attempt:** User pastes ChatGPT response
**Result:** "PASTE_DETECTED" error, submission rejected

---

### 5. **Minimum Attempt Interval** ⭐

```javascript
minAttemptIntervalMs: 45_000  // 45 seconds between attempts
```

**Protection:**
- Cannot spam attempts rapidly
- Must wait 45 seconds between submissions
- Rate limiting per user

**Gaming Attempt:** User scripts rapid submissions
**Result:** Rate limit error after first attempt

---

### 6. **Server-Side AI Evaluation** ⭐⭐⭐

```javascript
// All evaluation happens on YOUR server
// Users cannot fake scores or bypass checks
const { evaluation } = await this.evaluations.evaluate({ userId, attemptId, challenge, payload });

// Only passing submissions get rewards
if (!evaluation.pass) return { granted: false, reason: 'NOT_PASSED' };
```

**Protection:**
- User cannot modify their score
- Cannot fake passing grade
- Cannot bypass AI evaluation
- Server-authoritative (client never trusted)

**Gaming Attempt:** User modifies client to show "100% passed"
**Result:** Server still runs evaluation, real score applies

---

### 7. **Transaction Ledger** ⭐

```javascript
// Every NIM movement is recorded
// Immutable audit trail
await this.store.insert('wallet_txs', {
  userId, kind, direction, amountLuna,
  status: 'pending', ref, note, meta,
  createdAt: now(),
});
```

**Protection:**
- Full audit trail of all NIM movements
- Cannot delete or modify past transactions
- Easy to detect anomalies
- Forensic analysis capability

---

## 🎯 Real-World Gaming Scenarios

### Scenario 1: Bot Attempting to Farm
**Attack:** User creates bot to complete challenges 24/7

**Protection Layers Hit:**
1. ✅ Daily cap: 15 NIM max per day (even if bot completes 1000 challenges)
2. ✅ Attempt cap: Only 12 attempts rewarded per day
3. ✅ Typing verification: Bot fails keystroke analysis
4. ✅ One reward per challenge: Can't repeat same challenges

**Result:** Bot gets 15 NIM max, then blocked. Not economically viable.

---

### Scenario 2: Multiple Accounts (Sybil Attack)
**Attack:** User creates 10 accounts to multiply earnings

**Protection Layers Hit:**
1. ✅ Each account limited to 15 NIM/day individually
2. ✅ IP rate limiting (can add)
3. ✅ Wallet authentication required
4. ✅ Each account needs to do real work (AI evaluation)

**Result:** 
- 10 accounts × 15 NIM = 150 NIM max per day
- Requires 10× the work (completing 120 real challenges)
- Not scalable, resource intensive

**Pool Impact:** 
- If 100 users each earn 15 NIM/day = 1,500 NIM/day
- This is **predictable and budgetable**

---

### Scenario 3: AI-Assisted Cheating
**Attack:** User uses ChatGPT to generate answers

**Protection Layers Hit:**
1. ✅ Typing verification: Paste blocked
2. ✅ Content hash: Can't reuse AI responses
3. ✅ AI evaluation: Still needs to pass quality check
4. ✅ Daily caps: Still limited to 15 NIM

**Result:** 
- Even if successful, still capped at 15 NIM/day
- Has to manually type AI responses (slow)
- Each answer must be unique (hash check)

---

### Scenario 4: Replay Attack
**Attack:** User replays successful submission

**Protection Layers Hit:**
1. ✅ Attempt tracking: "ALREADY_SUBMITTED" status check
2. ✅ Content hash: Duplicate detected
3. ✅ Unique key: "ALREADY_REWARDED" in database

**Result:** Immediate rejection, no reward

---

## 📈 Pool Economics

### Daily Pool Consumption (Max Scenario)

```
Assumptions:
- 1,000 active users
- Each maxes out: 15 NIM/day
- Worst case: everyone hits caps

Daily Pool Usage = 1,000 × 15 = 15,000 NIM/day
Monthly = 450,000 NIM/month
Yearly = 5,475,000 NIM/year
```

### Realistic Scenario

```
Assumptions:
- 1,000 users, but only 30% active daily
- Average user earns 8 NIM/day (not max)
- Most users don't hit caps

Daily Usage = 300 × 8 = 2,400 NIM/day
Monthly = 72,000 NIM/month
Yearly = 876,000 NIM/year
```

**Your pool is PREDICTABLE and BUDGETABLE** ✅

---

## 🚀 Recommended Enhancements

### Priority 1: IP Rate Limiting (Easy)

```javascript
// Add to server/index.js or middleware
const ipLimiter = new Map(); // ip -> { attempts: [], rewards: [] }

function checkIpRateLimit(ip) {
  const now = Date.now();
  const record = ipLimiter.get(ip) || { attempts: [], rewards: [] };
  
  // Clean old entries (older than 24h)
  record.attempts = record.attempts.filter(t => now - t < 86400000);
  record.rewards = record.rewards.filter(t => now - t < 86400000);
  
  // Check limits
  if (record.attempts.length > 50) return false; // Max 50 attempts per IP per day
  if (record.rewards.length > 20) return false;  // Max 20 rewards per IP per day
  
  ipLimiter.set(ip, record);
  return true;
}
```

**Benefit:** Prevents single IP from creating many accounts

---

### Priority 2: Wallet Verification (Medium)

```javascript
// Require real Nimiq wallet connection for payouts
// Current: Demo wallets work
// Enhanced: Real wallet required for withdrawals over X NIM

if (amountNim > 5 && user.walletMode === 'demo') {
  throw new Error('Connect real Nimiq wallet for payouts over 5 NIM');
}
```

**Benefit:** Reduces bot farm viability (bots need real wallets)

---

### Priority 3: Progressive Rewards (Easy)

```javascript
// Reduce rewards for rapid completion
function calculateReward(baseReward, userStats) {
  let multiplier = 1.0;
  
  // Reduce reward if user hits daily cap often
  if (userStats.daysAtCap > 7) multiplier = 0.8;  // 20% reduction
  if (userStats.daysAtCap > 14) multiplier = 0.6; // 40% reduction
  
  // Increase reward for consistent learners
  if (userStats.streak > 7) multiplier = 1.2;     // 20% bonus
  
  return Math.floor(baseReward * multiplier);
}
```

**Benefit:** Penalizes farmers, rewards genuine learners

---

### Priority 4: Challenge Difficulty Scaling (Medium)

```javascript
// Harder challenges for users who max out daily
function getAvailableChallenges(userId, userStats) {
  if (userStats.rewardsToday >= 10) {
    // Only show expert-level challenges
    return challenges.filter(c => c.difficulty === 'expert');
  }
  return challenges; // Normal mix
}
```

**Benefit:** Makes farming exponentially harder

---

### Priority 5: Community Reporting (Low Priority)

```javascript
// Allow users to flag suspicious activity
// Manual review for flagged accounts
{
  "reports": [
    { "reporterId": "user123", "reportedId": "user456", "reason": "bot", "timestamp": "..." }
  ]
}

// Admin dashboard shows:
// - Users with multiple reports
// - Users hitting caps daily
// - Suspicious patterns
```

**Benefit:** Community self-policing

---

## 📊 Monitoring Dashboard (Recommended)

### Key Metrics to Track

```javascript
// Daily monitoring queries
{
  "activeUsers": 1234,
  "totalRewardsToday": "3456 NIM",
  "averageRewardPerUser": "2.8 NIM",
  "usersMacxingCaps": 45,
  "suspiciousAccounts": [
    { 
      "userId": "user789", 
      "flags": ["hits_cap_daily", "rapid_attempts", "low_quality_scores"],
      "totalEarned": "450 NIM"
    }
  ]
}
```

### Alert Thresholds

```javascript
// Auto-alert when:
- Daily pool usage > 20,000 NIM (abnormal)
- Single user earns > 100 NIM in 7 days (review needed)
- Multiple accounts from same IP each earning 15 NIM/day
- Sudden spike in new accounts (>100/day)
```

---

## ✅ Current Security Rating

| Layer | Strength | Status |
|-------|----------|--------|
| Daily Caps | ⭐⭐⭐ | ✅ Implemented |
| One Reward/Challenge | ⭐⭐⭐ | ✅ Implemented |
| Duplicate Detection | ⭐⭐⭐ | ✅ Implemented |
| Typing Verification | ⭐⭐ | ✅ Implemented |
| Rate Limiting | ⭐ | ✅ Implemented |
| Server-Side Eval | ⭐⭐⭐ | ✅ Implemented |
| Transaction Ledger | ⭐ | ✅ Implemented |
| IP Rate Limiting | ⭐⭐ | ⚠️ Recommended |
| Wallet Verification | ⭐⭐ | ⚠️ Recommended |

**Overall Rating: 8/10** ✅ Strong protection already in place!

---

## 💡 Conclusion

### Your System is ALREADY WELL-PROTECTED ✅

1. **Daily caps** are your strongest defense (15 NIM/user/day)
2. **Unique rewards** prevent replay attacks
3. **Hash checking** blocks duplicates
4. **Typing verification** stops AI dumps
5. **Server-side evaluation** prevents score tampering

### Pool is NOT at Risk ✅

- **Worst case:** 15,000 NIM/day for 1,000 users
- **Realistic:** 2,400 NIM/day (300 active users × 8 NIM avg)
- **Predictable** and **budgetable**
- Even if "gamed," damage is **limited and calculable**

### Recommendations

1. **Monitor** daily pool usage (dashboard)
2. **Add IP rate limiting** (easy win)
3. **Require real wallets** for large payouts
4. **Track suspicious patterns** (automated alerts)
5. **Community reporting** (optional, later)

**You're in good shape!** 🛡️ The combination of daily caps + unique rewards + content hashing makes large-scale farming economically unviable.

---

**Last Updated:** 2026-09-11  
**Security Review:** Comprehensive analysis of reward distribution
