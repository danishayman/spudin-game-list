import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import ModernNavBar from "@/components/ModernNavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spudin Game List",
  description: "Track, discover, and share your favorite games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={cn("bg-slate-900", inter.className)}>
        <ModernNavBar />
        {children}
      </body>
    </html>
  );
}
