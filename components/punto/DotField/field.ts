/**
 * Colour field behind <DotField>. Pure functions: given a cell and a time, return the
 * colour and coverage of that dot. The component rasterises this into one pixel per dot
 * and lets the canvas scale + mask it, so the per-frame cost is cols × rows evaluations
 * and three draw calls, whatever the size of the dots.
 */

export type Rgb = readonly [number, number, number];

export interface DotPalette {
  /** Canvas background (behind the faint dots). `null` = transparent. */
  background: string | null;
  /** Faint dot grid over the whole surface. `null` = none. */
  faint: string | null;
  /** Colour ramp sampled along each ribbon. */
  ramp: readonly Rgb[];
  /** Peak opacity of the ribbons (sober palettes stay low). */
  strength: number;
}

const hex = (h: string): Rgb => {
  const n = Number.parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const DOT_PALETTES = {
  /** The full poster: violet → magenta → coral over mist. */
  aurora: {
    background: "#e9e7f2",
    faint: "rgba(80, 70, 120, 0.10)",
    ramp: ["#5a5cf0", "#9b52e8", "#e8399a", "#ff4f7a", "#ff6a4a", "#ff9fc8"].map(hex),
    strength: 1,
  },
  /** Warm only: magenta / coral / peach. */
  ember: {
    background: "#f3ecee",
    faint: "rgba(120, 60, 80, 0.09)",
    ramp: ["#e8399a", "#f23f6b", "#ff5b4a", "#ff8f66", "#ffb3a0"].map(hex),
    strength: 0.95,
  },
  /** Cool only: indigo / violet / orchid. */
  dusk: {
    background: "#e6e6f2",
    faint: "rgba(60, 60, 120, 0.10)",
    ramp: ["#4f5ff0", "#6d5cf5", "#9457e8", "#b98cf0", "#c9c5ff"].map(hex),
    strength: 0.9,
  },
  /** Sober: ink dots on mist, no hue at all. */
  graphite: {
    background: "#eeecf5",
    faint: "rgba(21, 18, 31, 0.07)",
    ramp: ["#15121f", "#37324a", "#6d6783", "#37324a"].map(hex),
    strength: 0.55,
  },
  /** Sober on dark: mist dots on ink. */
  night: {
    background: "#15121f",
    faint: "rgba(255, 255, 255, 0.05)",
    ramp: ["#c9c5dc", "#ff9fc8", "#b98cf0", "#c9c5dc"].map(hex),
    strength: 0.6,
  },
  /** The four hearts of the Mariaje logo: blue, green, pink and orange over mist. */
  mariaje: {
    background: "#eeecf5",
    faint: "rgba(60, 50, 90, 0.09)",
    ramp: ["#3aaee8", "#9ec23e", "#e0468f", "#f09a38", "#e0468f"].map(hex),
    strength: 0.9,
  },
  /** Barely there: a texture, not an image. */
  paper: {
    background: "#f7f6fb",
    faint: "rgba(21, 18, 31, 0.06)",
    ramp: ["#c9c5dc", "#dcc4dc", "#c9c5dc"].map(hex),
    strength: 0.7,
  },
} satisfies Record<string, DotPalette>;

export type DotPaletteName = keyof typeof DOT_PALETTES;

/** How the field moves. `still` renders a single frame. */
export type DotMotion = "flow" | "breathe" | "still";

interface Ribbon {
  angle: number;
  offset: number;
  amp: number;
  freq: number;
  phase: number;
  width: number;
  speed: number;
  hueShift: number;
}

/** Small deterministic PRNG so a `seed` always gives the same composition. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRibbons(seed: number, count = 3): Ribbon[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => ({
    // Mostly diagonal sweeps, like brush strokes crossing the frame.
    angle: -0.9 + rnd() * 1.8,
    offset: -0.35 + (i / Math.max(1, count - 1)) * 0.7 + (rnd() - 0.5) * 0.15,
    amp: 0.12 + rnd() * 0.18,
    freq: 1.6 + rnd() * 2.2,
    phase: rnd() * Math.PI * 2,
    width: 0.1 + rnd() * 0.1,
    speed: (0.25 + rnd() * 0.35) * (rnd() < 0.5 ? -1 : 1),
    hueShift: rnd(),
  }));
}

/** 4×4 Bayer matrix, normalised to (0, 1): gives the dithered, dotted fade at the edges. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

export function bayer(col: number, row: number): number {
  return BAYER[(row & 3) * 4 + (col & 3)] ?? 0.5;
}

function sampleRamp(ramp: readonly Rgb[], p: number, out: number[]): void {
  const n = ramp.length;
  const x = (((p % 1) + 1) % 1) * n;
  const i = Math.floor(x);
  const f = x - i;
  const a = ramp[i % n] ?? ramp[0] ?? [0, 0, 0];
  const b = ramp[(i + 1) % n] ?? a;
  // Smoothstep between stops so the ramp never shows a seam.
  const s = f * f * (3 - 2 * f);
  out[0] = a[0] + (b[0] - a[0]) * s;
  out[1] = a[1] + (b[1] - a[1]) * s;
  out[2] = a[2] + (b[2] - a[2]) * s;
}

export interface FieldParams {
  cols: number;
  rows: number;
  /** Seconds. */
  time: number;
  motion: DotMotion;
  palette: DotPalette;
  ribbons: readonly Ribbon[];
  /** Sample the field once per `pixel`×`pixel` block of dots (the chunky look). */
  pixel: number;
  /** Multiplies the palette strength. */
  intensity: number;
}

