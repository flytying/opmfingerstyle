import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OPM Fingerstyle — Discover Filipino Fingerstyle Guitarists",
    template: "%s | OPM Fingerstyle",
  },
  description:
    "Discover talented Filipino fingerstyle guitarists performing OPM songs. Browse profiles, watch performances, find tabs, and explore gear.",
  metadataBase: new URL("https://opmfingerstyle.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3392449098044156"
          crossOrigin="anonymous"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EGPSP8NJ5L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EGPSP8NJ5L');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
