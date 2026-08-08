import { MaintenanceModeSettings } from "../_components/MaintenanceModeSettings";

export default function MaintenancePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-4 text-xl font-bold">メンテナンスモード</h2>
      <MaintenanceModeSettings />
    </div>
  );
}
