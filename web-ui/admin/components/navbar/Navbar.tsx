"use client";
import { Button } from "../ui/button";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { AccountDropdown } from "./AccountDropdown";
import { ThemeSwitcher } from "@/providers/theme-switcher";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export function Navbar() {
  const { toggleSidebar, closeSidebar, isOpen } = useSidebar();
  const { user } = useAuth();

  return (
    <nav className="bg-primary-foreground border-b border-border fixed top-0 left-0 right-0 z-50">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
          {/* LEFT - Logo & Menu */}
          <div className="flex items-center gap-4">
            <div>
              {user && (
                <div>
                  {isOpen && (
                    <Button
                      onClick={closeSidebar}
                      size="icon"
                      className="lg:hidden"
                      aria-label="Toggle sidebar"
                    >
                      <X size={24} />
                    </Button>
                  )}
                  {!isOpen && (
                    <Button
                      onClick={toggleSidebar}
                      variant="outline"
                      size="icon"
                      className="lg:hidden"
                      aria-label="Toggle sidebar"
                    >
                      <Menu size={24} />
                    </Button>
                  )}
                </div>
              )}
            </div>
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="text-blue-600 h-7 w-7" />
              <h1 className="text-xl font-bold text-foreground hidden sm:block">
                EBuy
              </h1>
            </Link>
          </div>

          {/* RIGHT - Cart & Account */}
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <AccountDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
