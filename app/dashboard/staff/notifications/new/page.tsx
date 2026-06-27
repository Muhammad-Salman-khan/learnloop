import { NotificationForm } from "@/components/NotificationForm/NotificationForm";

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Staff · Notifications
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Push notification
        </h1>
        <p className="max-w-[72ch] text-sm text-muted-foreground md:text-base">
          Compose an in-app (DB-stored) notification. Pick urgency and target
          carefully — urgent alerts surface at the top of every recipient&apos;s
          dashboard.
        </p>
      </header>

      <NotificationForm />
    </div>
  );
};

export default page;
