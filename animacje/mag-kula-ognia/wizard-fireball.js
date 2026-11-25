import { chain, poseAt, skeleton, STAND, PAL, hex, clamp, smooth, Rng } from "../../core/index.js";
import * as charge from "../arcane/spell-charge.js";
import * as fireball from "../fire/fireball.js";
import * as blast from "../explosions/small-explosion.js";

// A grey wanderer-wizard of the old tales: tall pointed hat, long beard, robe to the floor and a gnarled staff. He lifts the
// staff high, fire gathers at its head, and he drives it forward: the fireball leaves the staff and the target goes up.
// The wizard is drawn over the stock body from its own skeleton, so he follows every pose of the act.

const RAISE_T = 0.45, THROW = 1.35, SPEED = 330, TX = 200;

export const meta = {
  name: "Wizard fireball",
  desc: "A grey-robed wizard with a pointed hat and a gnarled staff raises it high, fire gathers at its head, and he drives it forward: a fireball streaks to the target and bursts.",
  tags: ["move", "fire", "spell", "wizard", "mage", "staff", "projectile", "explosion", "one-shot"],
  size: [376, 248],
  origin: [64, 202],
  duration: 0,
  loop: false,
  fps: 30,
  bg: "ground",
  actor: 2,
  options: { seed: 3 },
};

// ---- the act -------------------------------------------------------------------------------------------------------------
const REST = { crouch: 1, fx: 9, fy: -20, bx: 5, by: -15, ffx: 4, fbx: -5 };
const RAISE = { crouch: 2, lean: -3, fx: 9, fy: -37, bx: 16, by: -27, ffx: 6, fbx: -7, turn: 0.6 };
const STRAIN = { ...RAISE, crouch: 3, lean: -3, fy: -37, bx: 15, by: -28 };
const COCK = { ...RAISE, x: -2, crouch: 4, lean: -6, fx: 6, fy: -37, bx: 13, by: -25 };
const THROWN = { x: 7, crouch: 5, lean: 7, fx: 18, fy: -30, bx: -5, by: -21, ffx: 13, fbx: -9, toeB: true };
const SETTLE = { ...THROWN, crouch: 3, lean: 4, fy: -28 };

// where the staff points, in radians from upright (+ leans forward), keyed like the poses
const SA_KEYS = [[0, 0.06], [RAISE_T, 0.12], [THROW - 0.05, -0.2], [THROW, 0.95], [THROW + 0.5, 0.75], [THROW + 1.4, 0.2], [THROW + 2.1, 0.06]];
const STAFF_UP = 28, STAFF_DOWN = 22;

// the staff head at the moment of release: where the fireball leaves from
const tipFor = (q, a) => {
  const J = skeleton(q).joints, H = J.handN, X = Math.round(q.x ?? 0), Y = Math.round(q.y ?? 0);
  return [H[0] + X + Math.sin(a) * (STAFF_UP + 2), H[1] + Y - Math.cos(a) * (STAFF_UP + 2)];
};
const TIP0 = tipFor(THROWN, 0.95), FLY = (TX - TIP0[0]) / SPEED, HIT = THROW + FLY, END = HIT + 5.4;
meta.duration = END;

const FLINCH = { turn: 0.9, x: 7, crouch: 5, lean: -3, fx: -4, fy: -36, bx: 5, by: -33, ffx: 4, fbx: -4 };
export const act = {
  target: { x: TX },
  poses: [
    [0, REST],
    [0.15, REST],
    [RAISE_T, RAISE, "out"],
    [0.75, STRAIN],
    [1.0, RAISE],
    [THROW - 0.08, COCK, "in"],
    [THROW, THROWN, "snap"],
    [HIT - 0.02, SETTLE],
    [HIT + 0.5, { ...SETTLE, lean: 2 }],
    [THROW + 1.4, { ...REST, x: 4, crouch: 2 }],
    [THROW + 2.1, REST],
    [END, REST],
  ],
  hits: [
    { t: HIT, stop: 0.18, shake: 0.4, amp: 3, push: 3.4, straw: 34, skin: "char" },
    { t: HIT + 4.8, push: 0, straw: 0, flash: 0, skin: null },
  ],
  dust: [{ t: THROW, x: 13, n: 8, dir: 1 }, { t: THROW, x: -4, n: 4, dir: -1 }],
};
void FLINCH;

