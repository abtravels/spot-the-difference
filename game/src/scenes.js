// Twin Frames — the three scenes. Every scene is drawn twice from one function:
// the left panel with no differences active, the right panel with its set applied.
// A difference is one deliberate change: something missing, moved or recoloured.
// All art is drawn in code, so both panels share one style and the differences
// are hidden by design, not by pasting two pictures.
import { circle, ellipse, rect, roundRect, line, poly, star4 } from './draw.js';

// ---------------------------------------------------------------- kitchen ---
function drawKitchen(ctx, ox, oy, active) {
  // Wall and wooden floor.
  rect(ctx, ox, oy, 610, 400, '#f7e8c9');
  rect(ctx, ox, oy + 400, 610, 160, '#b07a4a');
  ctx.strokeStyle = '#96653d';
  ctx.lineWidth = 2;
  for (let y = oy + 430; y < oy + 560; y += 32) {
    ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + 610, y); ctx.stroke();
  }
  // Rug under the table.
  ellipse(ctx, ox + 300, oy + 520, 150, 24, '#d94f4f');
  ellipse(ctx, ox + 300, oy + 520, 128, 17, '#e8a34c');

  // Window with curtains, sun and sky.
  rect(ctx, ox + 60, oy + 60, 180, 160, '#ffffff');
  rect(ctx, ox + 70, oy + 70, 160, 140, '#bfe3ff');
  circle(ctx, ox + 150, oy + 120, 28, '#ffd94d');
  line(ctx, ox + 150, oy + 60, ox + 150, oy + 210, '#ffffff', 6);
  line(ctx, ox + 60, oy + 140, ox + 240, oy + 140, '#ffffff', 6);
  poly(ctx, [[ox + 52, oy + 50], [ox + 78, oy + 50], [ox + 70, oy + 230], [ox + 52, oy + 230]], '#c0392b');
  poly(ctx, [[ox + 222, oy + 50], [ox + 248, oy + 50], [ox + 248, oy + 230], [ox + 230, oy + 230]], '#c0392b');

  // Shelf with three jars.
  rect(ctx, ox + 330, oy + 90, 220, 14, '#8a5a2b');
  roundRect(ctx, ox + 360, oy + 40, 34, 50, 6, '#d94f4f');
  roundRect(ctx, ox + 410, oy + 40, 34, 50, 6, active.has('jar-color') ? '#8e44ad' : '#4caf50');
  roundRect(ctx, ox + 460, oy + 40, 34, 50, 6, '#4a90d9');
  rect(ctx, ox + 360, oy + 32, 34, 8, '#6b4423');
  rect(ctx, ox + 410, oy + 32, 34, 8, '#6b4423');
  rect(ctx, ox + 460, oy + 32, 34, 8, '#6b4423');

  // Wall clock: 3:00 on the left, 4:30 on the right.
  circle(ctx, ox + 520, oy + 180, 34, '#ffffff');
  ctx.strokeStyle = '#333'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(ox + 520, oy + 180, 34, 0, Math.PI * 2); ctx.stroke();
  if (active.has('clock-hands')) {
    line(ctx, ox + 520, oy + 180, ox + 532, oy + 192, '#222', 4); // hour to 4:30
    line(ctx, ox + 520, oy + 180, ox + 520, oy + 206, '#222', 3); // minute down
  } else {
    line(ctx, ox + 520, oy + 180, ox + 542, oy + 180, '#222', 4); // hour to 3
    line(ctx, ox + 520, oy + 180, ox + 520, oy + 154, '#222', 3); // minute up
  }
  circle(ctx, ox + 520, oy + 180, 4, '#222');

  // Framed picture: a sunny hill on the left, a moonlit one on the right.
  rect(ctx, ox + 60, oy + 270, 120, 90, '#6b4423');
  rect(ctx, ox + 68, oy + 278, 104, 74, '#bfe3ff');
  if (active.has('picture-moon')) {
    circle(ctx, ox + 140, oy + 300, 14, '#f5f0c8');
    circle(ctx, ox + 96, oy + 296, 3, '#ffffff');
    circle(ctx, ox + 158, oy + 292, 2, '#ffffff');
  } else {
    circle(ctx, ox + 140, oy + 300, 14, '#ffd94d');
  }
  poly(ctx, [[ox + 68, oy + 352], [ox + 110, oy + 318], [ox + 150, oy + 352]], '#5da85d');
  poly(ctx, [[ox + 120, oy + 352], [ox + 152, oy + 326], [ox + 172, oy + 352]], '#4a8f4a');

  // Hanging plant: five leaves on the left, four on the right.
  rect(ctx, ox + 530, oy + 36, 56, 30, '#b5651d');
  const leaves = [0, 1, 2, 3, 4];
  leaves.forEach((i) => {
    if (active.has('plant-leaf') && i === 4) return;
    ellipse(ctx, ox + 538 + i * 11, oy + 82 + (i % 2) * 8, 7, 16, '#3d8b40');
  });

  // Table with teapot and cups.
  rect(ctx, ox + 60, oy + 400, 490, 20, '#8a5a2b');
  rect(ctx, ox + 80, oy + 420, 16, 90, '#6b4423');
  rect(ctx, ox + 514, oy + 420, 16, 90, '#6b4423');
  // Teapot.
  ellipse(ctx, ox + 200, oy + 372, 34, 26, '#7fb3d5');
  circle(ctx, ox + 200, oy + 342, 12, '#7fb3d5');
  line(ctx, ox + 232, oy + 360, ox + 252, oy + 344, '#7fb3d5', 8);
  line(ctx, ox + 168, oy + 356, ox + 156, oy + 340, '#7fb3d5', 7);
  // Cups: two on the left, one on the right.
  roundRect(ctx, ox + 292, oy + 372, 30, 24, 4, '#e8a34c');
  if (!active.has('cup-missing')) roundRect(ctx, ox + 344, oy + 372, 30, 24, 4, '#e8a34c');

  // Fruit bowl: three apples on the left, two on the right.
  ellipse(ctx, ox + 472, oy + 428, 46, 16, '#5d4037');
  circle(ctx, ox + 450, oy + 412, 12, '#e74c3c');
  if (!active.has('apple-missing')) circle(ctx, ox + 474, oy + 406, 12, '#e74c3c');
  circle(ctx, ox + 496, oy + 414, 12, '#e74c3c');

  // Sleeping cat on the rug — gone on the right.
  if (!active.has('cat-missing')) {
    ellipse(ctx, ox + 140, oy + 498, 42, 18, '#e67e22');
    circle(ctx, ox + 172, oy + 490, 14, '#e67e22');
    poly(ctx, [[ox + 162, oy + 480], [ox + 166, oy + 470], [ox + 172, oy + 480]], '#e67e22');
    poly(ctx, [[ox + 176, oy + 478], [ox + 182, oy + 470], [ox + 184, oy + 480]], '#e67e22');
    line(ctx, ox + 104, oy + 500, ox + 88, oy + 488, '#e67e22', 6);
  }

  // Pendant lamp.
  line(ctx, ox + 320, oy, ox + 320, oy + 58, '#333', 3);
  poly(ctx, [[ox + 296, oy + 58], [ox + 344, oy + 58], [ox + 356, oy + 86], [ox + 284, oy + 86]], '#f1c40f');
  circle(ctx, ox + 320, oy + 92, 10, '#fff7ae');
}

