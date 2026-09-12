# 🔐 Admin Dashboard - Password Authentication

## Overview

The admin dashboard is protected by a password stored in the `ADMIN_SECRET` environment variable. This is simpler and more secure than database-based admin flags.

---

## ✅ Quick Setup (3 Steps)

### Step 1: Set Admin Password

Edit your `.env` file and set a strong password:

```bash
# .env
ADMIN_SECRET=your-secure-admin-password-here
```

**Security Tip:** Use a strong, random password:
```bash
# Generate a secure password
openssl rand -base64 32
```

### Step 2: Restart Server

```bash
npm run dev
```

### Step 3: Access Dashboard

1. Navigate to: `http://localhost:3000/admin`
2. Enter your admin password
3. Access granted for 24 hours ✅

---

## 🔒 Security Features

### Password-Based Authentication
- ✅ No database modifications needed
- ✅ Password stored securely in environment variable
- ✅ HMAC-signed session tokens (same security as user sessions)
- ✅ 24-hour session expiry
- ✅ HttpOnly cookies (prevents XSS attacks)
- ✅ SameSite=Strict (prevents CSRF attacks)

### Session Management
- Sessions stored server-side with HMAC signatures
- Token format: `{sessionId}.{hmac_signature}`
- Automatic expiry after 24 hours
- Invalid/expired sessions automatically cleaned up
- Logout clears session from both client and server

---

## 🖥️ Using the Dashboard

### Login
1. Go to `/admin` route
2. Enter admin password
3. Session saved for 24 hours

### Logout
- Click "🚪 Logout" button in header
- Session cleared from browser
- Token invalidated on server

### Auto-Refresh
- Dashboard updates every 30 seconds automatically
- Real-time metrics shown in header
- No page reload required

---

## 🛠️ Configuration

### Environment Variables

```bash
# Required - Admin password
ADMIN_SECRET=your-secure-password

# Already exists - Used for HMAC signatures
AUTH_SECRET=your-auth-secret-from-setup
```

### Production Recommendations

1. **Use a Strong Password**
   ```bash
   # Generate secure password
   openssl rand -base64 32
   
   # Or use a passphrase
   ADMIN_SECRET="correct-horse-battery-staple-2024-secure"
   ```

2. **Never Commit Secrets**
   - `.env` is already in `.gitignore`
   - Never commit admin password to version control
   - Use environment variables in production

3. **Rotate Passwords Regularly**
   - Change password every 90 days
   - Change immediately if compromised
   - Update `.env` and restart server

4. **Use HTTPS in Production**
   - Admin sessions use HttpOnly cookies
   - HTTPS prevents man-in-the-middle attacks
   - Required for secure password transmission

---

## 🔧 API Endpoints

### POST `/api/admin/authenticate`

Authenticate with admin password.

**Request:**
```json
{
  "password": "your-admin-password"
}
```

**Response (Success):**
```json
{
  "success": true
}
```

Sets `admin_session` HttpOnly cookie valid for 24 hours.

**Response (Failure):**
```json
{
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "Invalid admin password"
  }
}
```

### GET `/api/admin/analytics?range=24h`

Get analytics dashboard data (requires admin session).

**Cookie Required:** `admin_session={token}`

**Returns:** Full analytics data (users, activity, economy, top earners, suspicious activity)

### GET `/api/admin/metrics/realtime`

Get real-time metrics (requires admin session).

**Cookie Required:** `admin_session={token}`

**Returns:** Last hour and 24h activity metrics

### GET `/api/admin/users/:id/activity`

Get detailed user activity (requires admin session).

**Cookie Required:** `admin_session={token}`

**Returns:** User profile, activity summary, transactions, skills, achievements

---

## 🚨 Troubleshooting

### "Invalid admin password"

**Problem:** Cannot login to admin dashboard

**Solutions:**
1. Check `.env` file has `ADMIN_SECRET` set
2. Verify no extra spaces or quotes around password
3. Restart server after changing `.env`
4. Try copying password directly (no typos)

**Check server logs:**
```bash
# If ADMIN_SECRET not set, you'll see:
# CONFIG_ERROR: Admin secret not configured
```

### "Admin authentication required" (403)

**Problem:** Session expired or invalid

**Solutions:**
1. Click logout and login again
2. Session expires after 24 hours
3. Clear browser cookies and retry
4. Check server is still running

### Dashboard shows login page after authentication

**Problem:** Session cookie not saved

