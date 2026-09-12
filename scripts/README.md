# 🛠️ PROOF Scripts

Utility scripts for maintaining and fixing the PROOF platform.

## Available Scripts

### `fix-chess-lessons.js`

Automatically fixes all 22 chess lessons:
- Replaces ASCII board diagrams with FEN positions (for interactive boards)
- Adds recall questions to each lesson (3-5 questions per topic)

**Usage:**
```bash
node scripts/fix-chess-lessons.js
```

**What it does:**
1. Creates backup of `server/ai/kb.js`
2. Finds all chess topics
3. Replaces `example.lang: 'text'` with `example.lang: 'fen'`
4. Adds FEN position + description
5. Inserts recall questions before challenge

**Safety:**
- Creates `.backup` file before modifying
- Validates changes before writing
- Can be run multiple times safely (idempotent)

**After running:**
- Restart server: `npm run dev`
- Open any chess lesson
- See interactive board instead of ASCII art
- Recall section will have questions

---

## Adding New Scripts

1. Create script in `scripts/` folder
2. Use ES modules (`import/export`)
3. Add description to this README
4. Test thoroughly before committing

---

## Script Guidelines

- **Always backup** before modifying files
- **Log progress** so users know what's happening
- **Handle errors** gracefully with try/catch
- **Make idempotent** (safe to run multiple times)
- **Test on small data** before full run