/**
 * Fills `data` (RGBA, cols × rows) with the field. Coordinates are normalised on the
 * short side so the composition keeps its proportions at any aspect ratio.
 */
export function renderField(data: Uint8ClampedArray, p: FieldParams): void {
  const { cols, rows, time, motion, palette, ribbons, intensity } = p;
  const pixel = Math.max(1, Math.round(p.pixel));
  const scale = 1 / Math.min(cols, rows);
  const cx = cols / 2;
  const cy = rows / 2;
  const t = motion === "flow" ? time : 0;
  const breath = motion === "breathe" ? 0.82 + 0.18 * Math.sin(time * 0.9) : 1;
  const strength = palette.strength * intensity * breath;
  const trig = ribbons.map((r) => [Math.cos(r.angle), Math.sin(r.angle)] as const);
  const rgb = [0, 0, 0];

  for (let row = 0; row < rows; row++) {
    const sr = Math.floor(row / pixel) * pixel + (pixel - 1) / 2;
    for (let col = 0; col < cols; col++) {
      const sc = Math.floor(col / pixel) * pixel + (pixel - 1) / 2;
      const x = (sc - cx) * scale;
      const y = (sr - cy) * scale;

      let r = 0;
      let g = 0;
      let b = 0;
      let cover = 0;
      for (let i = 0; i < ribbons.length; i++) {
        const rb = ribbons[i];
        const tr = trig[i];
        if (!rb || !tr) continue;
        // Rotate into the ribbon's frame: u runs along it, v across it.
        const u = x * tr[0] + y * tr[1];
        const v = -x * tr[1] + y * tr[0];
        const centre =
          rb.offset +
          rb.amp * Math.sin(u * rb.freq + rb.phase + t * rb.speed) +
          rb.amp * 0.35 * Math.sin(u * rb.freq * 2.3 - t * rb.speed * 0.7);
        const width = rb.width * (1 + 0.25 * Math.sin(u * 3 + t * 0.4 + rb.phase));
        const d = (v - centre) / width;
        const k = Math.exp(-d * d);
        if (k < 0.01) continue;
        sampleRamp(palette.ramp, u * 0.45 + rb.hueShift + t * 0.03, rgb);
        r += (rgb[0] ?? 0) * k;
        g += (rgb[1] ?? 0) * k;
        b += (rgb[2] ?? 0) * k;
        cover += k;
      }

      const o = (row * cols + col) * 4;
      if (cover < 0.01) {
        data[o + 3] = 0;
        continue;
      }
      const a = Math.min(1, cover) * strength;
      // Dither the soft edge: a dot either shows or it doesn't, like a halftone.
      const threshold = bayer(col, row) * 0.55;
      data[o] = r / cover;
      data[o + 1] = g / cover;
      data[o + 2] = b / cover;
      data[o + 3] = a < threshold ? 0 : Math.min(255, (0.35 + 0.65 * a) * 255);
    }
  }
}