// the same pose the act shows: its 12 fps steps, and the breath it takes while held (as createAct does)
function isHeld(track, t) {
  if (t >= track[track.length - 1][0] || t < track[0][0]) return true;
  for (let i = 0; i < track.length - 1; i++) {
    if (t >= track[i + 1][0]) continue;
    const a = { ...STAND, ...track[i][1] }, b = { ...STAND, ...track[i + 1][1] };
    return track[i + 1][0] - track[i][0] > 0.4 && ["fx", "fy", "bx", "by", "crouch", "lean", "x", "y"].every((k) => Math.abs((a[k] ?? 0) - (b[k] ?? 0)) < 1.5);
  }
  return false;
}
function poseNow(t) {
  let q = poseAt(act.poses, t);
  if (isHeld(act.poses, t)) {
    const up = Math.floor(t * 3) & 1;
    q = { ...STAND, ...q, crouch: (q.crouch ?? 0) + up, fy: (q.fy ?? STAND.fy) + up, by: (q.by ?? STAND.by) + up };
  }
  return q;
}
function staffAngle(t) {
  const K = SA_KEYS;
  if (t <= K[0][0]) return K[0][1];
  for (let i = 0; i < K.length - 1; i++) {
    const [t0, a] = K[i], [t1, b] = K[i + 1];
    if (t >= t1) continue;
    if (t1 === THROW) return a; // snaps with the throw
    const s = t0 + Math.floor((t - t0) * 12 + 1e-6) / 12, u = (s - t0) / (t1 - t0);
    return a + (b - a) * u * u * (3 - 2 * u);
  }
  return K[K.length - 1][1];
}

// ---- the wizard ----------------------------------------------------------------------------------------------------------
const C = Object.fromEntries(Object.entries({
  ink: "#15111c",
  robeD: "#3b3e4b", robe: "#585c6c", robeL: "#7d8293", robeH: "#a3a8b6",
  hatD: "#3f4250", hat: "#5f6373", hatL: "#868b9b",
  beardD: "#8f9099", beard: "#c4c5cc", beardL: "#e9e9ee",
  skin: "#e2ad8e", skinD: "#b07b63", eye: "#15111c",
  woodD: "#4a2e1a", wood: "#7a4f2c", woodL: "#a3703f",
  belt: "#2c2a33", cord: "#8d7a54", boot: "#2a2430",
}).map(([k, v]) => [k, hex(v)]));

const rnd = (v) => Math.round(v);
function inked(p, pts, c) {
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) p.poly(pts.map(([x, y]) => [x + dx, y + dy]), C.ink);
  p.poly(pts, c);
}
function sleeve(p, A, B, Hd, w, c, cl) {
  p.beam(A[0], A[1], B[0], B[1], w + 2, C.ink);
  p.beam(B[0], B[1], Hd[0], Hd[1], w + 3, C.ink);
  p.beam(A[0], A[1], B[0], B[1], w, c);
  p.beam(B[0], B[1], Hd[0], Hd[1], w + 1, c);
  // a lit crease along the top of the arm
  p.line(A[0], A[1] - 1, B[0], B[1] - 1, cl);
}

