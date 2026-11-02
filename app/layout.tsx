import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  title: "Omnelia SI — Superintelligence & Creative Studio",
  description:
    "Omnelia SI internal superintelligence workstation: Wan 2.1 cinematic video, FLUX.2 diffusers, Kokoro-82M speech, ARDI defensive cyber, and persistent agent fleet.",
  icons: {
    icon: [
      {
        url: "/branding/omnelia-icon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/branding/omnelia-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/branding/omnelia-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/branding/omnelia-icon-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#090b11",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#090b11] text-[#f3f4f8]" suppressHydrationWarning>
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
