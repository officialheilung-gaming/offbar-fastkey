# OffBar Fast Text — Install Guide

## What this plugin does

Injects macro text into World of Warcraft (or any focused window) using the
**Windows SendInput API** — the same low-level path used by gaming keyboards.
No clipboard. No paste. No accidental Blizzard UI hotkey fires.

---

## First-time setup (one time only)

### 1 — Install Node dependencies

Open a terminal inside the `plugin/` folder and run:

```
cd plugin
npm install
```

This pulls `keysender` (pre-built Windows native binary — no compiler needed).

### 2 — Copy the Ulanzi SDK common files

The plugin needs two folders from the **Ulanzi Studio Plugin SDK**
(clone it from the Ulanzi developer repo if you don't have it):

| Copy from SDK                     | Paste into plugin root as            |
|-----------------------------------|--------------------------------------|
| `plugin-common-node/`             | `com.offbar.fasttext.ulanziPlugin/plugin-common-node/` |
| `common-html/libs/`               | `com.offbar.fasttext.ulanziPlugin/property-inspector/libs/` |

The `plugin-common-node/` folder contains `index.js` (the UlanziApi class).
The `libs/` folder contains `property-inspector.js` (the PI bridge script).

### 3 — Load the plugin in Ulanzi Studio

1. Open **Ulanzi Studio**.
2. Go to **Settings → Plugins → Install Plugin from folder**.
3. Select the `com.offbar.fasttext.ulanziPlugin/` folder.
4. Studio restarts the plugin host; you should see **OffBar Fast Text** in the action list.

---

## Per-key configuration

Drag **Fast Text** onto any key. In the Property Inspector:

| Field | Default | Description |
|---|---|---|
| **Macro Text** | _(empty)_ | Text to inject. Can include `/` slash commands. |
| **Leading Key** | None | `None` / `Enter` (opens chat) / `Slash /` (opens chat + pre-fills `/`) |
| **Send Enter after text** | off | Submits the chat line when checked |
| **Settle (ms)** | 25 | Pause after leading key before text burst. 25 ms is safe for 60 fps WoW. Raise to 35–50 if chat doesn't open reliably. |
| **Key Interval (ms)** | 0 | 0 = burst all chars at once (fastest). Raise in 5 ms steps if WoW skips characters. |
| **Post-Text (ms)** | 0 | Extra pause between end of text and trailing Enter. Rarely needed. |

Hit **Save Settings** after any change.

---

## WoW-specific notes

### Leading key: Slash vs Enter

- **Slash `/`** — triggers WoW's "Open Chat Slash" binding. Opens chat *and* deposits `/` in the
  input box. The plugin strips any leading `/` from your Macro Text automatically, so
  `/say Hello` becomes `say Hello` in the burst (WoW already has the `/`).
- **Enter** — opens the general chat input with no prefix. Use this for `/` macros if you want
  full control, or for chat lines that don't start with `/`.

### Tune settle delay first

If pressing the key does nothing (chat never opens): raise **Settle** to 35 or 50 ms.
If chat opens but text is missing: raise **Key Interval** to 5–10 ms.
If text appears but Enter never fires: raise **Post-Text** to 25 ms.

---

## Packaging as a .ulanziPlugin (distributable zip)

```
cd ..
# From the folder that contains com.offbar.fasttext.ulanziPlugin/
zip -r OffBarFastText.ulanziPlugin com.offbar.fasttext.ulanziPlugin/
```

Users can double-click the `.ulanziPlugin` file and Studio will install it.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot find module 'keysender'` | Run `npm install` inside `plugin/` |
| `Cannot find module '../plugin-common-node/index.js'` | Copy `plugin-common-node/` from the SDK (step 2 above) |
| `$PI is not defined` in inspector | Copy `libs/` from SDK `common-html/libs/` (step 2 above) |
| Text injected into wrong window | Click the WoW window first; SendInput targets whichever window has OS focus |
| Ulanzi Studio shows plugin as errored | Check Studio's plugin log; usually a missing `node_modules` |
