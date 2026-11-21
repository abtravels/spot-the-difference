// Twin Frames — screenshot scenes: ?shot= presets that put the game in a fixed,
// photogenic state, so the entry's screenshots are real renders of real play.
// start: the title screen. play: level 1 mid-hunt, 3 found, counter visible.
// garden: level 2 mid-hunt, 2 found. complete: the level-complete screen.
export function applyShot(game, params) {
  const shot = params.get('shot');
  if (!shot) return false;
  if (shot === 'start') {
    game.showTitle();
  } else if (shot === 'play') {
    // Prefound by difference id (the same ids the game stores when clicked).
    game.startLevel(0, { prefound: ['clock-hands', 'cat-missing', 'jar-color'], timeLeft: 87, score: 350 });
  } else if (shot === 'garden') {
    game.startLevel(1, { prefound: ['moon-crescent', 'lily-flower'], timeLeft: 64, score: 720 });
  } else if (shot === 'complete') {
    game.startLevel(0, { prefound: ['clock-hands', 'cat-missing', 'jar-color', 'apple-missing', 'picture-moon', 'cup-missing', 'plant-leaf'], timeLeft: 41, score: 940 });
    game.finishLevel(true);
  }
  return true;
}
