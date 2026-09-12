# 🔐 Admin Dashboard Setup Guide

## Quick Start

### 1. Run Database Migration

Add the `isAdmin` field to existing users:

```bash
# Using Supabase
psql $DATABASE_URL -f database/add-admin-field.sql

# Or run in Supabase SQL Editor
```

### 2. Grant Admin Access to Your Account

**Option A: By Username**
```sql
UPDATE "User" SET "isAdmin" = TRUE WHERE username = 'YourUsername';
```

**Option B: By Wallet Address**
```sql
UPDATE "User" SET "isAdmin" = TRUE WHERE "walletAddress" = 'NQ...';
```

**Option C: By User ID (if you know it)**
```sql
UPDATE "User" SET "isAdmin" = TRUE WHERE id = 'u_abc123';
```

### 3. Access the Dashboard

Navigate to: **`/admin`**

Example: `http://localhost:3000/admin`

---

## Features

### 📊 Main Analytics Dashboard (`/admin`)

- **User Metrics**: Total, new, active, real vs demo
- **Activity Tracking**: Attempts, pass rates, scores
- **Economy Dashboard**: NIM distributed, circulating, balances
- **Top Earners Leaderboard**: Top 10 users by earnings
- **Suspicious Activity Detection**: Auto-flagged abuse patterns
- **Real-time Metrics**: Live updates every 30 seconds
- **Time Range Filters**: 24h / 7d / 30d / All time

### 🚨 Abuse Detection Flags

The system automatically flags suspicious accounts based on:

1. **Daily Cap Abuse**: Hits 15 NIM daily cap 7+ days
2. **High Attempt Rate**: More than 20 attempts per day
3. **Low Score Variance**: Bot-like consistent scores (variance < 50)
4. **Rapid Earnings**: Earned 100+ NIM in first week

Users with 2+ flags appear in the suspicious activity table.

### 📈 Real-Time Metrics

- Last hour activity (attempts, users)
- Last 24 hours (attempts, users, NIM distributed)
- Auto-refreshes every 30 seconds

---

## API Endpoints

All endpoints require `user.isAdmin = true`

### GET `/api/admin/analytics?range=24h`

**Parameters:**
- `range`: `24h`, `7d`, `30d`, or `all`

**Returns:**
```json
{
  "users": { "total": 1234, "new": 45, "demo": 890, "real": 344, "active": 234 },
  "activity": { "totalAttempts": 567, "passedAttempts": 502, "failedAttempts": 65, "averageScore": 85 },
  "economy": { "totalDistributed": 3456, "totalCirculating": 45678, "averageBalance": 37, "rewardsToday": 234 },
  "topUsers": [...],
  "suspicious": [...]
}
```

### GET `/api/admin/users/:id/activity`

Get detailed activity log for a specific user.

**Returns:**
```json
{
  "user": { "id": "u_abc", "username": "SwiftOtter42", "level": 5, ... },
  "activity": { "attempts": 45, "passed": 40, "failed": 5, "averageScore": 87 },
  "economy": { "totalTransactions": 123, "rewardsReceived": 45, "tips": {...} },
  "skills": [...],
  "achievements": 12,
  "recentActivity": [...]
}
```

### GET `/api/admin/metrics/realtime`

Get real-time activity metrics (last hour and last 24 hours).

---

## Security

### Access Control

- Only users with `isAdmin = true` can access admin endpoints
- Returns `403 FORBIDDEN` for non-admin users
- `isAdmin` field cannot be set via API (protected in `users.update()`)
- Must be set directly in database

### Protecting Your Admin Account

1. **Use a real wallet** (not demo) for admin accounts
2. **Keep wallet private key secure**
3. **Grant admin access sparingly** (only trusted team members)
4. **Monitor admin API access** in server logs
5. **Consider IP whitelisting** for production

### Revoking Admin Access

```sql
UPDATE "User" SET "isAdmin" = FALSE WHERE username = 'username';
```

---

## Troubleshooting

