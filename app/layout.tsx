// "use client"; // Ensure this is a client component
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { RoadmapProvider } from "./context/roadmapContext";
import { Toaster } from "@/components/ui/sonner";
import { DarkModeProvider, useDarkMode } from "./context/darkModeContext";
import DarkModeToggle from "@/components/DarkModeToggle";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roady",
  description: "An AI Assissted Roadmap Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-all duration-300 ease-in-out`}
      >
        <DarkModeProvider>
          <DarkModeToggle />
          <RoadmapProvider>
            {children}
            <Toaster />
            <DarkModeToggle />
          </RoadmapProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
