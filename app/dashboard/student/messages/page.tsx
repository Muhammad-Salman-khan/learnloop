import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MessagesTable } from "@/components/MessagesTable/MessagesTable";
import { messageThreads } from "@/lib/dashboard/student-data";

// Server Component. Messages sub-page is a single shadcn Table.
const MessagesPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
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

      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </span>
        <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-balance md:text-4xl">
          Messages
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground">
          Direct messages with instructors and group threads for each course.
          Threads stay scoped to the course so context never leaks.
        </p>
      </header>

      <MessagesTable threads={messageThreads} />
    </div>
  );
};

export default MessagesPage;
