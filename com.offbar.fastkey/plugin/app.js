/**
 * OffBar FastKey — Ulanzi Studio Plugin
 * Injects macro text via Windows SendInput API (keysender v2.x).
 * No clipboard. No paste. No hotkey conflicts.
 *
 * Settings per key instance:
 *   text               — macro string to inject
 *   leadingKey         — "none" | "enter"
 *   trailingEnter      — true/false
 *   settleDelay        — ms to wait after leading key before text burst (default 25)
 *   keystrokeInterval  — ms between each character (default 0 = burst)
 *   postInjectDelay    — ms between end of text and trailing Enter (default 0)
 */

import { fileURLToPath } from 'url';
import path from 'path';

// Ulanzi SDK ships as CJS; import via dynamic import so we stay ESM
let UlanziApi;
try {
  UlanziApi = (await import('../plugin-common-node/index.js')).default;
} catch {
  UlanziApi = (await import('../plugin-common-node/libs/ulanziApi.js')).default;
}

// keysender is loaded lazily on first keypress
let Hardware = null;
async function getHardware() {
  if (!Hardware) {
    const mod = await import('keysender');
    Hardware = mod.Hardware;
  }
  return Hardware;
}

// ── Instance state ────────────────────────────────────────────────────────────
/** @type {Map<string, object>} context → settings */
const instances = new Map();

// ── SDK wiring ────────────────────────────────────────────────────────────────
const $UD = new UlanziApi();

$UD.connect('com.ulanzi.ulanzistudio.offbar.fasttext');

/** Called when a key instance is added/restored with saved param */
$UD.onAdd((message) => {
  if (message.context && message.param) {
    instances.set(message.context, message.param);
  }
});

/** Fired when PI calls sendParamFromPlugin */
$UD.onParamFromPlugin((message) => {
  if (message.context && message.param) {
    instances.set(message.context, message.param);
  }
});

/** Also listen to paramfromapp in case Studio re-routes the event */
$UD.onParamFromApp((message) => {
  if (message.context && message.param) {
    instances.set(message.context, message.param);
  }
});

/** Also listen to sendToPlugin in case PI uses that path */
$UD.onSendToPlugin((message) => {
  if (message.context) {
    const p = message.payload || message.param;
    if (p) instances.set(message.context, p);
  }
});

/** Called when user presses the key */
$UD.onRun(async (message) => {
  const settings = message.param || instances.get(message.context) || {};
  try {
    await fireText(settings);
  } catch (err) {
    console.error('FastKey fireText error:', err?.message || err);
  }
});

// ── Core injection logic ──────────────────────────────────────────────────────

/**
 * Fire text into the focused window using Windows SendInput.
 * @param {object} s — instance settings
 */
async function fireText(s) {
  const rawText           = String(s.text ?? '').trim();
  const leadingKey        = s.leadingKey ?? 'none';
  const trailingEnter     = toBool(s.trailingEnter);
  const settleDelay       = toMs(s.settleDelay, 25);
  const keystrokeInterval = toMs(s.keystrokeInterval, 0);
  const postInjectDelay   = toMs(s.postInjectDelay, 0);

  if (!rawText && leadingKey === 'none' && !trailingEnter) return;

  const HW  = await getHardware();
  const hw  = new HW(null);   // null = target the currently focused window
  const kbd = hw.keyboard;

  // 1. Leading key
  if (leadingKey === 'enter') {
    await kbd.sendKey('enter');
  }

  // 2. Settle — let the target app process the leading key
  if (settleDelay > 0) await sleep(settleDelay);

  // 3. Text injection
  if (rawText) {
    if (keystrokeInterval === 0) {
      await kbd.printText(rawText);
    } else {
      for (const char of rawText) {
        await kbd.printText(char);
        await sleep(keystrokeInterval);
      }
    }
  }

  // 4. Post-inject settle before trailing Enter
  if (postInjectDelay > 0) await sleep(postInjectDelay);

  // 5. Trailing Enter — submits the input
  if (trailingEnter) {
    await kbd.sendKey('enter');
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toMs(value, defaultMs) {
  const n = parseInt(value ?? defaultMs, 10);
  return Number.isFinite(n) && n >= 0 ? n : defaultMs;
}

function toBool(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string')  return value.toLowerCase() === 'true';
  return false;
}
