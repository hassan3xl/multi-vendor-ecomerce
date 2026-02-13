import Header from "@/components/Header";
import { ThemeSwitcher } from "@/providers/theme-switcher";
import { ChevronRight } from "lucide-react";
import React from "react";

const SettingsPage = () => {
  return (
    <div className="">
      {/* Page Header */}
      <Header
        title="Account"
        subtitle="Manage your account and settings"
        stats={[
          {
            title: "Theme",
            value: "",
            // change: "+20.1%",
            icon: <ThemeSwitcher />,
          },
        ]}
      />

      {/* Content Cards */}
      <div className="bg-muted p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Recent Activities
        </h3>
        <div className="space-y-3"></div>
      </div>
    </div>
  );
};

export default SettingsPage;
