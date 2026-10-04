import type { Metadata, Viewport } from "next";
import { Bungee, Crimson_Text, Inter, Poppins, Roboto_Condensed, Titillium_Web, Yellowtail } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "../lib/site";

const condensed = Roboto_Condensed({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-roboto-cond" });

const crimson = Crimson_Text({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-crimson" });
const titillium = Titillium_Web({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--font-titillium" });
const yellowtail = Yellowtail({ weight: "400", subsets: ["latin"], variable: "--font-yellowtail" });

const bungee = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-bungee" });
const poppins = Poppins({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "90s TV Memories — Press Play on Your Childhood", template: "%s | 90s TV Memories" },
  description: "Saturday morning cartoons, TGIF sitcoms, VHS rentals and the TV moments that raised a generation.",
  openGraph: { type: "website", siteName: "90s TV Memories", locale: "en_US" },
};

export const viewport: Viewport = { themeColor: "#faf8f5" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${bungee.variable} ${poppins.variable} ${inter.variable} ${crimson.variable} ${titillium.variable} ${yellowtail.variable} ${condensed.variable}`}>
      <body className="min-h-screen" suppressHydrationWarning>{children}</body>
    </html>
  );
}
