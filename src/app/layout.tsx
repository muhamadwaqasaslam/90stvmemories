import type { Metadata, Viewport } from "next";
import { Bungee, Inter, Poppins } from "next/font/google";
import "./globals.css";

const bungee = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-bungee" });
const poppins = Poppins({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://90stvmemories.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "90s TV Memories — Press Play on Your Childhood", template: "%s | 90s TV Memories" },
  description: "Saturday morning cartoons, TGIF sitcoms, VHS rentals and the TV moments that raised a generation.",
  openGraph: { type: "website", siteName: "90s TV Memories", locale: "en_US" },
};

export const viewport: Viewport = { themeColor: "#faf8f5" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${bungee.variable} ${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen" suppressHydrationWarning>{children}</body>
    </html>
  );
}
