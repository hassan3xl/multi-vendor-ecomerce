"use client";

import Header from "@/components/Header";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const AccountPage = () => {
  const router = useRouter();

  return (
    <div className="">
      {/* Page Header */}
      <Header
        title="Account Settings"
        subtitle="Manage your account and settings"
        stats={[
          {
            title: "Profile",
            value: "",
            // change: "+20.1%",
            icon: (
              <ChevronRight onClick={() => router.push("/account/profile")} />
            ),
          },
          {
            title: "Settings",
            value: "",
            // change: "+12.5%",
            icon: (
              <ChevronRight onClick={() => router.push("/account/settings")} />
            ),
          },
          {
            title: "Change Password",
            value: "",
            // change: "+5.3%",
            icon: (
              <ChevronRight onClick={() => router.push("/account/profile")} />
            ),
          },
          {
            title: "others",
            value: "",
            // change: "+2.1%",
            icon: (
              <ChevronRight onClick={() => router.push("/account/profile")} />
            ),
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

export default AccountPage;
