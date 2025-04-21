import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono, Darumadrop_One } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import AppProvider from "@/components/ui/AppProvider";
import { Analytics } from "@vercel/analytics/react";
import { i18n, Locale } from "@/i18n-config";
import Script from "next/script";

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

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

(global as any)._TL_ = function(v: string): string {
  return v;
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {

  const params = await props.params;
  const { children } = props;

  return (
    <html lang={params.lang}>
      <Script dangerouslySetInnerHTML={{
        __html: `
          function _TL_(v) {return v;}
        `,
      }} />
      <body
        className={`${InterFont.className} ${geistSans.variable} ${geistMono.variable} ${darumadropOne.variable} antialiased`}
      >
        <AppProvider locale={params.lang}>{children}</AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
