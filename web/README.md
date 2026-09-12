# Old Web Directory - Deprecated

⚠️ **This directory is deprecated and will be removed soon.**

## Status

The old HTML/CSS/Vanilla JS frontend has been **replaced** by the new React-based frontend.

## New Frontend Location

👉 **Active Frontend:** `../web-react/`

```bash
cd ../web-react
npm install
npm run dev
```

## What's Here

This directory now only contains:
- Original asset files (for reference)
- SEO configuration files (copied to web-react/public/)
- Empty js/ directory

**All functionality has been migrated to the React app.**

## Cleanup History

- ✅ All CSS files removed (10 files)
- ✅ All JavaScript files removed (15+ files)
- ✅ index.html removed
- ✅ Assets migrated to web-react/public/
- ✅ Full backup created in web-old-backup/

See `../CLEANUP-SUMMARY.md` for complete details.

## Next Steps

1. **Test the React app** thoroughly
2. **Verify all features** work as expected
3. **Remove this directory** once confident:
   ```powershell
   Remove-Item -Path "c:\Users\princ\Downloads\proofhang\PROOF\web" -Recurse -Force
   ```

## Rollback

If needed, restore from backup:
```powershell
Copy-Item -Path "../web-old-backup/*" -Destination "./" -Recurse -Force
```

---

**Last Updated:** September 10, 2026
**Status:** Deprecated - Use web-react instead
