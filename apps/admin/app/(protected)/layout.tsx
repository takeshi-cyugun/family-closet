import { redirect } from "next/navigation";
import { isAdminAuthenticated, logoutAdmin } from "../actions/auth";
import { AdminShell } from "./_components/AdminShell";
import { MaintenanceStatusProvider } from "./_components/MaintenanceStatusContext";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  async function handleLogout() {
    "use server";
    await logoutAdmin();
    redirect("/login");
  }

  return (
    <MaintenanceStatusProvider>
      <AdminShell onLogout={handleLogout}>{children}</AdminShell>
    </MaintenanceStatusProvider>
  );
}
