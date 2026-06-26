import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Pencil } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  findStaff,
  findUser,
} from "@/lib/admin/admin-data";
import { formatDateLong, initials } from "@/lib/admin/formatters";

const Detail = ({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) => (
  <div className="flex flex-col gap-0.5 border-b py-2.5 last:border-b-0">
    <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </span>
    <span className="text-sm">{value}</span>
  </div>
);

const page = ({
  params,
}: {
  params: Promise<{ staffId: string }>;
}) => {
  return params.then(({ staffId }) => {
    const staff = findStaff(staffId);
    const user = findUser(staffId);
    if (!staff || !user) notFound();

    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard/admin/staff">
              <ArrowLeft className="size-3.5" />
              Back to staff
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href={`/dashboard/admin/users/${user.id}/edit`}>
              <Pencil className="size-3.5" />
              Edit profile
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="size-20 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary text-xl text-primary-foreground">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                    {user.name}
                  </h1>
                  <Badge variant="outline">Staff</Badge>
                  <Badge variant={staff.isActive ? "secondary" : "outline"}>
                    {staff.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{staff.designation}</span>
                  <span aria-hidden="true">·</span>
                  <span>{staff.department}</span>
                  <span aria-hidden="true">·</span>
                  <span>{staff.employmentId}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Role and employment records.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
              <div>
                <Detail label="Employment ID" value={staff.employmentId} />
                <Detail label="Designation" value={staff.designation} />
                <Detail label="Department" value={staff.department} />
                <Detail label="Hired" value={formatDateLong(staff.hireDate)} />
                <Detail
                  label="Date of birth"
                  value={
                    staff.dob
                      ? formatDateLong(staff.dob)
                      : "—"
                  }
                />
              </div>
              <div>
                <Detail label="Phone" value={staff.phoneNumber} />
                <Detail label="Address" value={staff.address} />
                <Detail label="Email" value={user.email} />
                <Detail label="NIC" value={staff.nic} />
                <Detail
                  label="Last sign-in"
                  value={formatDateLong(user.lastSeenAt)}
                />
              </div>
              <div className="rounded-md border bg-card p-3 md:col-span-2">
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Bio
                </span>
                <p className="mt-1 text-sm">{staff.bio}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Quick contacts
              </CardTitle>
              <CardDescription className="text-xs">
                Verified phone and email.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="size-3" />
                  Phone
                </span>
                <span className="font-mono text-xs">
                  {staff.phoneNumber}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="size-3" />
                  Email
                </span>
                <span className="font-mono text-xs">{user.email}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  });
};

export default page;