// ------------------------------------------------------------------ garden ---
function drawGarden(ctx, ox, oy, active) {
  // Night sky and ground.
  const sky = ctx.createLinearGradient(ox, oy, ox, oy + 560);
  sky.addColorStop(0, '#0b1035');
  sky.addColorStop(1, '#1c2a5e');
  rect(ctx, ox, oy, 610, 560, sky);
  rect(ctx, ox, oy + 440, 610, 120, '#1e4d2b');
  // Stars: one is missing on the right.
  const stars = [[80, 60], [150, 120], [220, 50], [300, 90], [380, 45], [450, 130], [520, 70], [560, 150], [120, 80], [260, 170], [330, 200], [500, 200], [60, 200], [200, 210]];
  stars.forEach(([sx, sy], i) => {
    if (active.has('star-missing') && i === 8) return;
    star4(ctx, ox + sx, oy + sy, 5, '#ffffff');
  });
  // Moon: full on the left, crescent on the right.
  circle(ctx, ox + 480, oy + 90, 38, '#f5f0c8');
  if (active.has('moon-crescent')) circle(ctx, ox + 496, oy + 82, 34, '#141c44');
  circle(ctx, ox + 468, oy + 80, 6, '#ddd5a0');
  circle(ctx, ox + 490, oy + 102, 4, '#ddd5a0');

  // Tree with apples: four on the left, three on the right.
  rect(ctx, ox + 96, oy + 300, 22, 150, '#5d4037');
  circle(ctx, ox + 150, oy + 280, 72, '#2e7d32');
  circle(ctx, ox + 230, oy + 240, 60, '#388e3c');
  circle(ctx, ox + 90, oy + 240, 52, '#2e7d32');
  circle(ctx, ox + 130, oy + 270, 8, '#e74c3c');
  circle(ctx, ox + 180, oy + 250, 8, '#e74c3c');
  if (!active.has('apple-garden')) circle(ctx, ox + 220, oy + 280, 8, '#e74c3c');
  circle(ctx, ox + 160, oy + 300, 8, '#e74c3c');

  // Pond with lily pads; the pink flower is gone on the right.
  ellipse(ctx, ox + 420, oy + 450, 150, 45, '#2b6cb0');
  ellipse(ctx, ox + 360, oy + 445, 34, 12, '#2e7d32');
  ellipse(ctx, ox + 450, oy + 460, 38, 12, '#388e3c');
  ellipse(ctx, ox + 500, oy + 440, 26, 10, '#2e7d32');
  if (!active.has('lily-flower')) {
    circle(ctx, ox + 460, oy + 446, 8, '#f48fb1');
    circle(ctx, ox + 460, oy + 446, 3, '#ffd94d');
  }

  // Fireflies: five on the left, four on the right.
  const flies = [[300, 150], [340, 110], [280, 220], [380, 260], [250, 320]];
  flies.forEach(([fx, fy], i) => {
    if (active.has('firefly-missing') && i === 0) return;
    circle(ctx, ox + fx, oy + fy, 10, 'rgba(255, 235, 120, 0.25)');
    circle(ctx, ox + fx, oy + fy, 4, '#ffeb78');
  });

  // Bench: the middle slat changes colour on the right.
  rect(ctx, ox + 300, oy + 470, 120, 12, active.has('bench-slat') ? '#c0392b' : '#8a5a2b');
  rect(ctx, ox + 300, oy + 490, 120, 10, '#8a5a2b');
  rect(ctx, ox + 308, oy + 500, 10, 34, '#6b4423');
  rect(ctx, ox + 402, oy + 500, 10, 34, '#6b4423');

  // Mushroom: three spots on the left, two on the right.
  rect(ctx, ox + 516, oy + 500, 14, 26, '#f5f0dc');
  poly(ctx, [[ox + 500, oy + 502], [ox + 546, oy + 502], [ox + 523, oy + 472]], '#e74c3c');
  circle(ctx, ox + 514, oy + 490, 4, '#ffffff');
  circle(ctx, ox + 530, oy + 484, 4, '#ffffff');
  if (!active.has('mushroom-spot')) circle(ctx, ox + 522, oy + 496, 4, '#ffffff');

  // Snail on the grass — gone on the right.
  if (!active.has('snail-missing')) {
    ellipse(ctx, ox + 66, oy + 520, 16, 10, '#d9a066');
    circle(ctx, ox + 60, oy + 512, 10, '#8e44ad');
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ox + 60, oy + 512, 5, 0, Math.PI * 1.5); ctx.stroke();
    line(ctx, ox + 80, oy + 516, ox + 88, oy + 508, '#d9a066', 3);
  }

  // Tulips along the bottom.
  [40, 130, 220, 480, 570].forEach((tx, i) => {
    line(ctx, ox + tx, oy + 540, ox + tx, oy + 516, '#2e7d32', 3);
    circle(ctx, ox + tx, oy + 510, 8, ['#e74c3c', '#f48fb1', '#ffd94d', '#e74c3c', '#f48fb1'][i]);
  });
}

