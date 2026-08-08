"use client";

import { useState, type MouseEvent } from "react";
import { CHART_COLORS, CHART_TEXT } from "../../../_lib/chartPalette";

type PieDatum = { label: string; value: number };

const SIZE = 160;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 4;

function polarToCartesian(angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + RADIUS * Math.cos(rad), y: CENTER + RADIUS * Math.sin(rad) };
}

function arcPath(startAngle: number, endAngle: number) {
  const start = polarToCartesian(endAngle);
  const end = polarToCartesian(startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

export function PieChart({ data }: { data: PieDatum[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return <p className="py-8 text-center text-sm text-neutral-400">データがありません。</p>;
  }

  let cumulativeAngle = 0;
  const slices = data.map((d, i) => {
    const startAngle = cumulativeAngle;
    const angle = (d.value / total) * 360;
    cumulativeAngle += angle;
    return { ...d, startAngle, endAngle: cumulativeAngle, color: CHART_COLORS[i % CHART_COLORS.length] };
  });

  function handleMouseMove(e: MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div className="relative shrink-0">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}
        >
          {slices.map((slice, i) => (
            <path
              key={slice.label}
              d={arcPath(slice.startAngle, slice.endAngle)}
              fill={slice.color}
              stroke="#fcfcfb"
              strokeWidth={2}
              opacity={hovered === null || hovered === i ? 1 : 0.45}
              onMouseEnter={() => setHovered(i)}
              style={{ cursor: "pointer", transition: "opacity 0.15s" }}
            >
              <title>{`${slice.label}: ${slice.value}件 (${((slice.value / total) * 100).toFixed(1)}%)`}</title>
            </path>
          ))}
        </svg>
        {hovered !== null && tooltipPos && (
          <div
            className="pointer-events-none absolute z-10 rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
            style={{ left: tooltipPos.x + 10, top: tooltipPos.y + 10 }}
          >
            <div className="font-semibold">
              {slices[hovered].value}件 ({((slices[hovered].value / total) * 100).toFixed(1)}%)
            </div>
            <div className="text-neutral-300">{slices[hovered].label}</div>
          </div>
        )}
      </div>

      <ul className="flex flex-1 flex-col gap-1.5 text-sm">
        {slices.map((slice, i) => (
          <li
            key={slice.label}
            className="flex items-center gap-2"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
            <span style={{ color: CHART_TEXT.primary }}>{slice.label}</span>
            <span className="ml-auto tabular-nums" style={{ color: CHART_TEXT.secondary }}>
              {slice.value}件 ({((slice.value / total) * 100).toFixed(0)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
