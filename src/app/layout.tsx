import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Bebas_Neue, Bungee, Crimson_Text, Inter, Poppins, Roboto_Condensed, Titillium_Web, Yellowtail } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "../lib/site";
import { DEFAULT_DESC, JsonLd, OG_IMAGE, organizationLd, websiteLd } from "../lib/seo";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const condensed = Roboto_Condensed({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-roboto-cond" });

const crimson = Crimson_Text({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-crimson" });
const titillium = Titillium_Web({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--font-titillium" });
const yellowtail = Yellowtail({ weight: "400", subsets: ["latin"], variable: "--font-yellowtail" });

const bungee = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-bungee" });
const poppins = Poppins({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "90s TV Memories | Best 90s Shows, TGIF, Cartoons & Cast Then and Now [2026]",
    template: "%s | 90s TV Memories",
  },
  description: DEFAULT_DESC,
  applicationName: "90s TV Memories",
  verification: { google: "google623db4c757b2ba52" },
  keywords: ["90s TV", "90s nostalgia", "Saturday morning cartoons", "TGIF sitcoms", "VHS rentals", "1990s television", "90s kids", "retro TV shows", "cast then and now"],
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
    title: "90s TV Memories | Best 90s Shows, TGIF, Cartoons & Cast Then and Now [2026]",
    description: DEFAULT_DESC,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "90s TV Memories - Retro 90s television set and TGIF memories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "90s TV Memories | Best 90s Shows, TGIF, Cartoons & Cast Then and Now [2026]",
    description: DEFAULT_DESC,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0a0a23" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${bebas.variable} ${bungee.variable} ${poppins.variable} ${inter.variable} ${crimson.variable} ${titillium.variable} ${yellowtail.variable} ${condensed.variable}`}>
      <body className="min-h-screen overflow-x-hidden" suppressHydrationWarning>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5861244705933198"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://quge5.com/88/tag.min.js"
          data-zone="307344"
          strategy="afterInteractive"
        />
        <Script
          src="https://nap5k.com/tag.min.js"
          data-zone="12226907"
          strategy="afterInteractive"
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XQ5F2LYKCX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "G-XQ5F2LYKCX");
          `}
        </Script>
        <JsonLd data={[organizationLd, websiteLd]} />
        {children}
      </body>
    </html>
  );
}