// ----------------------------------------------------------------- harbour ---
function drawHarbour(ctx, ox, oy, active) {
  // Dusk sky, sea and dock.
  const sky = ctx.createLinearGradient(ox, oy, ox, oy + 320);
  sky.addColorStop(0, '#ff9a56');
  sky.addColorStop(0.55, '#e95d6a');
  sky.addColorStop(1, '#7b4b94');
  rect(ctx, ox, oy, 610, 320, sky);
  rect(ctx, ox, oy + 320, 610, 180, '#2c4a7c');
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (let y = oy + 350; y < oy + 500; y += 30) {
    ctx.beginPath(); ctx.moveTo(ox + 20, y); ctx.lineTo(ox + 590, y); ctx.stroke();
  }
  rect(ctx, ox, oy + 500, 610, 60, '#8a5a2b');
  ctx.strokeStyle = '#6b4423';
  for (let x = ox + 60; x < ox + 610; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, oy + 500); ctx.lineTo(x, oy + 560); ctx.stroke();
  }

  // Sun: rayed on the left, plain on the right.
  circle(ctx, ox + 120, oy + 240, 36, '#ffd94d');
  if (!active.has('sun-rays')) {
    for (let a = 0; a < 8; a++) {
      const ang = (a * Math.PI) / 4;
      line(ctx, ox + 120 + Math.cos(ang) * 44, oy + 240 + Math.sin(ang) * 44,
        ox + 120 + Math.cos(ang) * 58, oy + 240 + Math.sin(ang) * 58, '#ffd94d', 4);
    }
  }

  // Clouds: three on the left, two on the right.
  ellipse(ctx, ox + 250, oy + 80, 46, 16, '#ffffff');
  ellipse(ctx, ox + 420, oy + 60, 52, 18, '#ffffff');
  if (!active.has('cloud-missing')) ellipse(ctx, ox + 520, oy + 110, 40, 14, '#ffffff');

  // Lighthouse with beam and lamp room.
  rect(ctx, ox + 470, oy + 140, 40, 200, '#f5f0dc');
  rect(ctx, ox + 470, oy + 190, 40, 22, '#e74c3c');
  rect(ctx, ox + 470, oy + 260, 40, 22, '#e74c3c');
  rect(ctx, ox + 465, oy + 110, 50, 30, '#333333');
  rect(ctx, ox + 478, oy + 118, 24, 16, active.has('lamp-window') ? '#2b2b2b' : '#ffe98a');
  poly(ctx, [[ox + 462, oy + 110], [ox + 518, oy + 110], [ox + 490, oy + 88]], '#c0392b');
  // Flag: points left on the left panel, right on the right.
  if (active.has('flag-direction')) poly(ctx, [[ox + 490, oy + 66], [ox + 490, oy + 88], [ox + 514, oy + 77]], '#ffd94d');
  else poly(ctx, [[ox + 490, oy + 66], [ox + 490, oy + 88], [ox + 466, oy + 77]], '#ffd94d');
  // Beam: shining on the left, off on the right.
  if (!active.has('beam-off')) {
    ctx.fillStyle = 'rgba(255, 233, 138, 0.35)';
    ctx.beginPath();
    ctx.moveTo(ox + 465, oy + 125);
    ctx.lineTo(ox + 300, oy + 90);
    ctx.lineTo(ox + 300, oy + 160);
    ctx.closePath();
    ctx.fill();
  }

  // Boats. The small boat's sail loses its red stripe on the right.
  poly(ctx, [[ox + 130, oy + 380], [ox + 190, oy + 380], [ox + 160, oy + 400]], '#5d4037');
  line(ctx, ox + 160, oy + 380, ox + 160, oy + 320, '#5d4037', 4);
  poly(ctx, [[ox + 160, oy + 322], [ox + 160, oy + 378], [ox + 205, oy + 378]], '#ffffff');
  poly(ctx, [[ox + 310, oy + 420], [ox + 360, oy + 420], [ox + 335, oy + 436]], '#6b4423');
  line(ctx, ox + 335, oy + 420, ox + 335, oy + 372, '#6b4423', 3);
  poly(ctx, [[ox + 335, oy + 374], [ox + 335, oy + 418], [ox + 370, oy + 418]], '#ffffff');
  if (!active.has('sail-stripe')) line(ctx, ox + 335, oy + 396, ox + 352, oy + 396, '#e74c3c', 5);

  // Gulls: four on the left, three on the right.
  const gulls = [[200, 150], [260, 120], [350, 170], [430, 90]];
  gulls.forEach(([gx, gy], i) => {
    if (active.has('gull-missing') && i === 2) return;
    ctx.strokeStyle = '#222'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(ox + gx - 6, oy + gy, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(ox + gx + 6, oy + gy, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  });

  // Buoy: bobbing on the left, gone on the right.
  if (!active.has('buoy-missing')) {
    poly(ctx, [[ox + 240, oy + 482], [ox + 262, oy + 482], [ox + 251, oy + 458]], '#e74c3c');
    rect(ctx, ox + 244, oy + 470, 14, 6, '#ffffff');
    circle(ctx, ox + 251, oy + 456, 3, '#ffd94d');
  }

  // Crates on the dock: three on the left, two on the right.
  rect(ctx, ox + 60, oy + 460, 40, 40, '#c89b5a');
  line(ctx, ox + 60, oy + 460, ox + 100, oy + 500, '#8a5a2b', 2);
  line(ctx, ox + 100, oy + 460, ox + 60, oy + 500, '#8a5a2b', 2);
  if (!active.has('crate-missing')) {
    rect(ctx, ox + 108, oy + 466, 36, 34, '#b58545');
    line(ctx, ox + 108, oy + 466, ox + 144, oy + 500, '#8a5a2b', 2);
  }
  rect(ctx, ox + 152, oy + 470, 32, 30, '#c89b5a');

  // Rope coil: coiled on the left, gone on the right.
  if (!active.has('rope-missing')) {
    ctx.strokeStyle = '#d9c08a'; ctx.lineWidth = 5;
    [18, 12, 6].forEach((r) => {
      ctx.beginPath(); ctx.arc(ox + 540, oy + 522, r, 0, Math.PI * 2); ctx.stroke();
    });
  }
}

export const SCENES = [
  {
    id: 'kitchen', name: 'Cozy Kitchen', draw: drawKitchen,
    diffs: [
      { id: 'clock-hands', label: 'clock hands moved', x: 520, y: 180, r: 40 },
      { id: 'cat-missing', label: 'sleeping cat gone', x: 140, y: 498, r: 46 },
      { id: 'jar-color', label: 'jar changed colour', x: 427, y: 65, r: 30 },
      { id: 'apple-missing', label: 'apple missing', x: 474, y: 408, r: 22 },
      { id: 'picture-moon', label: 'picture turned to night', x: 120, y: 315, r: 52 },
      { id: 'cup-missing', label: 'cup missing', x: 359, y: 384, r: 28 },
      { id: 'plant-leaf', label: 'plant lost a leaf', x: 552, y: 82, r: 30 },
    ],
  },
  {
    id: 'garden', name: 'Night Garden', draw: drawGarden,
    diffs: [
      { id: 'star-missing', label: 'star missing', x: 120, y: 80, r: 22 },
      { id: 'moon-crescent', label: 'moon turned crescent', x: 480, y: 90, r: 42 },
      { id: 'apple-garden', label: 'apple missing', x: 220, y: 280, r: 22 },
      { id: 'lily-flower', label: 'lily flower gone', x: 460, y: 446, r: 22 },
      { id: 'firefly-missing', label: 'firefly missing', x: 300, y: 150, r: 22 },
      { id: 'bench-slat', label: 'bench slat recoloured', x: 360, y: 476, r: 34 },
      { id: 'mushroom-spot', label: 'mushroom lost a spot', x: 522, y: 490, r: 24 },
      { id: 'snail-missing', label: 'snail gone', x: 66, y: 514, r: 26 },
    ],
  },
  {
    id: 'harbour', name: 'Harbour at Dusk', draw: drawHarbour,
    diffs: [
      { id: 'sun-rays', label: 'sun lost its rays', x: 120, y: 240, r: 46 },
      { id: 'cloud-missing', label: 'cloud missing', x: 520, y: 110, r: 34 },
      { id: 'beam-off', label: 'lighthouse beam off', x: 380, y: 125, r: 46 },
      { id: 'lamp-window', label: 'lamp room dark', x: 490, y: 126, r: 22 },
      { id: 'sail-stripe', label: 'sail lost its stripe', x: 344, y: 396, r: 24 },
      { id: 'gull-missing', label: 'gull missing', x: 350, y: 170, r: 22 },
      { id: 'buoy-missing', label: 'buoy gone', x: 251, y: 470, r: 24 },
      { id: 'crate-missing', label: 'crate missing', x: 126, y: 483, r: 26 },
      { id: 'rope-missing', label: 'rope coil gone', x: 540, y: 522, r: 26 },
      { id: 'flag-direction', label: 'flag points the other way', x: 490, y: 77, r: 24 },
    ],
  },
];
