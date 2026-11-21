// Twin Frames — configuration: canvas size, panel layout, timing and scoring.
// One place for every number the game tunes by, so a balance change is one edit.
export const CANVAS_W = 1280;
export const CANVAS_H = 720;

// The two picture panels sit side by side under the HUD bar.
export const PANEL_W = 610;
export const PANEL_H = 560;
export const PANEL_Y = 96;
export const LEFT_X = 20;
export const RIGHT_X = 650;
export const PANEL_GAP = 20;

// A wrong click costs seconds and resets the combo; a hint is free but scarce.
export const WRONG_PENALTY_SECONDS = 3;
export const HINTS_PER_LEVEL = 3;
export const HINT_PULSE_MS = 2200;
export const FIND_BASE_POINTS = 100;
export const MAX_COMBO = 5;
export const WRONG_POINTS = 25;

// Each level: its scene, its clock and how many differences it hides.
export const LEVELS = [
  { scene: 'kitchen', name: 'Cozy Kitchen', tag: 'Level 1 of 3', seconds: 120 },
  { scene: 'garden', name: 'Night Garden', tag: 'Level 2 of 3', seconds: 105 },
  { scene: 'harbour', name: 'Harbour at Dusk', tag: 'Level 3 of 3', seconds: 90 },
];
