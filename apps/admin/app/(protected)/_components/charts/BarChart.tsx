"use client";

import { useState } from "react";
import { CHART_COLORS, CHART_TEXT } from "../../../_lib/chartPalette";

type BarDatum = { label: string; value: number };

function Tooltip({ label, value }: { label: string; value: number }) {
  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-lg">
      <div className="font-semibold">{value}件</div>
      <div className="text-neutral-300">{label}</div>
    </div>
  );
}

export function HorizontalBarChart({ data }: { data: BarDatum[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex flex-col gap-3">
      {data.map((d, i) => {
        const color = CHART_COLORS[i % CHART_COLORS.length];
        const widthPct = (d.value / max) * 100;
        return (
          <div key={d.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 truncate text-xs" style={{ color: CHART_TEXT.secondary }}>
              {d.label}
            </span>
            <div className="relative flex-1">
              <div className="relative h-5 w-full rounded bg-neutral-100">
                <div
                  className="h-5 rounded-r"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: color,
                    opacity: hovered === null || hovered === i ? 1 : 0.45,
                    transition: "opacity 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
                {hovered === i && <Tooltip label={d.label} value={d.value} />}
              </div>
            </div>
            <span className="w-12 shrink-0 text-right text-xs tabular-nums" style={{ color: CHART_TEXT.primary }}>
              {d.value}件
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function TrendBarChart({ data }: { data: BarDatum[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const plotHeight = 120;
  const color = CHART_COLORS[0];
  const maxIndex = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);

  return (
    <div>
      <div className="flex items-end gap-1" style={{ height: plotHeight }}>
        {data.map((d, i) => {
          const height = Math.max(2, (d.value / max) * plotHeight);
          const showLabel = d.value > 0 && (i === maxIndex || i === data.length - 1);
          return (
            <div
              key={`${d.label}-${i}`}
              className="relative flex flex-1 flex-col items-center justify-end"
              style={{ height: plotHeight }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === i && <Tooltip label={d.label} value={d.value} />}
              {showLabel && (
                <span className="mb-1 text-[10px] tabular-nums" style={{ color: CHART_TEXT.primary }}>
                  {d.value}
                </span>
              )}
              <div
                className="w-full max-w-[20px] rounded-t"
                style={{
                  height,
                  backgroundColor: color,
                  opacity: hovered === null || hovered === i ? 1 : 0.45,
                  transition: "opacity 0.15s",
                  cursor: "pointer",
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-1">
        {data.map((d, i) => (
          <div key={`${d.label}-axis-${i}`} className="flex-1 text-center">
            {i % 2 === 0 && (
              <span className="text-[10px]" style={{ color: CHART_TEXT.muted }}>
                {d.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
