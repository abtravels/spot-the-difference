// Twin Frames — sound: every effect is synthesised with WebAudio, so the game
// ships no sound files and makes no network request. Created on the first
// user gesture, because browsers block audio before one.
let audioCtx = null;
let muted = false;

export function isMuted() { return muted; }
export function setMuted(value) { muted = !!value; }

export function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
}

function tone(freq, start, dur, type = 'sine', gain = 0.12) {
  if (!audioCtx || muted) return;
  const osc = audioCtx.createOscillator();
  const amp = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = audioCtx.currentTime + start;
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(gain, t + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(amp).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

// find: a bright two-note chime. wrong: a low dull buzz. hint: one soft blip.
// win: a rising arpeggio. tick: a short click when the clock runs low. start: a lift.
export function playSound(name) {
  if (!audioCtx || muted) return;
  switch (name) {
    case 'find': tone(659, 0, 0.14); tone(880, 0.09, 0.22); break;
    case 'wrong': tone(130, 0, 0.18, 'sawtooth', 0.08); break;
    case 'hint': tone(520, 0, 0.12, 'sine', 0.09); break;
    case 'win': [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.2)); break;
    case 'tick': tone(980, 0, 0.05, 'square', 0.05); break;
    case 'start': tone(392, 0, 0.12); tone(523, 0.08, 0.16); break;
    case 'click': tone(440, 0, 0.05, 'triangle', 0.06); break;
    default: break;
  }
}
