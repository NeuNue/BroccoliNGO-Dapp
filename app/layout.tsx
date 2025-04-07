import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono, Darumadrop_One } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import AppProvider from "@/components/ui/AppProvider";
import { Analytics } from "@vercel/analytics/react";

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700", "900"]
})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const darumadropOne = Darumadrop_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-darumadrop-one",
});

export const metadata: Metadata = {
  title: "Broccoli NGO",
  description: "First Broccoli on BSC, $Broccoli token is managed and owned by its community, with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${InterFont.className} ${geistSans.variable} ${geistMono.variable} ${darumadropOne.variable} antialiased`}
      >
        <AppProvider>{children}</AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
