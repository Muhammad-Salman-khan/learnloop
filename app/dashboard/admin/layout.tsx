import { AdminShell } from "@/components/AdminShell/AdminShell";

// The root app/layout already mounts a single Sonner Toaster. The admin
// layout owns only the chrome — sidebar, header, content padding — plus
// auth hand-off if/when we wire roles. Currently the dashboard root gate
// (/dashboard/page.tsx) already routes admins here, so we trust it.
const layout = ({ children }: { children: React.ReactNode }) => {
  return <AdminShell>{children}</AdminShell>;
};

export default layout;
