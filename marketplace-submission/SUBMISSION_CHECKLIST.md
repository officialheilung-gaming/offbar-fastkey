# FastKey -- Ulanzi Marketplace Submission Checklist

Forum instructions: https://bbs.ulanzistudio.com/forum.php?mod=viewthread&tid=464&extra=

---

## Files in this folder

| File | Used for | Upload step |
|---|---|---|
| `FastKey.ulanziPlugin` | Main plugin package | Step 1 |
| `images/cover.png` | Listing cover (1600x800, 2:1) | Step 3 |
| `images/banner_01.png` | Detail carousel -- "It types. Not pastes." (900x600, 3:2) | Step 4 |
| `images/banner_02.png` | Detail carousel -- "Multi-step. One press." (900x600, 3:2) | Step 4 |
| `images/banner_03.png` | Detail carousel -- "Any app. Any window. Any speed." (900x600, 3:2) | Step 4 |

---

## Upload Steps (per forum post)

1. **Upload plugin ZIP** -- upload `FastKey.ulanziPlugin`; wait for auto-parse and validation
2. **Auto-check passes** -- confirm no validation errors before proceeding
3. **Upload cover image** -- `images/cover.png` (1600x800)
   - Note: forum says "1:1 for plugins" in one place and "2:1" in the checklist -- verify which ratio the UI accepts
4. **Upload banner images** -- all three from `images/` folder
5. **Fill metadata** -- name, description, tags (use English `en.json` as reference)

---

## Submission Email (send to ustudioservice@ulanzi.com)

Subject: FastKey Plugin Submission -- OffBar (com.offbar.fastkey)

Hi Ulanzi team,

Following up on our recent exchange -- we're ready to submit FastKey for the Community Store.

FastKey is a text expansion and keystroke automation plugin for Ulanzi Studio. It assigns any phrase, script, or command to a key and types it directly into the active window via Windows SendInput -- no clipboard, no paste, hardware-level keystroke injection. Pre-Key, Settle Time, and Type Polling make it reliable across browsers, terminals, IDEs, games, and legacy software.

- UUID: com.offbar.fastkey
- Version: 1.0.0
- Platform: Windows
- Studio minimum: 6.0
- Locales: 15 (en, fr, es_419, pt_BR, de, zh_CN, zh_TW, ja, it, ko, hi, ur, ne, ta, bn)
- Repository: https://github.com/officialheilung-gaming/offbar-fastkey

We also have additional products in the OffBar line built for the same hardware -- happy to share those once FastKey is through review.

Please let us know if anything is needed from our end.

Best,
OffBar / officialheilung-gaming

---

## Pre-submission Checks (per forum post)

- [ ] manifest.json is valid JSON
- [ ] CodePath references actual files in the package
- [ ] Icon is 196x196 PNG
- [ ] Cover image is correct ratio (verify in UI)
- [ ] Auto-check passes before proceeding to cover/banner upload
- [ ] All 15 locale files included and verified (audit passed 2026-09-26)
