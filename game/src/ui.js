// Twin Frames — the HUD and the screens: the DOM bar above the canvas and the
// overlay screens (title, level complete, game over, victory, pause). The canvas
// draws the pictures; this file owns every word the player reads.
const $ = (id) => document.getElementById(id);

export function setCounter(found, total) {
  $('counter').textContent = `Found ${found} of ${total}`;
}

export function setTimer(seconds) {
  const el = $('timer');
  el.textContent = `${Math.floor(seconds / 60)}:${String(Math.ceil(seconds % 60)).padStart(2, '0')}`;
  el.classList.toggle('low', seconds <= 10);
}

export function setScore(score) {
  $('score').textContent = `Score ${score}`;
}

export function setCombo(combo) {
  const el = $('combo');
  el.textContent = combo > 1 ? `Combo x${combo}` : '';
}

export function setLevelName(name, tag) {
  $('level-name').textContent = `${tag} — ${name}`;
}

export function setHints(left) {
  $('hint-btn').textContent = `Hint (${left})`;
  $('hint-btn').disabled = left <= 0;
}

export function setMuted(muted) {
  $('mute-btn').textContent = muted ? 'Sound: off' : 'Sound: on';
}

export function flashMessage(text) {
  const el = $('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(flashMessage._t);
  flashMessage._t = setTimeout(() => el.classList.remove('show'), 1400);
}

const SCREENS = ['title-screen', 'complete-screen', 'over-screen', 'win-screen', 'pause-screen'];

export function showScreen(id) {
  SCREENS.forEach((name) => $(name).classList.toggle('hidden', name !== id));
  if (!id) SCREENS.forEach((name) => $(name).classList.add('hidden'));
}

export function setCompleteText({ levelName, found, total, timeBonus, levelScore }) {
  $('complete-title').textContent = `${levelName} — complete!`;
  $('complete-detail').textContent = `You found all ${found} of ${total} differences. Time bonus +${timeBonus}. Level score ${levelScore}.`;
}

export function setOverText({ levelName, found, total }) {
  $('over-detail').textContent = `Time ran out in ${levelName} — you found ${found} of ${total} differences.`;
}

export function setWinText({ score, best }) {
  $('win-detail').textContent = `You cleared all three scenes! Final score ${score}. Best score ${best}.`;
}
