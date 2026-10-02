# OffBar FastKey — Install Guide

## What this plugin does

Injects macro text into World of Warcraft (or any focused window) using the
**Windows SendInput API** — the same low-level path used by gaming keyboards.
No clipboard. No paste. No accidental Blizzard UI hotkey fires.

**Identity.** Three strings, and all three were learned on hardware on
2026-09-30:

| Where | Value |
|---|---|
| `manifest.json` → `UUID` (the plugin) | `com.offbar.ulanzideck.obfk.fastkey` |
| `manifest.json` → `Actions[0].UUID` | `com.offbar.ulanzideck.obfk.fastkey.inject` |
| `plugin/app.js` → `$UD.connect(...)` | the **plugin** UUID, `com.offbar.ulanzideck.obfk.fastkey` |
| every OffBar profile key → `"Action"` | `com.offbar.ulanzideck.obfk.fastkey.inject` |

Two rules come with them, each one a night of dead keys:

- `connect()` takes the **plugin** UUID. Not the action UUID, even though the
  Ulanzi SDK's own sample passes one. The one build that ever fired on our
  hardware passed its plugin UUID.
- The plugin UUID must **not be four segments.** The SDK does
  `isMain = uuid.split(".").length == 4` and never routes a key press to what it
  considers the host's main service.

Get any of these wrong and the plugin loads, shows green in Studio's plugin list
or doesn't, appears in the action list, and receives nothing.
`tools/verify_fastkey_plugin.py` in the OffBar repo checks all of it.

---

## First-time setup (one time only)

### 1 — Install Node dependencies

```
cd plugin
npm install
```

This pulls `keysender` (pre-built Windows native binary — no compiler needed).

The plugin root also needs `ws`:

```
cd ..
npm install
```

`ws` must sit at the plugin root, not beside `app.js` — Node resolves `require`
upward from the importing file, and the Ulanzi SDK imports it from
`plugin-common-node/`.

### 2 — Copy the Ulanzi SDK common files

The plugin needs two folders from the **Ulanzi Studio Plugin SDK**:

| Copy from SDK | Paste into the plugin folder as |
|---|---|
| `plugin-common-node/` | `com.offbar.fastkey/plugin-common-node/` |
| `common-html/libs/` | `com.offbar.fastkey/property-inspector/libs/` |

### 3 — Load the plugin in Ulanzi Studio

1. Open **Ulanzi Studio**.
2. Go to **Settings → Plugins → Install Plugin from folder**.
3. Select the `com.offbar.fastkey/` folder.
4. Studio restarts the plugin host; **OffBar FastKey** appears in the action
   list, with its single action shown as **FastKey**.

---

## Per-key configuration

Drag **FastKey** onto any key. In the Property Inspector:

| Field | Default | Description |
|---|---|---|
| **Macro Text** | _(empty)_ | Text to inject. Can include `/` slash commands. |
| **Leading Key** | None | `None` or `Enter`. Enter opens the chat input first. |
| **Send Enter after text** | off | Submits the chat line when checked. |
| **Settle (ms)** | 25 | Pause after the leading key before the text burst. 25 ms is safe at 60 fps. Raise to 35–50 if chat doesn't open reliably. |
| **Key Interval (ms)** | 0 | 0 = burst every character at once (fastest). Raise in 5 ms steps if WoW skips characters. |
| **Post-Text (ms)** | 0 | Extra pause between the end of the text and the trailing Enter. Rarely needed. |

Hit **Save Settings** after any change.

There is no "Slash" leading key. An earlier version of this guide documented
one; neither the inspector nor `app.js` has ever had it. To send a slash
command, use **Enter** and write the `/` as part of your macro text.

---

## WoW-specific notes

**Enter** opens the general chat input with no prefix. Put the whole command,
slash and all, in Macro Text.

Tune in this order if a key misbehaves:

| Symptom | Fix |
|---|---|
| Pressing the key does nothing, chat never opens | Raise **Settle** to 35 or 50 ms |
| Chat opens but text is missing or clipped | Raise **Key Interval** to 5–10 ms |
| Text appears but Enter never fires | Raise **Post-Text** to 25 ms |
| Nothing at all, on every key, every setting | Not a timing problem. Check the three identity values in the table at the top of this file. |

---

## Packaging as a .ulanziPlugin (distributable zip)

```
# From the folder that CONTAINS com.offbar.fastkey/
zip -r FastKey.ulanziPlugin com.offbar.fastkey/
```

The archive must contain the `com.offbar.fastkey/` folder itself, not its
contents loose at the root. Users double-click the `.ulanziPlugin` file and
Studio installs it.

Before shipping one, confirm `node_modules/ws` and `plugin/node_modules/keysender`
are inside the archive. A package that is around 2 MB is missing them; a
complete one is roughly 14 MB.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot find module 'keysender'` | Run `npm install` inside `plugin/` |
| `Cannot find module 'ws'` | Run `npm install` at the plugin root, not in `plugin/` |
| `Cannot find module '../plugin-common-node/index.js'` | Copy `plugin-common-node/` from the SDK (step 2) |
| `$PI is not defined` in the inspector | Copy `libs/` from the SDK's `common-html/libs/` (step 2) |
| Text injected into the wrong window | Click the WoW window first; SendInput targets whichever window has OS focus |
| Studio shows the plugin as errored | Check Studio's plugin log; usually a missing `node_modules` |
| Plugin loads, action appears, key does nothing | `connect()` is not given the plugin UUID, or the UUID is four segments. See the identity table at the top. |
