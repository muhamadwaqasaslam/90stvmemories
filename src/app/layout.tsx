import type { Metadata, Viewport } from "next";
import { Bungee, Crimson_Text, Inter, Poppins, Roboto_Condensed, Titillium_Web, Yellowtail } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "../lib/site";
import { DEFAULT_DESC, JsonLd, OG_IMAGE, organizationLd, websiteLd } from "../lib/seo";

const condensed = Roboto_Condensed({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-roboto-cond" });

const crimson = Crimson_Text({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-crimson" });
const titillium = Titillium_Web({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--font-titillium" });
const yellowtail = Yellowtail({ weight: "400", subsets: ["latin"], variable: "--font-yellowtail" });

const bungee = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-bungee" });
const poppins = Poppins({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "90s TV Memories | 90s Cartoons, Sitcoms & VHS Nostalgia", template: "%s | 90s TV Memories" },
  description: DEFAULT_DESC,
  applicationName: "90s TV Memories",
  keywords: ["90s TV", "90s nostalgia", "Saturday morning cartoons", "TGIF sitcoms", "VHS rentals", "1990s television", "90s kids", "retro TV shows"],
  authors: [{ name: "90s TV Memories", url: SITE_URL }],
  creator: "90s TV Memories",
  publisher: "90s TV Memories",
  category: "entertainment",
  alternates: { canonical: "/", languages: { "en-US": "/", "x-default": "/" } },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  formatDetection: { telephone: false, email: false, address: false },
  other: { "geo.region": "US", "geo.placename": "United States", "content-language": "en-US" },
  openGraph: {
    type: "website",
    siteName: "90s TV Memories",
    locale: "en_US",
    url: "/",
    title: "90s TV Memories | 90s Cartoons, Sitcoms & VHS Nostalgia",
    description: DEFAULT_DESC,
    images: [{ url: OG_IMAGE, width: 1400, height: 928, alt: "A retro 90s television set" }],
  },
  twitter: { card: "summary_large_image", title: "90s TV Memories", description: DEFAULT_DESC, images: [OG_IMAGE] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#2b4886" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${bungee.variable} ${poppins.variable} ${inter.variable} ${crimson.variable} ${titillium.variable} ${yellowtail.variable} ${condensed.variable}`}>
      <body className="min-h-screen overflow-x-hidden" suppressHydrationWarning>
        <JsonLd data={[organizationLd, websiteLd]} />
        {children}
      </body>
    </html>
  );
}
