import { StaffShell } from "@/components/StaffShell/StaffShell";

// Server component layout. Stays a Server Component because there's no auth
// wiring here yet — the dashboard root gate does that. Once staff role
// checks land, do them in app/dashboard/page.tsx (the root gate) before the
// staff URL space is even reachable.
const layout = ({ children }: { children: React.ReactNode }) => {
  return <StaffShell>{children}</StaffShell>;
};

export default layout;
