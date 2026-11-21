// Twin Frames — input: pointer clicks on the canvas and keyboard shortcuts.
// Pointer coordinates are converted to the canvas's own 1280x720 space, so a
// click lands on the same spot whatever size the browser window is.
import { CANVAS_W, CANVAS_H, LEFT_X, RIGHT_X, PANEL_W, PANEL_H, PANEL_Y } from './config.js';

// Returns { panel: 0|1, x, y } in panel-local coordinates, or null when the
// click falls outside both picture panels.
export function toPanelPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * CANVAS_W;
  const y = ((clientY - rect.top) / rect.height) * CANVAS_H;
  if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
  if (x >= LEFT_X && x <= LEFT_X + PANEL_W) return { panel: 0, x: x - LEFT_X, y: y - PANEL_Y };
  if (x >= RIGHT_X && x <= RIGHT_X + PANEL_W) return { panel: 1, x: x - RIGHT_X, y: y - PANEL_Y };
  return null;
}

export function attachPointer(canvas, onTap) {
  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    const point = toPanelPoint(canvas, event.clientX, event.clientY);
    if (point) onTap(point);
  });
}

// H hint, P pause, M mute, Enter start/continue, 1/2/3 pick a level on the title.
export function attachKeyboard(onKey) {
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h' || key === 'p' || key === 'm' || key === 'enter' || key === '1' || key === '2' || key === '3') {
      onKey(key);
    }
  });
}
