# 🔐 Cybersecurity Curriculum Integration

## Overview

We've successfully integrated cybersecurity education into PROOF as the **13th skill**, inspired by [pwn.college](https://pwn.college)'s excellent open-source curriculum from Arizona State University.

---

## What is pwn.college?

**pwn.college** is a comprehensive, hands-on cybersecurity education platform that:
- Powers ASU's cybersecurity curriculum
- Offers free access to anyone worldwide
- Provides interactive "dojos" covering real security topics
- Uses actual vulnerable systems for practice
- Emphasizes learning by doing

### Key Topics Covered by pwn.college
- **Fundamentals**: Linux, command line, scripting
- **Program Security**: Assembly, reverse engineering, binary exploitation
- **Cryptography**: XOR, AES, RSA, cryptographic protocols
- **Web Security**: HTTP, injection attacks, CSRF, SSRF
- **System Security**: Privilege escalation, kernel exploitation
- **Network Security**: Packet analysis, protocol vulnerabilities

---

## Our Integration Approach

### What We Built

**File**: `docs/curriculum/13-CYBERSECURITY.md`

A complete 25-lesson curriculum with:
- **Level 1**: Absolute Beginner (8 lessons, 4 hours)
  - Linux basics, networking, encoding, scripting
  - Introductory cryptography and web security
  
- **Level 2**: Security Fundamentals (9 lessons, 4.5 hours)
  - Assembly language and debugging
  - Reverse engineering and buffer overflows
  - Web vulnerabilities (XSS, SQL injection)
  - Password cracking and network analysis
  
- **Level 3**: Exploitation & Defense (8 lessons, 5 hours)
  - Advanced techniques (ROP, format strings, shellcode)
  - Modern cryptography and web app security
  - Binary exploitation and privilege escalation
  - Security best practices

- **Final Assessment**: Comprehensive CTF challenge (120 min, 12 NIM, 600 XP)

### Ethical Framework

Each lesson includes:
- ✅ Legal and ethical considerations
- ✅ "Only test systems you own or have permission" warnings
- ✅ Responsible disclosure guidelines
- ✅ Career path context (penetration testing, security research)

### How It Differs from pwn.college

| Aspect | pwn.college | Our Curriculum |
|--------|-------------|----------------|
| **Format** | Interactive challenges | Structured lessons + challenges |
| **Environment** | Live vulnerable systems | Educational content + practice prompts |
| **Access** | Web-based dojo | Text-based learning platform |
| **Challenges** | Platform-specific flags | Original type-only proof challenges |
| **Writeups** | Discouraged to protect educational value | No writeups - original challenges only |

**Key Principle**: We teach the **concepts and techniques** from pwn.college's curriculum but require learners to **solve original challenges** rather than the exact ones from pwn.college, respecting their request to avoid public writeups.

---

## Integration Details

### Updated Files

1. **`docs/curriculum/13-CYBERSECURITY.md`** (NEW)
   - Complete 25-lesson cybersecurity curriculum
   - ~26 hours of content
   - 25 lessons + final CTF assessment
   - 12 NIM + 600 XP total rewards

2. **`docs/curriculum/00-MASTER-INDEX.md`** (UPDATED)
   - Added Cybersecurity as 13th skill
   - Updated totals: 312 lessons, ~314 hours
   - Updated rewards: 134 NIM + 6,700 XP
   - Added security professional learning path example

### Curriculum Statistics

**Before Integration:**
- 12 skills
- 287 lessons
- ~288 hours
- 122 NIM + 6,100 XP

**After Integration:**
- 13 skills (+1)
- 312 lessons (+25)
- ~314 hours (+26h)
- 134 NIM + 6,700 XP (+12 NIM, +600 XP)

---

## Lesson Structure Example

Each cybersecurity lesson follows PROOF's proven format:

```markdown
### Lesson Title (duration)
**Goal**: Clear learning objective

**Content**:
- Topic overview
- Key concepts
- Technical details
- Tools and techniques

**TL;DR**: One-sentence takeaway

**Examples**: Working code/commands

**Practice Questions**: 2-3 with hints

**Key Points**: 4 bullet-point summary

**Common Misconceptions**: What people get wrong

**Challenge**: Hands-on proof (20-45 min)
- Clear requirements
- Realistic scenario
- Type-only submission

**Rubric**: Objective grading criteria (25% each)
```

---

## Learning Paths

### Path 1: Complete Beginner → Security Analyst
```
Month 1: Web Development (Levels 1-2)
Month 2: Python (Levels 1-2)
Month 3: Cybersecurity (All Levels)
Result: Junior security analyst ready
```

### Path 2: Developer → Application Security
```
Week 1-2: Cybersecurity Level 1
Week 3-4: Cybersecurity Level 2 (Web focus)
Week 5-6: Cybersecurity Level 3
Week 7: Final CTF
Result: AppSec engineer with offensive mindset
```

### Path 3: Bug Bounty Hunter Path
```
Prerequisites: Python, Web Development
Month 1: Cybersecurity Levels 1-2
Month 2: Cybersecurity Level 3
Month 3: Practice on platforms (pwn.college, HackTheBox)
Result: Bug bounty ready with proven skills
```

---

## Resources & References

