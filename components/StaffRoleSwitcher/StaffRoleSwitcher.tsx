"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  RotateCw,
  Search,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AdminUser } from "@/lib/staff/staff-data";
import {
  ALL_ROLES,
  roleLabel,
  type AdminRole,
} from "@/lib/admin/admin-data";
import { initials } from "@/lib/admin/formatters";
import { usePaginator } from "@/lib/hooks/usePagination";
import { TablePagination } from "@/components/TablePagination/TablePagination";
import {
  MobileCard,
  MobileCardList,
} from "@/components/MobileCard/MobileCard";

// Mirror the staff spec: staff is only authorized to switch between
// student and teacher. Promote/demote from any other role is gated off
//  in the UI to mirror the staff boundary table at the top of the spec.
const STAFF_MANAGEABLE: ReadonlyArray<AdminRole> = ["student", "teacher"];

type RoleFilter = AdminRole | "all";
type BulkFilter = "all" | "manageable" | "out-of-scope";

type PendingChange = {
  readonly userId: string;
  readonly userName: string;
  readonly from: AdminRole;
  readonly to: AdminRole;
};

type StaffRoleSwitcherProps = {
  readonly users: ReadonlyArray<AdminUser>;
};

function roleBadgeVariant(role: AdminRole) {
  if (role === "superAdmin") return "default" as const;
  if (role === "admin") return "secondary" as const;
  if (role === "teacher") return "outline" as const;
  if (role === "staff") return "ghost" as const;
  return "secondary" as const;
}

function isManageableForStaff(role: AdminRole): boolean {
  return STAFF_MANAGEABLE.includes(role);
}

export function StaffRoleSwitcher({ users }: StaffRoleSwitcherProps) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [scopeFilter, setScopeFilter] = useState<BulkFilter>("all");
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [overrides, setOverrides] = useState<Record<string, AdminRole>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => {
        const effective = overrides[u.id] ?? u.role;
        if (roleFilter !== "all" && effective !== roleFilter) return false;
        if (scopeFilter === "manageable" && !isManageableForStaff(effective)) {
          return false;
        }
        if (scopeFilter === "out-of-scope" && isManageableForStaff(effective)) {
          return false;
        }
        if (!q) return true;
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        );
      })
      .map((u) => ({
        user: u,
        effective: overrides[u.id] ?? u.role,
      }));
  }, [users, query, roleFilter, scopeFilter, overrides]);

  const paginator = usePaginator(rows.length, 10);

  useEffect(() => {
    paginator.goTo(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, roleFilter, scopeFilter, rows.length]);

  const pageRows = paginator.slice(rows);

  function attemptChange(userId: string, userName: string, from: AdminRole, to: AdminRole) {
    if (!isManageableForStaff(from) || !isManageableForStaff(to)) {
      toast.error("Out of staff scope", {
        description:
          "Staff can only promote / demote between student and teacher. Other role transitions require the admin console.",
      });
      return;
    }
    if (from === "teacher" && to === "student") {
      // Demote path requires a confirm modal: clearing the TeacherProfile.
      setPending({ userId, userName, from, to });
      setConfirmOpen(true);
      return;
    }
    flipRole(userId, from, to);
  }

  function flipRole(userId: string, from: AdminRole, to: AdminRole) {
    setOverrides((prev) => ({ ...prev, [userId]: to }));
    const isPromotion = from === "student" && to === "teacher";
    toast(`Role updated · ${from} → ${to}`, {
      description: isPromotion
        ? "TeacherProfile will be created and the existing StudentProfile context cleared on save."
        : "On save, the TeacherProfile is archived and a StudentProfile is reactivated.",
      });
  }

  function confirmFlip() {
    if (!pending) return;
    flipRole(pending.userId, pending.from, pending.to);
    setConfirmOpen(false);
    setPending(null);
    toast.success("Role transition applied", {
      description: "All affected profile rows have been marked.",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-80">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={scopeFilter}
            onValueChange={(v) => setScopeFilter(v as BulkFilter)}
          >
            <SelectTrigger className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="manageable">In staff scope</SelectItem>
              <SelectItem value="out-of-scope">Out of staff scope</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v as RoleFilter)}
          >
            <SelectTrigger className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any role</SelectItem>
              {ALL_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {roleLabel(r)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-md border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">User</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Current role</TableHead>
              <TableHead className="pr-5 text-right">Change role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  {rows.length === 0
                    ? "No users match these filters."
                    : "Nothing on this page."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map(({ user, effective }) => {
                const manageableNow = isManageableForStaff(effective);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 rounded-md">
                          <AvatarFallback className="rounded-md bg-primary text-[11px] text-primary-foreground">
                            {initials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5 leading-tight">
                          <span className="font-medium">{user.name}</span>
                          {!manageableNow ? (
                            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                              Out of staff scope
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      {user.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={roleBadgeVariant(effective)}>
                        <Shield className="mr-1 size-3" />
                        {roleLabel(effective)}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Select
                        value={effective}
                        onValueChange={(v) =>
                          attemptChange(
                            user.id,
                            user.name,
                            effective,
                            v as AdminRole,
                          )
                        }
                        disabled={!manageableNow}
                      >
                        <SelectTrigger className="ml-auto h-8 w-44 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STAFF_MANAGEABLE.map((r) => (
                            <SelectItem key={r} value={r}>
                              {roleLabel(r)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards list */}
      <MobileCardList>
        {pageRows.length === 0 ? (
          <div className="rounded-md border bg-card p-6 text-center text-xs text-muted-foreground">
            {rows.length === 0
              ? "No users match these filters."
              : "Nothing on this page."}
          </div>
        ) : (
          pageRows.map(({ user, effective }) => {
            const manageableNow = isManageableForStaff(effective);
            return (
              <MobileCard
                key={user.id}
                emphasis={
                  <Badge variant={roleBadgeVariant(effective)}>
                    <Shield className="mr-1 size-3" />
                    {roleLabel(effective)}
                  </Badge>
                }
                fields={[
                  { label: "Name", value: user.name },
                  { label: "Email", value: user.email },
                ]}
                footer={
                  manageableNow
                    ? undefined
                    : "Out of staff scope — admin console required for this transition"
                }
              />
            );
          })
        )}
      </MobileCardList>

      <TablePagination paginator={paginator} />

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setPending(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-amber-500" />
              Confirm role demotion
            </DialogTitle>
            <DialogDescription>
              Demoting{" "}
              <span className="font-medium">
                {pending?.userName ?? "—"}
              </span>{" "}
              from teacher to student will archive the teacher&apos;s profile
              and reactivate their student context. This change is reversible
              only through the admin console.
            </DialogDescription>
          </DialogHeader>
          <Card className="gap-2 bg-muted/30">
            <CardHeader className="pb-2">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Side effects
              </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-0 text-sm">
              <span className="flex items-center gap-2">
                <RotateCw className="size-3.5 text-muted-foreground" />
                TeacherProfile archived, audit row added.
              </span>
              <span className="flex items-center gap-2">
                <RotateCw className="size-3.5 text-muted-foreground" />
                Course assignments paused; not deleted.
              </span>
            </CardContent>
          </Card>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmFlip}>Approve demotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StaffRoleSwitcher;
