// Twin Frames — the game itself: state machine, loop, rendering, clicks, hints,
// timer and scoring. The two panels are drawn from one scene function; the
// left panel is the original, the right panel carries the differences.
import { CANVAS_W, CANVAS_H, PANEL_W, PANEL_H, PANEL_Y, LEFT_X, RIGHT_X, LEVELS, WRONG_PENALTY_SECONDS, HINTS_PER_LEVEL, HINT_PULSE_MS, FIND_BASE_POINTS, MAX_COMBO, WRONG_POINTS } from './config.js';
import { SCENES } from './scenes.js';
import { attachPointer, attachKeyboard } from './input.js';
import * as ui from './ui.js';
import { ensureAudio, playSound, setMuted, isMuted } from './audio.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// A difference is found when the click lands within its radius on either panel.
function findDifference(scene, x, y) {
  return scene.diffs.find((d) => Math.hypot(d.x - x, d.y - y) <= d.r);
}

class Game {
  constructor() {
    this.screen = 'title';
    this.levelIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.combo = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = 0;
    this.hintPulse = null; // { diff, until }
    this.missFlash = null; // { x, y, until }
    this.lastTickSecond = -1;
    this.best = 0;
    try { this.best = Number(localStorage.getItem('twin-frames-best') || 0) || 0; } catch { /* storage off */ }
  }

  scene() { return SCENES[this.levelIndex]; }

  startLevel(index, opts = {}) {
    this.levelIndex = index;
    this.found = new Set(opts.prefound || []);
    this.combo = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = opts.timeLeft ?? LEVELS[index].seconds;
    this.score = opts.score ?? this.score;
    this.hintPulse = null;
    this.missFlash = null;
    this.lastTickSecond = -1;
    this.screen = 'playing';
    ui.setLevelName(this.scene().name, LEVELS[index].tag);
    ui.setCounter(this.found.size, this.scene().diffs.length);
    ui.setTimer(this.timeLeft);
    ui.setScore(this.score);
    ui.setCombo(this.combo);
    ui.setHints(this.hintsLeft);
    ui.showScreen(null);
    this._last = performance.now();
  }

  showTitle() {
    this.screen = 'title';
    ui.setLevelName('Twin Frames', 'Three scenes to study');
    ui.showScreen('title-screen');
  }

  useHint() {
    if (this.screen !== 'playing' || this.hintsLeft <= 0) return;
    const remaining = this.scene().diffs.filter((d) => !this.found.has(d.id));
    if (!remaining.length) return;
    this.hintsLeft -= 1;
    ui.setHints(this.hintsLeft);
    // A hint pulses the same unfound difference on both panels for a moment.
    this.hintPulse = { diff: remaining[Math.floor(Math.random() * remaining.length)], until: performance.now() + HINT_PULSE_MS };
    playSound('hint');
    ui.flashMessage('Hint: look at the pulsing ring');
  }

  togglePause() {
    if (this.screen === 'playing') {
      this.screen = 'paused';
      ui.showScreen('pause-screen');
    } else if (this.screen === 'paused') {
      this.screen = 'playing';
      ui.showScreen(null);
      this._last = performance.now();
    }
  }

  onTap(point) {
    ensureAudio();
    if (this.screen !== 'playing') return;
    const diff = findDifference(this.scene(), point.x, point.y);
    if (diff && !this.found.has(diff.id)) {
      this.found.add(diff.id);
      this.combo = Math.min(this.combo + 1, MAX_COMBO);
      this.score += FIND_BASE_POINTS * this.combo;
      ui.setCounter(this.found.size, this.scene().diffs.length);
      ui.setScore(this.score);
      ui.setCombo(this.combo);
      playSound('find');
      ui.flashMessage(`${diff.label} — found! +${FIND_BASE_POINTS * this.combo}`);
      if (this.found.size === this.scene().diffs.length) this.finishLevel(false);
    } else if (diff) {
      ui.flashMessage('Already found — try another spot');
    } else {
      this.combo = 0;
      this.score = Math.max(0, this.score - WRONG_POINTS);
      this.timeLeft = Math.max(0, this.timeLeft - WRONG_PENALTY_SECONDS);
      ui.setScore(this.score);
      ui.setCombo(this.combo);
      ui.setTimer(this.timeLeft);
      this.missFlash = { x: point.x, y: point.y, panel: point.panel, until: performance.now() + 600 };
      playSound('wrong');
      ui.flashMessage(`Not a difference — minus ${WRONG_PENALTY_SECONDS} seconds`);
      if (this.timeLeft <= 0) this.gameOver();
    }
  }

