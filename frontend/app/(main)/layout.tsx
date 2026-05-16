// layout.tsx - CORRECTED VERSION
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";

export const metadata: Metadata = {
  title: "ebuy",
  description: "ecommerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-28 min-h-[calc(100vh-3.5rem)] ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
