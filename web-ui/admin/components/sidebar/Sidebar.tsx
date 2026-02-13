"use client";
import React, { useEffect, useRef } from "react";
import {
  Home,
  ShoppingBag,
  Package,
  TrendingUp,
  Star,
  Tag,
  Heart,
  HelpCircle,
  Settings,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useGetSidebar } from "@/lib/hooks/sidebar.hook";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";

export default function EcommerceSidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  // const { data: stats } = useGetSidebar();

  // Check if route is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth >= 1024) return;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeSidebar]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeSidebar]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed lg:sticky top-0 lg:top-16 left-0 
      h-screen lg:h-[calc(100vh-4rem)]
      bg-card/80 border-r border-border/50 shadow-lg lg:shadow-none
      transition-transform duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      w-full sm:w-64
  `}
      >
        {/* Scrollable content container */}
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent pt-6 lg:pt-8">
          {/* Main Navigation */}
          <div className="space-y-1">
            <Link
              href="/"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive("/")
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "hover:bg-accent/50 text-foreground"
              }`}
            >
              {isActive("/") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-800 rounded-r-full" />
              )}
              <Home
                size={20}
                className={`transition-all duration-200 ${
                  isActive("/")
                    ? "scale-110"
                    : "group-hover:scale-110 group-hover:text-primary"
                }`}
              />
              <span className="font-medium text-sm">Home</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive("/dashboard")
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "hover:bg-accent/50 text-foreground"
              }`}
            >
              {isActive("/dashboard") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-800 rounded-r-full" />
              )}
              <Home
                size={20}
                className={`transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "scale-110"
                    : "group-hover:scale-110 group-hover:text-primary"
                }`}
              />
              <span className="font-medium text-sm">Dashboard</span>
            </Link>

            <Link
              href="/inventory"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive("/inventory")
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "hover:bg-accent/50 text-foreground"
              }`}
            >
              {isActive("/inventory") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-800 rounded-r-full" />
              )}
              <ShoppingBag
                size={20}
                className={`transition-all duration-200 ${
                  isActive("/inventory")
                    ? "scale-110"
                    : "group-hover:scale-110 group-hover:text-primary"
                }`}
              />
              <span className="font-medium text-sm">Inventory</span>
              <span
                className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${
                  isActive("/inventory")
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                123
              </span>
            </Link>

            <Link
              href="/orders"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive("/orders")
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "hover:bg-accent/50 text-foreground"
              }`}
            >
              {isActive("/orders") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-800 rounded-r-full" />
              )}
              <Package
                size={20}
                className={`transition-all duration-200 ${
                  isActive("/orders")
                    ? "scale-110"
                    : "group-hover:scale-110 group-hover:text-primary"
                }`}
              />
              <span className="font-medium text-sm">Orders</span>
              <ChevronRight
                size={16}
                className={`ml-auto transition-transform duration-200 ${
                  isActive("/orders")
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:translate-x-1"
                }`}
              />
            </Link>
          </div>
          {/* More Section */}
          <div className="p-4 border-t border-border/50 ">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-4">
              More
            </p>
            <div className="space-y-1">
              <Link
                href="/merchants"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive("/merchants")
                    ? "bg-accent text-foreground font-medium"
                    : "hover:bg-accent/50 text-muted-foreground"
                }`}
              >
                <TrendingUp
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span className="text-sm">Top Merchants</span>
                <ChevronRight
                  size={16}
                  className="ml-auto group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>

              <Link
                href="/help"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive("/help")
                    ? "bg-accent text-foreground font-medium"
                    : "hover:bg-accent/50 text-muted-foreground"
                }`}
              >
                <HelpCircle
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span className="text-sm">Help & Support</span>
                <ChevronRight
                  size={16}
                  className="ml-auto group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>

              <Link
                href="/settings"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive("/settings")
                    ? "bg-accent text-foreground font-medium"
                    : "hover:bg-accent/50 text-muted-foreground"
                }`}
              >
                <Settings
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span className="text-sm">Settings</span>
                <ChevronRight
                  size={16}
                  className="ml-auto group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
