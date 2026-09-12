# 🔐 Cybersecurity Implementation Guide

## Quick Start for Developers

This guide helps you implement the cybersecurity curriculum challenges in PROOF.

---

## Challenge Types Overview

### 1. **Conceptual Challenges** (Easy to Implement)
Write explanations, document findings, answer questions
- **Tech needed**: Text validation, keyword matching
- **Examples**: Security policy writing, threat modeling, documentation

### 2. **Command-Line Challenges** (Medium)
Execute Linux commands, analyze output, extract information
- **Tech needed**: Sandbox environment, command execution
- **Examples**: File permissions, network scanning, log analysis

### 3. **Code Challenges** (Medium)
Write security-focused code (input validation, encryption)
- **Tech needed**: Code execution, security testing
- **Examples**: Sanitization functions, secure authentication

### 4. **Binary Analysis** (Advanced)
Analyze compiled programs, reverse engineering
- **Tech needed**: File upload, disassembly tools, debugger access
- **Examples**: Crackmes, buffer overflow analysis

### 5. **Web Exploitation** (Advanced)
Find and exploit web vulnerabilities
- **Tech needed**: Vulnerable web apps, request interception
- **Examples**: XSS, SQL injection, CSRF

---

## Infrastructure Requirements

### Minimum Viable Product (MVP)

```
1. Text Editor
   - Type code/commands
   - Submit for grading

2. Linux Sandbox
   - Docker container
   - Limited privileges
   - Network isolated
   - Auto-reset after use

3. Basic Grading
   - Output matching
   - File presence checks
   - Keyword detection
```

### Full Implementation

```
1. Practice Environment
   - Personal Linux VM per user
   - Pre-installed security tools
   - Vulnerable practice apps
   - Network simulation

2. Challenge Server
   - Hosts vulnerable applications
   - Generates unique flags per user
   - Tracks attempts and hints
   - Provides feedback

3. Advanced Grading
   - Behavior verification
   - Multi-step validation
   - Exploit effectiveness check
   - Code security analysis
```

---

## Implementation Priority

### Phase 1: Conceptual (Weeks 1-2)
**Lessons 1-8** (Level 1: Absolute Beginner)

✅ **Easy to implement** - No complex infrastructure

**What's needed:**
- Text editor with submission
- Keyword-based grading
- File upload for documentation

**Example Challenges:**
```javascript
// Challenge: Write a security policy
const gradeSecurityPolicy = (submission) => {
  const keywords = [
    'confidentiality', 'integrity', 'availability',
    'threat', 'countermeasure', 'risk'
  ];
  
  let score = 0;
  keywords.forEach(word => {
    if (submission.toLowerCase().includes(word)) score += 10;
  });
  
  // Check length
  if (submission.length > 300) score += 20;
  
  // Check structure (paragraphs)
  const paragraphs = submission.split('\n\n').length;
  if (paragraphs >= 3) score += 20;
  
  return {
    score: Math.min(score, 100),
    pass: score >= 70
  };
};
```

### Phase 2: Command-Line (Weeks 3-4)
**Lessons 2-8** (Linux, networking, scripting)

⚠️ **Moderate complexity** - Needs sandboxing

**What's needed:**
- Docker containers for isolation
- Command execution API
- Output capture and validation

**Example Implementation:**
```javascript
// Docker-based sandbox
const executeCommand = async (userId, command, timeoutMs = 5000) => {
  const container = await docker.createContainer({
    Image: 'proof-security-sandbox',
    Cmd: ['bash', '-c', command],
    User: 'sandbox',
    NetworkDisabled: true,
    Memory: 128 * 1024 * 1024, // 128MB
    AttachStdout: true,
    AttachStderr: true
  });
  
  await container.start();
  
  const output = await container.logs({
    stdout: true,
    stderr: true,
    timeout: timeoutMs
  });
  
  await container.remove({ force: true });
  
  return output.toString();
};

// Challenge: Find hidden file
const gradeHiddenFile = async (userId, submittedCommand) => {
  const output = await executeCommand(userId, submittedCommand);
  
  // Check if they found the flag
  const expectedFlag = getUserFlag(userId);
  
  return {
    pass: output.includes(expectedFlag),
    feedback: output.includes(expectedFlag) 
      ? "Correct! You found the hidden flag."
      : "The flag wasn't in your output. Try looking for hidden files."
  };
};
```

