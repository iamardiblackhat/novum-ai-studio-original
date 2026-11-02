import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#090b11] text-[#f3f4f8]" suppressHydrationWarning>
      <head>
        <title>Omnelia SI — Superintelligence &amp; Creative Studio</title>
        <meta
          name="description"
          content="Omnelia SI internal superintelligence workstation: Wan 2.1 cinematic video, FLUX.2 diffusers, Kokoro-82M speech, ARDI defensive cyber, and persistent agent fleet."
        />
        <meta name="theme-color" content="#090b11" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/branding/omnelia-icon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/branding/omnelia-icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/branding/omnelia-icon-512.png" />
        <link rel="apple-touch-icon" href="/branding/omnelia-icon-180.png" />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-[#090b11] text-[#f3f4f8] selection:bg-[#57f1ef]/20 selection:text-[#57f1ef]`}
        suppressHydrationWarning
      >
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
