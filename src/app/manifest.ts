import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "90s TV Memories",
    short_name: "90s TV",
    description: "Saturday morning cartoons, TGIF sitcoms and VHS nostalgia.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#2b4886",
    lang: "en-US",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