  finishLevel(fromShot) {
    const timeBonus = Math.ceil(this.timeLeft) * 10;
    this.score += timeBonus;
    ui.setScore(this.score);
    playSound('win');
    const levelScore = this.score;
    if (this.levelIndex + 1 >= SCENES.length) {
      this.screen = 'victory';
      if (this.score > this.best) {
        this.best = this.score;
        try { localStorage.setItem('twin-frames-best', String(this.best)); } catch { /* storage off */ }
      }
      ui.setWinText({ score: this.score, best: this.best });
      ui.showScreen('win-screen');
    } else {
      this.screen = 'levelComplete';
      ui.setCompleteText({ levelName: this.scene().name, found: this.scene().diffs.length, total: this.scene().diffs.length, timeBonus, levelScore });
      ui.showScreen('complete-screen');
    }
    if (fromShot) this.screen = 'levelComplete';
  }

  gameOver() {
    this.screen = 'gameOver';
    playSound('wrong');
    ui.setOverText({ levelName: this.scene().name, found: this.found.size, total: this.scene().diffs.length });
    ui.showScreen('over-screen');
  }

  tick(now) {
    if (this.screen !== 'playing') return;
    const dt = Math.min(0.1, (now - this._last) / 1000);
    this._last = now;
    this.timeLeft -= dt;
    if (this.timeLeft <= 10.5 && Math.ceil(this.timeLeft) !== this.lastTickSecond && this.timeLeft > 0) {
      this.lastTickSecond = Math.ceil(this.timeLeft);
      playSound('tick');
    }
    ui.setTimer(Math.max(0, this.timeLeft));
    if (this.timeLeft <= 0) this.gameOver();
  }

