[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/abtravels/spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/abtravels/spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Twin Frames — Spot the Difference

A complete, original spot-the-difference game in vanilla JS + canvas, built for the
[make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).
Two near-identical pictures side by side, drawn entirely in code — no images, no
libraries, no network requests.

## How to play

Open `game/index.html` in a desktop browser (or serve `game/` with any static
server). Click a difference on either picture: a gold ring marks it on both sides
and the counter moves. Chain finds without a miss to build a combo up to x5.
A wrong click costs 3 seconds and resets the combo. Hints are limited to 3 per
level — press **H** or the Hint button to pulse one unfound difference. **P**
pauses, **M** mutes, **1/2/3** pick a level from the title screen.

## The three scenes

- **Cozy Kitchen** — 7 differences, 2:00. A cat, a clock, a jar, an apple, a
  picture, a cup and a leaf.
- **Night Garden** — 8 differences, 1:45. A star, the moon, an apple, a lily
  flower, a firefly, a bench slat, a mushroom spot and a snail.
- **Harbour at Dusk** — 10 differences, 1:30. Sun rays, a cloud, the lighthouse
  beam and lamp room, a sail stripe, a gull, a buoy, a crate, a rope coil and a flag.

Finish a level to bank a time bonus of 10 points per second left. Clear all
three scenes to win; your best score is kept in localStorage.

## Layout

- `game/index.html` — page, HUD bar and overlay screens
- `game/src/main.js` — state machine, game loop, clicks, timer, scoring
- `game/src/scenes.js` — the three scenes: one draw function each, drawn twice
- `game/src/config.js` — sizes, timings and scoring numbers
- `game/src/draw.js` — canvas drawing primitives
- `game/src/input.js` — pointer and keyboard input
- `game/src/audio.js` — synthesised WebAudio effects (no sound files)
- `game/src/ui.js` — HUD and screen text
- `game/src/shots.js` — `?shot=` presets for screenshots
- `main.ts` — hands the game in: copies `game/` + `screenshots/` to `/output`
  and writes `dossier.json` with `vendor/makefun-game.ts`

## License

MIT — see [LICENSE](LICENSE).