### Practice Platforms (Recommended)
1. **[pwn.college](https://pwn.college)** - Hands-on challenges (FREE)
2. **HackTheBox** - Real-world penetration testing
3. **TryHackMe** - Guided learning rooms
4. **OverTheWire** - Command line and scripting
5. **PicoCTF** - Beginner-friendly competitions

### Essential Tools
- **Analysis**: gdb, Ghidra, IDA Free, radare2
- **Exploitation**: pwntools, metasploit, ROPgadget
- **Web Testing**: Burp Suite, ZAP, curl
- **Network**: Wireshark, tcpdump, nmap
- **Scripting**: Python, bash

### Communities
- pwn.college Discord - Very active learning community
- r/netsec - Security news and discussion
- CTFtime - Competition calendar
- HackerOne - Bug bounty platform

---

## Implementation Notes

### Challenge Design Philosophy

Our challenges are **inspired by** pwn.college but **original** to maintain:
1. **Educational Integrity**: Respecting pwn.college's "no writeups" policy
2. **Type-Only Proofs**: Consistent with PROOF's anti-cheat approach
3. **Portfolio Value**: Each challenge produces demonstrable work
4. **Scalability**: Server-side grading without manual review

### Topics Requiring Special Setup

Some advanced topics may need:
- **Isolated Environments**: VMs or containers for exploitation practice
- **Vulnerable Applications**: Purpose-built test targets
- **Network Simulation**: Virtual networks for traffic analysis
- **Binary Challenges**: Custom vulnerable binaries

**Recommendation**: Start with conceptual teaching and add hands-on labs progressively.

---

## Ethical & Legal Considerations

### Built-In Safety Measures

1. **Every lesson** includes ethical warnings
2. **Authorization emphasis** throughout curriculum
3. **Legal context** for different jurisdictions
4. **Responsible disclosure** taught explicitly
5. **Career guidance** toward legitimate security work

### User Agreement Suggestions

Before accessing cybersecurity content, users should agree:
- ✅ Only test systems they own or have written permission
- ✅ Use skills for educational and defensive purposes
- ✅ Follow responsible disclosure for found vulnerabilities
- ✅ Understand that unauthorized access is illegal
- ✅ Respect pwn.college's request for no public writeups

---

## Future Expansion Possibilities

### Level 4: Advanced (Optional)
- Kernel exploitation
- Browser security
- Mobile app security
- IoT/embedded systems
- Malware analysis
- Red team operations

### Specialized Tracks
- **Web AppSec Focus**: Deep dive into OWASP Top 10
- **Binary Exploitation**: Advanced heap exploitation, kernel bugs
- **Network Security**: Protocol analysis, wireless security
- **Cryptography**: Zero-knowledge proofs, blockchain security
- **Cloud Security**: AWS/Azure security, container escapes

### Certifications Alignment
Map curriculum to preparation for:
- CompTIA Security+
- CEH (Certified Ethical Hacker)
- OSCP (Offensive Security Certified Professional)
- GPEN (GIAC Penetration Tester)

---

## Success Metrics

### Learner Outcomes
- Complete understanding of common vulnerabilities
- Ability to think like an attacker (with ethical boundaries)
- Practical skills for security careers
- Portfolio of demonstrated security knowledge

### Business Value
- Attracts security-minded learners
- Differentiates PROOF from coding-only platforms
- Creates pathway to high-value security careers
- Builds community around ethical hacking

### Platform Integration
- Cybersecurity paths generate engagement
- Cross-skill learning (Python + Security, Web + Security)
- Higher-value skill badges (12 NIM vs 10 NIM)
- Premium content opportunity

---

## Acknowledgments

This curriculum would not be possible without:

- **pwn.college team** at Arizona State University
- **Yan Shoshitaishvili** and colleagues for open education
- The **broader InfoSec community** for sharing knowledge
- **Capture The Flag** community for gamifying security education

We respect pwn.college's request to not publish writeups by teaching concepts and creating original challenges.

---

## Next Steps

### Immediate (Week 1-2)
- [ ] Review cybersecurity curriculum for accuracy
- [ ] Validate lesson durations and difficulty
- [ ] Design challenge submission format
- [ ] Create sample vulnerable applications

### Short-term (Month 1)
- [ ] Build infrastructure for safe challenge testing
- [ ] Create automated grading rubrics
- [ ] Set up isolated practice environments
- [ ] Write detailed challenge descriptions

### Medium-term (Months 2-3)
- [ ] Beta test with security-interested users
- [ ] Gather feedback on difficulty and clarity
- [ ] Adjust content based on completion rates
- [ ] Add supplementary materials (videos, diagrams)

### Long-term (Months 4-6)
- [ ] Integrate with learning path recommendations
- [ ] Create certification program
- [ ] Build community features (CTF competitions)
- [ ] Partner with security companies for placement

---

## Contact & Resources

**pwn.college**
- Website: https://pwn.college
- Discord: https://discord.gg/pwncollege
- GitHub: https://github.com/pwncollege
- Email: [email protected]

**Our Implementation**
- Curriculum File: `docs/curriculum/13-CYBERSECURITY.md`
- Master Index: `docs/curriculum/00-MASTER-INDEX.md`
- This Document: `docs/CYBERSECURITY-INTEGRATION.md`

---

## Conclusion

By integrating cybersecurity education inspired by pwn.college, PROOF now offers:

✅ **Complete skill coverage** - From web dev to ethical hacking  
✅ **Career-relevant training** - High-demand security skills  
✅ **Ethical framework** - Responsible security education  
✅ **Progressive learning** - Beginner to advanced exploitation  
✅ **Verified skills** - Type-only proofs prevent cheating  
✅ **Open-source spirit** - Built on excellent educational resources  

**Result**: A comprehensive learning platform that takes motivated individuals from zero to cybersecurity professional with verified, portfolio-ready skills.

---

*Last Updated: September 2026*  
*Status: Ready for implementation*  
*Inspired by: [pwn.college](https://pwn.college)*