  render(now) {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#20242e';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    if (this.screen === 'title') {
      this.renderTitleBackdrop();
      return;
    }
    const scene = this.scene();
    const active = new Set(scene.diffs.map((d) => d.id));
    scene.draw(ctx, LEFT_X, PANEL_Y, new Set());
    scene.draw(ctx, RIGHT_X, PANEL_Y, active);
    this.drawPanelFrames();
    this.drawMarkers(now);
  }

  // The title screen still shows the first scene behind a dim veil, so the
  // game reads as a spot-the-difference game even before the first click.
  renderTitleBackdrop() {
    const scene = SCENES[0];
    const active = new Set(scene.diffs.map((d) => d.id));
    scene.draw(ctx, LEFT_X, PANEL_Y, new Set());
    scene.draw(ctx, RIGHT_X, PANEL_Y, active);
    this.drawPanelFrames();
    ctx.fillStyle = 'rgba(16, 18, 26, 0.45)';
    ctx.fillRect(0, PANEL_Y, CANVAS_W, PANEL_H);
  }

  drawPanelFrames() {
    ctx.strokeStyle = '#f5f0dc';
    ctx.lineWidth = 4;
    ctx.strokeRect(LEFT_X - 2, PANEL_Y - 2, PANEL_W + 4, PANEL_H + 4);
    ctx.strokeRect(RIGHT_X - 2, PANEL_Y - 2, PANEL_W + 4, PANEL_H + 4);
    ctx.fillStyle = '#f5f0dc';
    ctx.font = 'bold 15px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('ORIGINAL', LEFT_X + 8, PANEL_Y - 10);
    ctx.fillText('SPOT THE DIFFERENCES', RIGHT_X + 8, PANEL_Y - 10);
  }

  drawMarkers(now) {
    const scene = this.scene();
    // Found differences get a gold ring on both panels.
    for (const diff of scene.diffs) {
      if (!this.found.has(diff.id)) continue;
      for (const ox of [LEFT_X, RIGHT_X]) {
        ctx.strokeStyle = '#ffd94d';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(ox + diff.x, PANEL_Y + diff.y, diff.r + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = '#2e7d32';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(ox + diff.x - 8, PANEL_Y + diff.y);
        ctx.lineTo(ox + diff.x - 2, PANEL_Y + diff.y + 7);
        ctx.lineTo(ox + diff.x + 10, PANEL_Y + diff.y - 7);
        ctx.stroke();
      }
    }
    // A hint pulses a ring around one unfound difference on both panels.
    if (this.hintPulse && now < this.hintPulse.until) {
      const pulse = 0.5 + 0.5 * Math.sin(now / 120);
      for (const ox of [LEFT_X, RIGHT_X]) {
        ctx.strokeStyle = `rgba(255, 217, 77, ${0.5 + pulse * 0.5})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(ox + this.hintPulse.diff.x, PANEL_Y + this.hintPulse.diff.y, this.hintPulse.diff.r + 10 + pulse * 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (this.hintPulse) {
      this.hintPulse = null;
    }
    // A wrong click flashes a red cross where it landed.
    if (this.missFlash && now < this.missFlash.until) {
      const ox = this.missFlash.panel === 0 ? LEFT_X : RIGHT_X;
      const cx = ox + this.missFlash.x;
      const cy = PANEL_Y + this.missFlash.y;
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy - 12); ctx.lineTo(cx + 12, cy + 12);
      ctx.moveTo(cx + 12, cy - 12); ctx.lineTo(cx - 12, cy + 12);
      ctx.stroke();
    } else if (this.missFlash) {
      this.missFlash = null;
    }
  }
}

const game = new Game();
window.__game = game;

attachPointer(canvas, (point) => game.onTap(point));
attachKeyboard((key) => {
  ensureAudio();
  if (key === 'h') game.useHint();
  else if (key === 'p') game.togglePause();
  else if (key === 'm') { setMuted(!isMuted()); ui.setMuted(isMuted()); }
  else if (key === 'enter') {
    if (game.screen === 'title') { playSound('start'); game.startLevel(0); }
    else if (game.screen === 'levelComplete') { playSound('start'); game.startLevel(game.levelIndex + 1); }
    else if (game.screen === 'gameOver') { playSound('start'); game.startLevel(game.levelIndex); }
    else if (game.screen === 'victory') { playSound('start'); game.score = 0; game.startLevel(0); }
  } else if (game.screen === 'title' && (key === '1' || key === '2' || key === '3')) {
    playSound('start');
    game.startLevel(Number(key) - 1);
  }
});

document.getElementById('start-btn').addEventListener('click', () => { ensureAudio(); playSound('start'); game.startLevel(0); });
document.getElementById('how-btn').addEventListener('click', () => {
  ensureAudio();
  document.getElementById('howto').classList.toggle('hidden');
});
document.getElementById('next-btn').addEventListener('click', () => { ensureAudio(); playSound('start'); game.startLevel(game.levelIndex + 1); });
document.getElementById('retry-btn').addEventListener('click', () => { ensureAudio(); playSound('start'); game.startLevel(game.levelIndex); });
document.getElementById('again-btn').addEventListener('click', () => { ensureAudio(); playSound('start'); game.score = 0; game.startLevel(0); });
document.getElementById('resume-btn').addEventListener('click', () => game.togglePause());
document.getElementById('quit-btn').addEventListener('click', () => { game.showTitle(); });
document.getElementById('hint-btn').addEventListener('click', () => { ensureAudio(); game.useHint(); });
document.getElementById('pause-btn').addEventListener('click', () => game.togglePause());
document.getElementById('mute-btn').addEventListener('click', () => { ensureAudio(); setMuted(!isMuted()); ui.setMuted(isMuted()); });

// Screenshot presets (?shot=start|play|garden|complete) set a fixed state;
// otherwise the game opens on its title screen.
const params = new URLSearchParams(location.search);
if (!applyShot(game, params)) game.showTitle();

function frame(now) {
  game.tick(now);
  game.render(now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
