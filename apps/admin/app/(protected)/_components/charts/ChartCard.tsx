import { CHART_TEXT } from "../../../_lib/chartPalette";

type ChartCardDatum = { label: string; value: number };

export function ChartCard({
  title,
  data,
  children,
}: {
  title: string;
  data: { label: string; value: number }[];
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <h3 className="text-sm font-bold" style={{ color: CHART_TEXT.primary }}>
        {title}
      </h3>
      <div className="mt-4">{children}</div>
      <details className="mt-3">
        <summary className="cursor-pointer text-xs" style={{ color: CHART_TEXT.muted }}>
          表で見る
        </summary>
        <table className="mt-2 w-full text-xs">
          <tbody>
            {data.map((d: ChartCardDatum) => (
              <tr key={d.label} className="border-b border-black/5 last:border-0">
                <td className="py-1" style={{ color: CHART_TEXT.secondary }}>
                  {d.label}
                </td>
                <td className="py-1 text-right tabular-nums" style={{ color: CHART_TEXT.primary }}>
                  {d.value}件
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