**Solutions:**
1. Check browser allows cookies
2. Verify HttpOnly cookies enabled
3. Try different browser
4. Check browser DevTools → Application → Cookies

### Can't access /admin route

**Problem:** Route not loading

**Solutions:**
1. Verify server is running: `npm run dev`
2. Check correct URL: `http://localhost:3000/admin`
3. Look for errors in browser console
4. Verify `AdminDashboard.tsx` exists in `web-react/src/pages/`

---

## 🔐 Security Best Practices

### Development
- ✅ Use simple memorable password (e.g., `admin123`)
- ✅ Store in `.env` file
- ✅ Never commit to git

### Production
- ✅ Use strong random password (32+ characters)
- ✅ Store in environment variables (not in code)
- ✅ Use HTTPS only
- ✅ Rotate password quarterly
- ✅ Limit access to trusted team members only
- ✅ Monitor admin API access logs
- ✅ Consider IP whitelisting
- ✅ Set up alerting for failed login attempts

### Sharing Access
When sharing admin access with team:
1. Share password securely (1Password, LastPass, etc.)
2. Never send password via email/Slack
3. Use temporary passwords for contractors
4. Change password when someone leaves team

---

## 📊 Session Storage

Admin sessions are stored in memory/database:

```javascript
{
  id: 'adm_abc123',          // Session ID
  createdAt: 1234567890,     // Timestamp
  expiresAt: 1234654290,     // Expiry (24h later)
}
```

Token structure:
```
{sessionId}.{hmac_signature}
adm_abc123.a1b2c3d4e5f6...
```

HMAC payload: `${sessionId}:${createdAt}:${expiresAt}:admin`

Signed with `AUTH_SECRET` for tamper prevention.

---

## 🔄 Comparison: Database vs Password Auth

### ❌ Old Approach (Database isAdmin field)
- Requires database migration
- Need SQL access to grant admin
- Complex user permission management
- isAdmin field in user table

### ✅ New Approach (Password-based)
- Simple environment variable
- No database changes needed
- Single shared password
- Easy to rotate/revoke

---

## 📝 Implementation Details

### Frontend (`AdminDashboard.tsx`)
- Shows login form when not authenticated
- Stores `admin_auth=true` in sessionStorage
- Sends password to `/api/admin/authenticate`
- Session cookie returned by server
- Auto-logout on 403 errors
- Manual logout button in header

### Backend (`server/index.js`)
- `/api/admin/authenticate` endpoint validates password
- Creates HMAC-signed session token
- Sets HttpOnly cookie with 24h expiry
- All admin endpoints call `verifyAdminSession()`
- Invalid/expired sessions return 403

### Security (`verifyAdminSession()`)
```javascript
async function verifyAdminSession(req) {
  // Extract token from cookie
  // Verify HMAC signature
  // Check expiry
  // Return true/false
}
```

---

## ✅ Migration from Database Auth

If you previously used `isAdmin` field:

1. **Keep old code working** (no breaking changes needed)
2. **Remove database field** (optional):
   ```sql
   ALTER TABLE "User" DROP COLUMN IF EXISTS "isAdmin";
   ```
3. **Update documentation** to use `ADMIN_SECRET`
4. **Remove SQL migration file** (no longer needed)

---

## 🎯 Quick Reference

**Setup:**
```bash
# 1. Set password in .env
echo 'ADMIN_SECRET=my-secure-password' >> .env

# 2. Restart server
npm run dev

# 3. Login at /admin
```

**Usage:**
- URL: `http://localhost:3000/admin`
- Password: Value of `ADMIN_SECRET`
- Session: 24 hours
- Logout: Click button in header

**Security:**
- HttpOnly cookies ✅
- HMAC-signed tokens ✅
- 24h expiry ✅
- Server-side validation ✅

---

## 📚 Related Files

- `server/index.js` - Admin endpoints + authentication
- `server/config.js` - `adminSecret` configuration
- `web-react/src/pages/AdminDashboard.tsx` - Login UI + dashboard
- `web-react/src/pages/AdminDashboard.css` - Styling
- `.env` - `ADMIN_SECRET` variable
- `.env.example` - Template with `ADMIN_SECRET`

---

## ✅ Summary

**Authentication Method:** Password-based (environment variable)  
**Session Duration:** 24 hours  
**Security Level:** High (HMAC-signed, HttpOnly, SameSite)  
**Setup Complexity:** Very Simple (1 env var)  
**Management:** Easy password rotation  

**Your admin dashboard is secure and easy to use!** 🔐✨
