import Link from "next/link";
import { ArrowLeft, ExternalLink, Lock, Mail, Phone } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { profileDefaults } from "@/lib/settings/settings-data";

// Server Component. Public-facing profile page (separate from settings/profile
// which is the editable form).
const ProfilePage = () => {
  const p = profileDefaults;
  const initials = `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link href="/dashboard/student">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to overview
        </Link>
      </Button>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                size="lg"
                className="size-16 text-base ring-1 ring-foreground/10"
                aria-hidden="true"
              >
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Public profile
                </span>
                <CardTitle className="font-display text-2xl font-medium tracking-tight">
                  {p.preferredName || `${p.firstName} ${p.lastName}`}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono uppercase tracking-[0.12em]">
                    {p.studentId}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{p.programme}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    Year {p.yearOfStudy}
                  </span>
                </div>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/student/settings#profile">
                <ExternalLink className="size-3.5" aria-hidden="true" />
                Edit profile
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
            {p.bio}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Cohort 16</Badge>
            <Badge variant="outline">Diploma · Web and App</Badge>
            <Badge variant="outline">Year {p.yearOfStudy}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Contact cards
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            You control which lines are visible to instructors and the cohort
            directory.
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Channel</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="hidden md:table-cell">
                  Visibility
                </TableHead>
                <TableHead className="pr-6 text-right">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="pl-6 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    Email
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {p.email}
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  <Badge variant="outline">Cohort only</Badge>
                </TableCell>
                <TableCell className="pr-6 text-right font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                  auth
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    Phone
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {p.phone || "—"}
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  <Badge variant="outline">Instructors only</Badge>
                </TableCell>
                <TableCell className="pr-6 text-right font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                  self-edited
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <Lock className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    Student ID
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {p.studentId}
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  <Badge variant="outline">Registrar scope</Badge>
                </TableCell>
                <TableCell className="pr-6 text-right font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                  registrar
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Cohort directory listing
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Other students in your cohort can find you in the directory only if
            you opt in below.
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Listing</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="pl-6 font-medium">
                  Appear in cohort directory
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  <Badge variant="default">On</Badge>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/student/settings#profile">
                      Manage in settings
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6 font-medium">
                  Show real name to classmates
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  <Badge variant="secondary">Preferred name</Badge>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/student/settings#profile">
                      Manage in settings
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6 font-medium">
                  Show activity feed to classmates
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  <Badge variant="outline">Hidden</Badge>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/student/settings#profile">
                      Manage in settings
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
