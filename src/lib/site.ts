/** Public site address, without a trailing slash. Always enforce production custom domain. */
export const SITE_URL = "https://www.90stvmemories.com";

export const FB_PAGES = {
  beverlyHills: {
    id: "90210",
    name: "Beverly Hills 90210 Fan",
    followers: "8.2K",
    url: process.env.NEXT_PUBLIC_FB_PAGE_90210 || "https://www.facebook.com/share/19P1xEugxs/?mibextid=wwXIfr",
    description: "The ultimate community for Beverly Hills, 90210 fans. Peach Pit memories, cast updates & 90s nostalgia.",
  },
  fullHouse: {
    id: "fullhouse",
    name: "Full House Fan Club",
    followers: "2.5K",
    url: process.env.NEXT_PUBLIC_FB_PAGE_FULLHOUSE || "https://www.facebook.com/share/18sdgkeXCu/?mibextid=wwXIfr",
    description: "Relive every TGIF moment with the Tanner family. Uncle Jesse, Joey, Danny, and 90s family sitcom memories.",
  },
} as const;
