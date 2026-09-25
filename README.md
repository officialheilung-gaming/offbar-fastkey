# OffBar FastKey

A [Ulanzi Studio](https://www.ulanzistudio.com/) plugin that injects text and commands at hardware keystroke speed — no clipboard, no paste, no conflicts.

Built for [OffBar](https://myoffbar.com).

---

## What it does

Assign any text string to a key on your Ulanzi pad. When pressed, FastKey fires it character-by-character directly into the focused window using the Windows **SendInput** API (`keysender`). Nothing touches the clipboard.

Supports:
- **Leading Enter** — opens a text field before injecting (e.g. a chat box, command bar, or search field)
- **Trailing Enter** — submits the input after injection
- **Timing controls** — settle delay, per-keystroke interval, post-text delay

---

## Requirements

- Windows 10 or later
- [Ulanzi Studio](https://www.ulanzistudio.com/) with a compatible Ulanzi pad (TC001, D200X, etc.)
- Node.js (bundled with Ulanzi Studio)

---

## Installation

### From Ulanzi Studio
Install directly from the Ulanzi Community Store or marketplace listing.

### Manual
1. Download the latest `.zip` from [Releases](../../releases)
2. Unzip into your Ulanzi plugins folder:
   ```
   %APPDATA%\Ulanzi\UlanziDeck\Plugins\
   ```
3. Restart Ulanzi Studio
4. Drag **FastKey** from the action list onto any key

---

## Configuration

Each key has its own settings panel:

| Field | Description |
|---|---|
| **Macro Text** | The text to inject when the key is pressed |
| **Leading Key** | `None` or `Enter` (opens a text field first) |
| **Send Enter after text** | Submits the field after injection |
| **Settle (ms)** | Wait after leading key before text burst (default 25ms) |
| **Key Interval (ms)** | Delay between characters — 0 = instant burst |
| **Post-Text (ms)** | Wait between text end and trailing Enter |

---

## Notes on timing

FastKey injects at the speed the OS allows. Most applications handle **burst mode** (Key Interval = 0) perfectly. If a target app misses characters, raise Key Interval to 10–30ms.

If a Leading Enter opens a UI element that needs time to focus, raise **Settle** to 50–75ms.

---

## License

MIT — see [LICENSE](LICENSE)

---

*Made with OffBar · [myoffbar.com](https://myoffbar.com)*