### Phase 3: Web Challenges (Weeks 5-6)
**Lessons 8, 13-14** (Web security)

⚠️ **Moderate complexity** - Vulnerable apps needed

**What's needed:**
- Isolated vulnerable web apps per user
- Request logging
- Flag injection system

**Example Setup:**
```javascript
// Spin up vulnerable app instance
const createVulnerableApp = async (userId) => {
  const userFlag = generateUniqueFlag(userId);
  
  const container = await docker.createContainer({
    Image: 'proof-sqli-challenge',
    Env: [
      `FLAG=${userFlag}`,
      `USER_ID=${userId}`
    ],
    ExposedPorts: { '8080/tcp': {} },
    HostConfig: {
      PortBindings: { '8080/tcp': [{ HostPort: '0' }] }
    }
  });
  
  await container.start();
  const info = await container.inspect();
  const port = info.NetworkSettings.Ports['8080/tcp'][0].HostPort;
  
  return {
    url: `http://localhost:${port}`,
    flag: userFlag,
    containerId: container.id
  };
};

// Check if user got the flag
const gradeWebChallenge = async (userId, submittedFlag) => {
  const expectedFlag = getUserFlag(userId);
  
  return {
    pass: submittedFlag === expectedFlag,
    feedback: submittedFlag === expectedFlag
      ? "Success! You exploited the vulnerability."
      : "Incorrect flag. Try analyzing the SQL query more carefully."
  };
};
```

### Phase 4: Binary Challenges (Weeks 7-8)
**Lessons 9-12, 18-20** (Assembly, exploitation)

🔴 **High complexity** - Advanced setup

**What's needed:**
- Compiled binaries with known vulnerabilities
- GDB access for learners
- Memory analysis tools
- Exploit testing framework

**Example Challenge:**
```c
// Vulnerable program (compile with: gcc -fno-stack-protector -z execstack)
#include <stdio.h>
#include <string.h>

void win() {
    printf("FLAG{%s}\n", getenv("USER_FLAG"));
}

void vulnerable() {
    char buffer[64];
    printf("Enter input: ");
    gets(buffer);  // Vulnerable!
    printf("You entered: %s\n", buffer);
}

int main() {
    vulnerable();
    return 0;
}
```

```javascript
// Grading logic
const gradeBinaryExploit = async (userId, submittedPayload) => {
  // Run vulnerable program with user's input
  const output = await runBinary(userId, 'vulnerable', submittedPayload);
  
  // Check if they got the flag
  const userFlag = getUserFlag(userId);
  
  return {
    pass: output.includes(`FLAG{${userFlag}}`),
    crashed: output.includes('Segmentation fault'),
    feedback: output.includes(`FLAG{${userFlag}}`)
      ? "Excellent! You successfully exploited the buffer overflow."
      : output.includes('Segmentation fault')
      ? "You crashed the program. Calculate the exact offset needed."
      : "The program ran normally. Look for a buffer overflow vulnerability."
  };
};
```

---

## Security Considerations

### Sandboxing Requirements

```yaml
Container Configuration:
  # Resource limits
  Memory: 128MB-256MB
  CPU: 0.5 cores max
  Disk: 100MB
  Timeout: 30 seconds
  
  # Network
  Isolated: true
  Internet: false (or whitelist only)
  
  # User permissions
  User: non-root
  Capabilities: minimal
  
  # File system
  Read-only: true (except /tmp)
  No device access: true
```

### User Isolation

```javascript
// Generate unique flags per user
const generateUserFlag = (userId, challengeId) => {
  const secret = process.env.FLAG_SECRET;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(`${userId}:${challengeId}`)
    .digest('hex')
    .substring(0, 16);
  
  return `FLAG{${hash}}`;
};

// Verify user can only access their own challenges
const validateAccess = (userId, challengeInstanceId) => {
  const instance = getChallengeInstance(challengeInstanceId);
  return instance.userId === userId;
};
```

### Input Validation

```javascript
// Sanitize user commands
const sanitizeCommand = (command) => {
  // Block dangerous commands
  const blacklist = [
    'rm -rf', 'dd if=', 'fork bomb',
    ':(){:|:&};:', 'chmod 777',
    'wget', 'curl http'  // unless needed for challenge
  ];
  
  for (const dangerous of blacklist) {
    if (command.includes(dangerous)) {
      throw new Error('Dangerous command detected');
    }
  }
  
  // Limit command length
  if (command.length > 500) {
    throw new Error('Command too long');
  }
  
  return command;
};

