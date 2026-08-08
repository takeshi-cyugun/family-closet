import { CHART_TEXT } from "../../../_lib/chartPalette";

export function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <div className="text-xs" style={{ color: CHART_TEXT.muted }}>
        {label}
      </div>
      <div className="mt-1 text-3xl font-semibold tabular-nums" style={{ color: CHART_TEXT.primary }}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}
