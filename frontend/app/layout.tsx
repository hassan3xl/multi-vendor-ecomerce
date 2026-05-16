// layout.tsx - CORRECTED VERSION
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Navbar } from "@/components/navbar/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import ModalProvider from "@/providers/ModalProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { CartProvider } from "@/contexts/CartContext";
import { QueryProvider } from "@/providers/QueryProviders";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <AuthProvider>
              <CartProvider>
                <ToastProvider>
                  <ModalProvider>
                    <SidebarProvider>
                      <>{children}</>
                    </SidebarProvider>
                  </ModalProvider>
                </ToastProvider>
              </CartProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