// Rate limiting
const checkRateLimit = async (userId) => {
  const key = `rate:${userId}`;
  const attempts = await redis.incr(key);
  await redis.expire(key, 60); // 1 minute window
  
  if (attempts > 10) {
    throw new Error('Rate limit exceeded. Try again in 1 minute.');
  }
};
```

---

## Grading Examples

### Example 1: Linux Command Challenge

```javascript
// Challenge: Find all files with 777 permissions
const gradePermissionChallenge = async (userId, command) => {
  // Setup environment with specific files
  await setupEnvironment(userId, {
    files: [
      { path: '/tmp/secret.txt', permissions: '777' },
      { path: '/tmp/normal.txt', permissions: '644' },
      { path: '/tmp/executable.sh', permissions: '755' },
      { path: '/tmp/hidden/.secret', permissions: '777' }
    ]
  });
  
  // Execute user command
  const output = await executeCommand(userId, command);
  
  // Check results
  const foundFiles = output.split('\n').filter(l => l.trim());
  const expectedFiles = ['/tmp/secret.txt', '/tmp/hidden/.secret'];
  
  const foundAll = expectedFiles.every(f => 
    foundFiles.some(found => found.includes(f))
  );
  
  return {
    pass: foundAll,
    score: (foundFiles.length / expectedFiles.length) * 100,
    feedback: foundAll
      ? "Perfect! You found all files with 777 permissions."
      : `Found ${foundFiles.length}/${expectedFiles.length} files. Did you check hidden directories?`
  };
};
```

### Example 2: XSS Challenge

```javascript
// Challenge: Find XSS vulnerability
const gradeXSSChallenge = async (userId, payload) => {
  // Create vulnerable page instance
  const instance = await createVulnerableApp(userId, 'xss-challenge');
  
  // Submit payload
  const response = await submitForm(instance.url, {
    username: payload
  });
  
  // Check if script executed
  const scriptExecuted = response.includes('<script>') && 
                        response.includes('alert') &&
                        !response.includes('&lt;script&gt;'); // Not escaped
  
  // Check if payload bypassed filters
  const bypassedBasicFilter = !payload.includes('<script>') && 
                              scriptExecuted;
  
  return {
    pass: scriptExecuted,
    advanced: bypassedBasicFilter,
    score: scriptExecuted ? (bypassedBasicFilter ? 100 : 80) : 0,
    feedback: scriptExecuted
      ? bypassedBasicFilter
        ? "Excellent! You bypassed the filter and executed XSS."
        : "Good! XSS executed. Try bypassing the basic filter for full points."
      : "Script didn't execute. Check if your payload is being sanitized."
  };
};
```

### Example 3: Buffer Overflow Challenge

```javascript
// Challenge: Overflow buffer to call win() function
const gradeBufferOverflow = async (userId, payload) => {
  // Get addresses for this user's binary
  const addresses = await getBinaryAddresses(userId, 'buffer-overflow-1');
  
  // Execute binary with payload
  const result = await runBinaryWithInput(userId, 'buffer-overflow-1', payload);
  
  // Check if win() was called
  const winCalled = result.output.includes('FLAG{');
  
  // Check if they used correct offset
  const correctOffset = payload.length === 72 + 8; // buffer + rbp + ret addr
  
  // Check if they targeted win() function
  const targetedWin = payload.includes(
    Buffer.from(addresses.win.toString(16), 'hex')
  );
  
  return {
    pass: winCalled,
    score: winCalled ? 100 : correctOffset ? 50 : targetedWin ? 25 : 0,
    feedback: winCalled
      ? "Perfect! You successfully redirected execution to win()."
      : correctOffset
      ? "Correct offset, but wrong target address. Find win() address."
      : targetedWin
      ? "You found win() but the offset is wrong. Calculate buffer size."
      : "Start by finding the buffer size and the address of win()."
  };
};
```

---

## Hints System

```javascript
// Progressive hint system
const hints = {
  'buffer-overflow-1': [
    {
      cost: 0,
      text: "Use gdb to examine the binary. Set a breakpoint at the vulnerable function."
    },
    {
      cost: 5, // 5 XP
      text: "The buffer is 64 bytes. Don't forget about saved rbp (8 bytes)."
    },
    {
      cost: 10,
      text: "Find win() address using: objdump -d binary | grep '<win>'"
    },
    {
      cost: 20,
      text: "Payload structure: 72 'A's + address of win() in little-endian"
    }
  ]
};