### "403 Forbidden" Error

**Problem**: Cannot access `/admin` dashboard

**Solutions:**
1. Check that you're logged in
2. Verify your user has `isAdmin = true`:
   ```sql
   SELECT id, username, "isAdmin" FROM "User" WHERE username = 'YourUsername';
   ```
3. Grant admin access if needed:
   ```sql
   UPDATE "User" SET "isAdmin" = TRUE WHERE username = 'YourUsername';
   ```
4. Clear cookies and log in again

### Dashboard Shows No Data

**Problem**: Analytics show 0 for all metrics

**Possible causes:**
1. No users have attempted challenges yet
2. Time range filter excludes all data (try "All Time")
3. Database connection issue

**Check:**
```sql
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "ChallengeAttempt";
SELECT COUNT(*) FROM "WalletTransaction";
```

### Suspicious Activity False Positives

**Problem**: Legitimate users flagged as suspicious

**Solutions:**
1. Review the specific flags (listed in dashboard)
2. Check individual user activity: `/api/admin/users/:id/activity`
3. Adjust thresholds in `server/index.js` `detectSuspiciousActivity()`:
   - `daysAtCap > 7` → increase to 14 for dedicated users
   - `attemptsPerDay > 20` → increase to 30 for power users
   - `variance < 50` → decrease to 25 for more strict bot detection
   - `earnedNim > 100` in first week → increase to 200

---

## Production Recommendations

### 1. Add IP Rate Limiting

```javascript
// In server/index.js, add rate limiting for admin endpoints
const adminRateLimits = new Map(); // IP -> { count, resetTime }

function checkAdminRateLimit(ip) {
  const now = Date.now();
  const limit = adminRateLimits.get(ip) || { count: 0, resetTime: now + 3600000 };
  
  if (now > limit.resetTime) {
    adminRateLimits.set(ip, { count: 1, resetTime: now + 3600000 });
    return true;
  }
  
  if (limit.count >= 100) { // 100 requests per hour
    throw httpError(429, 'RATE_LIMIT', 'Too many admin requests');
  }
  
  limit.count++;
  return true;
}
```

### 2. Add Audit Logging

```javascript
// Log all admin actions
async function logAdminAction(userId, action, details) {
  await store.insert('admin_logs', {
    id: uid('adm'),
    userId,
    action,
    details,
    ip: req.socket.remoteAddress,
    timestamp: now(),
  });
}
```

### 3. Enable Email/Slack Alerts

Set up notifications for:
- High pool usage (>20,000 NIM per day)
- Suspicious accounts detected (>5 flagged users)
- New admin accounts created
- Failed admin login attempts

### 4. Regular Reviews

Schedule weekly reviews of:
- Suspicious activity reports
- Pool consumption trends
- User growth metrics
- Top earners (validate legitimacy)

---

## Development Tips

### Testing Admin Features

1. Create a test admin user:
   ```sql
   INSERT INTO "User" (id, username, "usernameLower", "isAdmin", "isDemo", "createdAt", "updatedAt")
   VALUES ('u_test_admin', 'TestAdmin', 'testadmin', TRUE, TRUE, NOW(), NOW());
   ```

2. Access dashboard at `/admin`

3. Use browser DevTools Network tab to inspect API responses

### Modifying Analytics

**Add new metrics:**
1. Update `/api/admin/analytics` endpoint in `server/index.js`
2. Add to `Analytics` interface in `AdminDashboard.tsx`
3. Create new metric card or section in component

**Change abuse detection:**
1. Edit `detectSuspiciousActivity()` function
2. Adjust thresholds or add new flags
3. Update flag descriptions in dashboard

---

## Summary

✅ **Set up:** Run migration, grant admin access  
✅ **Access:** Navigate to `/admin`  
✅ **Monitor:** Real-time metrics, suspicious activity  
✅ **Secure:** Admin-only endpoints, protected field  
✅ **Scale:** Ready for production with rate limiting  

**Your analytics system is ready to use!** 📊🔐
