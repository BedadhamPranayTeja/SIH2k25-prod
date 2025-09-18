import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIH Internal Hackathon 2025 | SIEC",
  description:
    "Smart India Hackathon Internal Selection - Sreyas Innovation & Entrepreneurship Cell",
  keywords:
    "hackathon, SIH, Smart India Hackathon, SIEC, innovation, technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