const getHint = async (userId, challengeId, hintIndex) => {
  const hint = hints[challengeId][hintIndex];
  
  if (!hint) return null;
  
  // Deduct XP cost
  await deductXP(userId, hint.cost);
  
  // Record hint usage
  await recordHintUsage(userId, challengeId, hintIndex);
  
  return hint.text;
};
```

---

## Data Models

```javascript
// Challenge progress tracking
const ChallengeProgress = {
  userId: String,
  challengeId: String,
  status: 'not_started' | 'in_progress' | 'completed' | 'failed',
  attempts: Number,
  hintsUsed: [Number],
  timeSpent: Number, // seconds
  completedAt: Date,
  score: Number,
  submissions: [{
    timestamp: Date,
    payload: String,
    result: Object,
    passed: Boolean
  }]
};

// Challenge instance (for isolated environments)
const ChallengeInstance = {
  userId: String,
  challengeId: String,
  containerId: String,
  url: String,
  flag: String,
  createdAt: Date,
  expiresAt: Date,
  status: 'running' | 'stopped'
};
```

---

## Testing Checklist

### Before Launch
- [ ] All challenges tested end-to-end
- [ ] Sandboxes properly isolated
- [ ] Resource limits enforced
- [ ] Flags unique per user
- [ ] Rate limiting implemented
- [ ] Input sanitization working
- [ ] Timeout handling tested
- [ ] Cleanup jobs running
- [ ] Monitoring in place
- [ ] Backup/restore tested

### Security Audit
- [ ] Container escape impossible
- [ ] No sensitive data leaks
- [ ] Network isolation verified
- [ ] User data encrypted
- [ ] Logs don't contain secrets
- [ ] Admin access restricted
- [ ] DDOS protection active
- [ ] Penetration test passed

---

## Monitoring & Metrics

```javascript
// Track challenge health
const metrics = {
  // Performance
  averageCompletionTime: Number,
  averageAttempts: Number,
  
  // Difficulty
  passRate: Number,
  hintUsageRate: Number,
  
  // Infrastructure
  containerCreationTime: Number,
  containerCleanupTime: Number,
  resourceUtilization: Number,
  
  // Engagement
  uniqueAttempts: Number,
  retryRate: Number,
  abandonmentRate: Number
};

// Alert on anomalies
const checkAnomalies = async () => {
  const stats = await getChallengeStats('buffer-overflow-1');
  
  // Too easy?
  if (stats.passRate > 0.95) {
    alert('Challenge may be too easy');
  }
  
  // Too hard?
  if (stats.passRate < 0.10) {
    alert('Challenge may be too difficult');
  }
  
  // Infrastructure issues?
  if (stats.containerCreationTime > 5000) {
    alert('Slow container creation');
  }
};
```

---

## Cost Estimation

### Infrastructure Costs (Monthly)

**Minimal Setup** (100 active users):
- Docker host: $50-100/month
- Database: $20-50/month
- Storage: $10-20/month
- **Total: ~$80-170/month**

**Medium Setup** (1000 active users):
- Multiple Docker hosts: $300-500/month
- Managed database: $100-200/month
- Storage & CDN: $50-100/month
- **Total: ~$450-800/month**

**Large Setup** (10,000 active users):
- Kubernetes cluster: $1000-2000/month
- Managed services: $500-1000/month
- Storage & bandwidth: $200-500/month
- **Total: ~$1700-3500/month**

### Development Time

**Phase 1** (Conceptual): 2-3 weeks
**Phase 2** (Command-line): 3-4 weeks
**Phase 3** (Web challenges): 4-5 weeks
**Phase 4** (Binary challenges): 5-6 weeks

**Total: 14-18 weeks (3.5-4.5 months)**

---

## Conclusion

The cybersecurity curriculum is implementable in phases:

1. ✅ **Start simple** - Text-based challenges first
2. ⚠️ **Add sandboxing** - Docker containers for command execution
3. 🔴 **Advanced features** - Vulnerable apps and binary challenges

Each phase adds value and can generate revenue while building toward the complete vision.

---

*Last Updated: September 2026*  
*For questions: See CYBERSECURITY-INTEGRATION.md*
