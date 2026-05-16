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
import { useGetSidebar } from "@/lib/hooks/sidebar.hook";
import { useSidebar } from "@/contexts/SidebarContext";

export default function EcommerceSidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  const { data: stats } = useGetSidebar();
  console.log("stats", stats);

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
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent pt-28 lg:pt-18">
          <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {/* Main Navigation */}
            <div className="p-4 space-y-1">
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
                href="/products"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                  isActive("/products")
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "hover:bg-accent/50 text-foreground"
                }`}
              >
                {isActive("/products") && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-800 rounded-r-full" />
                )}
                <ShoppingBag
                  size={20}
                  className={`transition-all duration-200 ${
                    isActive("/products")
                      ? "scale-110"
                      : "group-hover:scale-110 group-hover:text-primary"
                  }`}
                />
                <span className="font-medium text-sm">All Products</span>
                <span
                  className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isActive("/products")
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {stats?.products}
                </span>
              </Link>

              <Link
                href="/categories"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                  isActive("/categories")
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "hover:bg-accent/50 text-foreground"
                }`}
              >
                {isActive("/categories") && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-800 rounded-r-full" />
                )}
                <Package
                  size={20}
                  className={`transition-all duration-200 ${
                    isActive("/categories")
                      ? "scale-110"
                      : "group-hover:scale-110 group-hover:text-primary"
                  }`}
                />
                <span className="font-medium text-sm">Categories</span>
                <ChevronRight
                  size={16}
                  className={`ml-auto transition-transform duration-200 ${
                    isActive("/categories")
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:translate-x-1"
                  }`}
                />
              </Link>
            </div>

            {/* Shop By Section */}
            <div className="p-4 border-t border-border/50">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-4">
                Shop By
              </p>
              <div className="space-y-1">
                <Link
                  href="/shop/trending"
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive("/shop/trending")
                      ? "bg-linear-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md transition-transform duration-200 ${
                      isActive("/shop/trending")
                        ? "scale-110 shadow-orange-500/50"
                        : "group-hover:scale-110"
                    }`}
                  >
                    <TrendingUp size={18} className="text-white" />
                  </div>
                  <span className="font-medium text-sm">Trending Now</span>
                  <span className="ml-auto text-base">🔥</span>
                </Link>

                <Link
                  href="/shop/new-arrivals"
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive("/shop/new-arrivals")
                      ? "bg-linear-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md transition-transform duration-200 ${
                      isActive("/shop/new-arrivals")
                        ? "scale-110 shadow-yellow-500/50"
                        : "group-hover:scale-110"
                    }`}
                  >
                    <Star size={18} className="text-white" />
                  </div>
                  <span className="font-medium text-sm">New Arrivals</span>
                  <span className="ml-auto bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-500/20">
                    New
                  </span>
                </Link>

                <Link
                  href="/shop/deals"
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive("/shop/deals")
                      ? "bg-linear-to-r from-red-500/10 to-pink-500/10 border border-red-500/20"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg bg-linear-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-md transition-transform duration-200 ${
                      isActive("/shop/deals")
                        ? "scale-110 shadow-red-500/50"
                        : "group-hover:scale-110"
                    }`}
                  >
                    <Tag size={18} className="text-white" />
                  </div>
                  <span className="font-medium text-sm">Deals & Offers</span>
                  <span className="ml-auto text-base">💰</span>
                </Link>

                <Link
                  href="/shop/wishlist"
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive("/shop/wishlist")
                      ? "bg-linear-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md transition-transform duration-200 ${
                      isActive("/shop/wishlist")
                        ? "scale-110 shadow-pink-500/50"
                        : "group-hover:scale-110"
                    }`}
                  >
                    <Heart size={18} className="text-white" />
                  </div>
                  <span className="font-medium text-sm">My Wishlist</span>
                  <span className="ml-auto bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-pink-500/20">
                    {stats?.wishlist}
                  </span>
                </Link>
              </div>
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
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