function drawWizard(p, t) {
  const q = poseNow(t), X = rnd(q.x ?? 0), Y = rnd(q.y ?? 0), J0 = skeleton(q).joints;
  const J = Object.fromEntries(Object.entries(J0).map(([k, v]) => [k, [v[0] + X, v[1] + Y]]));
  const lean = q.lean ?? 0, hd = J.head, cr = J.crown, nk = J.neck, pv = J.pelvis, ws = J.waist;
  const sway = Math.sin(t * 5.3) * 0.6, gust = clamp((lean - 2) / 5, 0, 1); // the hem flies back when he lunges

  // the far arm, behind everything
  sleeve(p, J.shoulderF, J.elbowF, J.handF, 3, C.robeD, C.robe);
  p.rect(J.handF[0] - 1, J.handF[1] - 1, 2, 2, C.skinD);

  // long grey hair down his back
  inked(p, [[cr[0] - 2, cr[1] + 1], [cr[0] - 5, hd[1] + 3], [nk[0] - 6 - gust * 2, nk[1] + 5], [nk[0] - 1, nk[1] + 2]], C.beardD);

  // the robe: shoulders to the floor, wider at the hem
  const feetL = Math.min(J.ankleN[0], J.ankleF[0], J.toeN[0], J.toeF[0]), feetR = Math.max(J.ankleN[0], J.ankleF[0], J.toeN[0], J.toeF[0]);
  const sL = Math.min(J.shoulderN[0], J.shoulderF[0]) - 2, sR = Math.max(J.shoulderN[0], J.shoulderF[0]) + 2;
  const hemL = feetL - 3 - gust * 2 + sway, hemR = feetR + 3 - gust * 2 + sway, hemY = -2;
  const robe = [[sL, nk[1] + 1], [sR, nk[1] + 1], [sR + 1, ws[1]], [hemR, hemY], [hemR - 2, hemY + 1], [hemL + 2, hemY + 1], [hemL, hemY], [sL - 1, ws[1]]];
  // boots peeking out under the hem
  for (const toe of [J.toeF, J.toeN]) p.rect(toe[0] - 4, -2, 5, 2, C.boot);
  inked(p, robe, C.robe);
  // light from the upper left, shadow on the right, folds falling from the belt
  p.poly([[sL, nk[1] + 1], [sL + 3, nk[1] + 1], [hemL + 4, hemY], [hemL + 1, hemY]], C.robeL);
  p.poly([[sR - 2, nk[1] + 2], [sR, nk[1] + 1], [sR + 1, ws[1]], [hemR, hemY], [hemR - 4, hemY]], C.robeD);
  for (const f of [-0.35, 0.1, 0.5]) {
    const top = [ws[0] + f * 6, ws[1] + 2], bot = [hemL + (hemR - hemL) * (0.5 + f * 0.7), hemY];
    p.line(top[0], top[1], bot[0], bot[1], C.robeD);
  }
  p.line(sL + 1, nk[1] + 2, hemL + 2, hemY - 1, C.robeH);
  // the rope belt, a knot and a hanging end
  p.line(sL, ws[1] + 1, sR + 1, ws[1] + 1, C.belt);
  p.line(sL, ws[1] + 2, sR + 1, ws[1] + 2, C.cord);
  p.line(ws[0] + 2, ws[1] + 2, ws[0] + 1 - gust * 2, ws[1] + 8, C.cord);

  // a raised arm goes behind the head, so the face stays seen
  const H = J.handN, raised = H[1] < J.shoulderN[1] - 4;
  if (raised) sleeve(p, J.shoulderN, J.elbowN, H, 3, C.robe, C.robeL);

  // face, nose, a bushy brow and an eye under it
  const fx0 = hd[0] - 1, fy0 = hd[1] - 2;
  p.rect(fx0 - 1, fy0 - 1, 7, 7, C.ink);
  p.rect(fx0, fy0, 5, 6, C.skin);
  p.px(fx0 + 5, fy0 + 3, C.skin);
  p.px(fx0 + 5, fy0 + 4, C.skinD);
  p.px(fx0 + 6, fy0 + 3, C.ink);
  p.px(fx0 + 3, fy0 + 2, C.eye);
  p.px(fx0, fy0 + 3, C.skinD);
  p.line(fx0 + 2, fy0 + 1, fx0 + 5, fy0 + 1, C.beardL);

  // the beard: from the chin down over the chest to the belt, stirred by the motion
  const bTip = [hd[0] + 2 + sway - gust * 3, ws[1] - 1];
  inked(p, [[fx0 + 1, fy0 + 5], [fx0 + 6, fy0 + 5], [hd[0] + 5, nk[1] + 4], bTip, [hd[0] - 1, nk[1] + 4]], C.beard);
  p.line(fx0 + 3, fy0 + 6, bTip[0], bTip[1] - 1, C.beardL);
  p.line(fx0 + 5, fy0 + 7, bTip[0] + 1, bTip[1] - 3, C.beardD);
  p.line(fx0 + 2, fy0 + 5, fx0 + 6, fy0 + 5, C.beardL); // moustache

  // the hat: a wide brim and a tall crumpled cone, its tip flopping back
  const back = 2.5 + gust * 2 - lean * 0.4, base = cr[1] + 1, cx = cr[0] + 0.5;
  const tip = [cx - back, base - 14], flop = [tip[0] - 4, tip[1] + 3 + sway];
  inked(p, [[cx - 4, base], [cx + 4, base], [cx + 1 - back * 0.5, base - 8], tip, [cx - 3 - back * 0.4, base - 7]], C.hat);
  p.line(tip[0], tip[1], flop[0], flop[1], C.ink);
  p.line(tip[0], tip[1] + 1, flop[0] + 1, flop[1], C.hatD);
  p.line(cx - 3, base - 1, tip[0] - 0.5, tip[1] + 1, C.hatL);
  p.line(cx + 3, base - 1, cx - back * 0.5, base - 8, C.hatD);
  p.ellipse(cx, base, 10, 2.2, C.ink);
  p.ellipse(cx, base, 9, 1.4, C.hat);
  p.line(cx - 8, base - 1, cx - 1, base - 1, C.hatL);
  p.line(cx + 1, base + 1, cx + 8, base + 1, C.hatD);

  // the staff: gnarled wood through the near hand, a knot and a crook at its head
  const a = staffAngle(t), u = [Math.sin(a), -Math.cos(a)];
  const top = [H[0] + u[0] * STAFF_UP, H[1] + u[1] * STAFF_UP], bot = [H[0] - u[0] * STAFF_DOWN, Math.min(0, H[1] - u[1] * STAFF_DOWN)];
  p.beam(bot[0], bot[1], top[0], top[1], 3, C.ink);
  p.line(bot[0], bot[1], top[0], top[1], C.wood);
  p.line(bot[0] - 1, bot[1], top[0] - 1, top[1], C.woodL);
  const n = [-u[1], u[0]]; // across the staff
  const crook = [top[0] + u[0] * 3 - n[0] * 3, top[1] + u[1] * 3 - n[1] * 3];
  p.beam(top[0], top[1], crook[0], crook[1], 3, C.ink);
  p.line(top[0], top[1], crook[0], crook[1], C.woodD);
  p.px(top[0] + n[0] * 1.5, top[1] + n[1] * 1.5, C.woodL);
  p.px(H[0] + u[0] * 9 + n[0], H[1] + u[1] * 9 + n[1], C.woodD); // a knot

  // the near arm and the hand round the staff
  if (!raised) sleeve(p, J.shoulderN, J.elbowN, H, 3, C.robe, C.robeL);
  p.rect(H[0] - 1, H[1] - 1, 3, 3, C.skin);
  p.px(H[0] + 1, H[1] + 1, C.skinD);
}

