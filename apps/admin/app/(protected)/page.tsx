import { getDashboardStats } from "../actions/dashboard";
import { HorizontalBarChart, TrendBarChart } from "./_components/charts/BarChart";
import { ChartCard } from "./_components/charts/ChartCard";
import { PieChart } from "./_components/charts/PieChart";
import { StatTile } from "./_components/charts/StatTile";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="mb-4 text-xl font-bold">ダッシュボード</h2>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="総ファミリー数" value={stats.totalFamilies} />
        <StatTile label="総メンバー数" value={stats.totalMembers} />
        <StatTile label="総登録アイテム数" value={stats.totalClothes} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="プラン別ファミリー数" data={stats.planCounts}>
          <PieChart data={stats.planCounts} />
        </ChartCard>

        <ChartCard title="状態別ファミリー数" data={stats.statusCounts}>
          <PieChart data={stats.statusCounts} />
        </ChartCard>

        <ChartCard title="言語別ファミリー数" data={stats.languageCounts}>
          <HorizontalBarChart data={stats.languageCounts} />
        </ChartCard>

        <ChartCard title="新規ファミリー登録数（直近14日間）" data={stats.registrationsByDay}>
          <TrendBarChart data={stats.registrationsByDay} />
        </ChartCard>
      </div>
    </div>
  );
}
