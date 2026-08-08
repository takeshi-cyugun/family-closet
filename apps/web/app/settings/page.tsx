import { getSettingsData } from "../actions/settings";
import { SettingsClient } from "./_components/SettingsClient";
import { SettingsEmptyState } from "./_components/SettingsEmptyState";

export default async function SettingsPage() {
  const settings = await getSettingsData();

  if (!settings) {
    return <SettingsEmptyState />;
  }

  return <SettingsClient initialData={settings} />;
}
