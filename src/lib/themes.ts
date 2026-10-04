export const THEMES = {
  sunset: { label: "Sunset Strip", emoji: "📺", bg: "from-[#ff2e93] via-[#ff7a45] to-[#ffe14a]" },
  neon: { label: "Neon Nights", emoji: "🕹️", bg: "from-[#6a2cff] via-[#ff2e93] to-[#19e3ff]" },
  vhs: { label: "VHS Tape", emoji: "📼", bg: "from-[#19e3ff] via-[#3b82f6] to-[#6a2cff]" },
  cartoon: { label: "Cartoon Cereal", emoji: "🥣", bg: "from-[#ffe14a] via-[#7ee081] to-[#19e3ff]" },
  mall: { label: "Mall Teal", emoji: "🛼", bg: "from-[#00c2a8] via-[#19e3ff] to-[#ff2e93]" },
} as const;

export type ThemeKey = keyof typeof THEMES;
export const themeOf = (k: string) => THEMES[(k in THEMES ? k : "sunset") as ThemeKey];
