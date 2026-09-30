"use client";

import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef } from "react";
import { cx } from "../cx";
import {
  DOT_PALETTES,
  type DotMotion,
  type DotPalette,
  type DotPaletteName,
  makeRibbons,
  renderField,
} from "./field";
import "./DotField.css";

export interface DotFieldProps {
  /** Named palette or a custom one. */
  palette?: DotPaletteName | DotPalette;
  /** `flow` drifts, `breathe` only pulses in place, `still` draws one frame. */
  motion?: DotMotion;
  /** Distance between dot centres, in CSS px. */
  gap?: number;
  /** Dot diameter as a fraction of `gap` (0–1). */
  dotSize?: number;
  /** Groups dots in `pixel`×`pixel` blocks that share a colour: the chunky, bitmap look. */
  pixel?: number;
  /** Animation speed multiplier. */
  speed?: number;
  /** Multiplies the palette's opacity (0–1.5). */
  intensity?: number;
  /** Changes the composition (ribbon angles, offsets, colours). */
  seed?: number;
  /** Frame cap; the field is slow by design, 30 is plenty. */
  fps?: number;
  /**
   * `palette` paints the palette's own background; `theme` leaves the canvas transparent
   * over the theme's dotted paper (`--pt-bg`), so it follows Mist / Ink.
   */
  surface?: "palette" | "theme";
  className?: string;
  style?: CSSProperties;
  /** Rendered above the dots. */
  children?: ReactNode;
}

/** A repeating tile with one round dot, used both as mask and as the faint paper grid. */
function dotPattern(ctx: CanvasRenderingContext2D, cell: number, size: number, color = "#000") {
  const tile = document.createElement("canvas");
  tile.width = cell;
  tile.height = cell;
  const t = tile.getContext("2d");
  if (!t) return null;
  t.fillStyle = color;
  t.beginPath();
  t.arc(cell / 2, cell / 2, Math.max(0.5, (cell * size) / 2), 0, Math.PI * 2);
  t.fill();
  return ctx.createPattern(tile, "repeat");
}

/**
 * A dot-matrix surface with slow ribbons of colour running through it — the signature
 * texture of Punto. Decorative: the canvas is hidden from assistive tech, and with
 * `prefers-reduced-motion` it renders a single still frame.
 */
export function DotField({
  palette = "aurora",
  motion = "flow",
  gap = 8,
  dotSize = 0.62,
  pixel = 1,
  speed = 1,
  intensity = 1,
  seed = 7,
  fps = 30,
  surface = "palette",
  className,
  style,
  children,
}: DotFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pal = typeof palette === "string" ? DOT_PALETTES[palette] : palette;
  const ribbons = useMemo(() => makeRibbons(seed), [seed]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const small = document.createElement("canvas");
    const sctx = small.getContext("2d");
    if (!sctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ownPaper = surface === "palette";
    let cell = 8;
    let cols = 0;
    let rows = 0;
    let image: ImageData | null = null;
    let mask: CanvasPattern | null = null;
    let faint: CanvasPattern | null = null;
    let raf = 0;
    let last = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = root.getBoundingClientRect();
      // Integer cell in device pixels so the mask pattern and the scaled field line up.
      cell = Math.max(2, Math.round(gap * dpr));
      cols = Math.ceil((width * dpr) / cell);
      rows = Math.ceil((height * dpr) / cell);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      small.width = Math.max(1, cols);
      small.height = Math.max(1, rows);
      image = cols && rows ? sctx.createImageData(cols, rows) : null;
      mask = dotPattern(ctx, cell, dotSize);
      faint = pal.faint && ownPaper ? dotPattern(ctx, cell, dotSize * 0.7, pal.faint) : null;
      draw(performance.now());
    };

    const draw = (now: number) => {
      if (!image) return;
      const time = ((now - start) / 1000) * speed;
      renderField(image.data, {
        cols,
        rows,
        time,
        motion: reduced.matches ? "still" : motion,
        palette: pal,
        ribbons,
        pixel,
        intensity,
      });
      sctx.putImageData(image, 0, 0);

      const w = canvas.width;
      const h = canvas.height;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      // 1. The field, one pixel per dot, blown up without smoothing.
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, cols * cell, rows * cell);
      // 2. Punch it through a grid of round dots.
      if (mask) {
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = mask;
        ctx.fillRect(0, 0, w, h);
      }
      // 3. Paper underneath: faint dots, then the background colour.
      ctx.globalCompositeOperation = "destination-over";
      if (faint) {
        ctx.fillStyle = faint;
        ctx.fillRect(0, 0, w, h);
      }
      if (pal.background && ownPaper) {
        ctx.fillStyle = pal.background;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const animated = () => motion !== "still" && !reduced.matches;
    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden || !animated()) return;
      if (now - last >= 1000 / fps) {
        last = now;
        draw(now);
      }
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible && !document.hidden && animated()) raf = requestAnimationFrame(frame);
      else if (!animated()) draw(performance.now());
    };

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    // Don't burn CPU on fields scrolled out of view (Storybook docs pages render many).
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      kick();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", kick);
    reduced.addEventListener("change", kick);
    resize();
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", kick);
      reduced.removeEventListener("change", kick);
    };
  }, [pal, motion, gap, dotSize, pixel, speed, intensity, ribbons, fps, surface]);

  return (
    <div
      ref={rootRef}
      className={cx("pt-dotfield", surface === "theme" && "pt-dot-paper", className)}
      style={style}
    >
      {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: a bare canvas is not focusable; it is pure decoration */}
      <canvas ref={canvasRef} className="pt-dotfield__canvas" aria-hidden="true" />
      {children != null && <div className="pt-dotfield__content">{children}</div>}
    </div>
  );
}