// ---- the spell ------------------------------------------------------------------------------------------------------------
const tipAt = (t) => tipFor(poseNow(t), staffAngle(t));
const run = chain([
  // the charge is drawn with its orb at (15, -22): put that on the staff head
  { fx: charge, t: RAISE_T - 0.1, until: THROW, palette: PAL.fire, x: (t) => tipAt(t)[0] - 15, y: (t) => tipAt(t)[1] + 22 },
  { fx: fireball, t: THROW, until: HIT, x: (t) => TIP0[0] + (t - THROW) * SPEED, y: (t) => TIP0[1] + (-22 - TIP0[1]) * clamp((t - THROW) / FLY, 0, 1) },
  { fx: blast, t: HIT, x: TX },
]);

export function create(o) {
  const spell = run(o), R = new Rng(o.seed ?? 3), sparks = [];
  let t = 0;
  return {
    update(dt) {
      t += dt;
      spell.update(dt);
      // embers shed by the staff head while the fire gathers
      if (t > RAISE_T && t < THROW && R.next() < dt * 30) {
        const [x, y] = tipAt(t);
        sparks.push({ x: x + R.range(-3, 3), y: y + R.range(-3, 3), vx: R.range(-18, 10), vy: R.range(-30, -8), age: 0, life: R.range(0.3, 0.8) });
      }
      for (const s of sparks) { s.age += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vx *= 1 - dt * 2; }
      for (let i = sparks.length - 1; i >= 0; i--) if (sparks[i].age > sparks[i].life) sparks.splice(i, 1);
    },
    drawBack(p) { spell.drawBack(p); },
    draw(p) {
      drawWizard(p, t);
      // firelight on him while the staff burns, and a white flash as it lets go
      const glow = smooth(RAISE_T, THROW - 0.2, t) * (1 - smooth(THROW, THROW + 0.35, t));
      if (glow > 0) {
        const [x, y] = tipAt(t);
        p.glow(x, y, 34, hex("#ff8a2a"), 0.35 * glow);
      }
      if (t >= THROW && t < THROW + 0.07) {
        p.glow(TIP0[0], TIP0[1], 22, hex("#fff3a6"), 0.9);
        p.circle(TIP0[0], TIP0[1], 4, hex("#ffffff"));
      }
      for (const s of sparks) {
        const k = s.age / s.life;
        p.px(s.x, s.y, hex(k < 0.4 ? "#ffe26b" : k < 0.75 ? "#ff8a2a" : "#c9281f"));
        if (k < 0.5) p.light(s.x, s.y, hex("#ff8a2a"), 0.5);
      }
      spell.draw(p);
    },
  };
}
