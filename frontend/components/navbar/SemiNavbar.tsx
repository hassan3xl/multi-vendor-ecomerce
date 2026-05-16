"use client";
import { ThemeSwitcher } from "@/providers/theme-switcher";
import Link from "next/link";

import SelectLanguage from "./SelectLanguage";
import SelectCurrency from "./SelectCurrency";

export function SemiNavbar() {
  return (
    <div className="flex items-center w-full border-b border-border justify-between h-full px-4 py-2">
      <div className="flex items-center gap-4 text-sm">
        <Link href="/about" className="hover:underline cursor-pointer">
          About Us
        </Link>
        <Link href="/contact" className="hover:underline cursor-pointer">
          Contact
        </Link>
      </div>

      {/* CENTER */}
      <div className="hidden md:block">
        <p className="text-sm font-medium">100% delivery without tracking</p>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <SelectCurrency />
      </div>
    </div>
  );
}
