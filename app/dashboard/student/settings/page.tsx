import { SettingsTabs } from "@/components/SettingsTabs/SettingsTabs";

// Server Component. Settings sub-page delegates to the client Tabs island,
// which owns the four sections (Profile, Notifications, Appearance, Security).
const SettingsPage = () => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <SettingsTabs />
    </div>
  );
};

export default SettingsPage;
