import { SITE_URL } from "./site";

export const SITE_NAME = "90s TV Memories";
export const SITE_TAGLINE = "Saturday morning cartoons, TGIF sitcoms, VHS rentals and the TV moments that raised a generation";
export const DEFAULT_DESC =
  "90s TV Memories is an independent fan site for American 90s nostalgia: Saturday morning cartoons, TGIF sitcoms, VHS rentals, and the shows and gadgets that shaped a generation of US kids.";
export const OG_IMAGE = "/images/stock/banner.jpg";

export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Renders a schema.org JSON-LD block. `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }} />;
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: abs("/icon.svg"),
  description: DEFAULT_DESC,
  areaServed: { "@type": "Country", name: "United States" },
  knowsAbout: ["1990s television", "Saturday morning cartoons", "TGIF sitcoms", "VHS and video rental stores", "1990s nostalgia"],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESC,
  inLanguage: "en-US",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export const breadcrumbLd = (items: [name: string, path: string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});
