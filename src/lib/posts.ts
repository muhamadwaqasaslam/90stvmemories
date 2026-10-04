import { run, toObj } from "./db";
import type { ThemeKey } from "./themes";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  theme: ThemeKey;
  imageUrl?: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

const KEY = "posts";

const seed = (
  n: number,
  slug: string,
  title: string,
  category: string,
  theme: ThemeKey,
  excerpt: string,
  content: string,
): Post => {
  const t = new Date(Date.now() - n * 86_400_000 * 3).toISOString();
  return { id: `seed-${slug}`, slug, title, category, theme, excerpt, content, status: "published", createdAt: t, updatedAt: t };
};

const SEEDS: Post[] = [
  seed(
    0,
    "saturday-morning-cartoons-cereal-bowl-ritual",
    "Saturday Morning Cartoons: The Cereal Bowl Ritual We Never Forgot",
    "Cartoons",
    "cartoon",
    "Pajamas, a giant bowl of cereal and a floor-level seat in front of the TV. Saturday mornings were an event.",
    `If you grew up in the 90s, you probably remember the alarm clock you never needed on Saturday. Somehow your eyes just opened, early, and the only plan was the living room carpet.

## The setup

Pajamas on. A bowl big enough to feed a small family. The good cereal, the one that was only allowed on weekends, poured right to the rim. The TV was never far from the couch, and the volume was always a little too loud.

> The best part was that nobody was in a hurry. The whole morning belonged to the cartoons.

## Why it felt so special

Back then, shows aired once. If you missed it, you missed it. That tiny bit of scarcity made every episode feel like an appointment, and every commercial break a chance to refill the bowl.

- No skipping ahead, no scrolling, no "watch later"
- Theme songs you can still hum on command
- Commercials that were half the fun

## Press play on the memory

What was your Saturday morning ritual? Tell us your favorite cartoon and the cereal that went with it. We read every memory.`,
  ),
  seed(
    1,
    "friday-night-blockbuster-be-kind-rewind",
    "Friday Night at Blockbuster: Be Kind, Rewind",
    "Movies & VHS",
    "vhs",
    "The walk down the aisles, the last copy gone, and the sticker on every tape. Remember the weekly rental run?",
    `Friday night had a ritual, and it started with a drive to the video store. The whole family piled in, everyone with a different movie in mind and absolutely zero chance of agreeing.

## The hunt

Walking the aisles was half the experience. You picked up a tape, studied the back of the box, put it back, then circled around again. If the new release was already gone, there was always the empty case on the shelf to remind you.

## The snacks

A movie rental wasn't complete without a bag of popcorn, something fizzy, and candy picked from the counter on the way out.

> "Be kind, please rewind" was not a suggestion. It was the law of the land.

## The return

Late fees were a real fear. Nothing felt worse than finding the tape under the couch on Monday morning. Today we stream everything, but nothing beats the memory of choosing a movie with your own two hands.`,
  ),
  seed(
    2,
    "tgif-the-night-the-whole-family-gathered-on-the-couch",
    "TGIF: The Night the Whole Family Gathered on the Couch",
    "Sitcoms",
    "sunset",
    "Friday night sitcoms, family theme songs and the feeling that the weekend had officially started.",
    `Fridays in the 90s had a sound: a big, cheerful theme song that meant school was over and the weekend had officially started.

## A lineup you could set your watch by

Family sitcoms ruled the night. Catchphrases, warm endings and a life lesson wrapped up in twenty-two minutes. Shows like Full House, Family Matters, Step by Step and Boy Meets World became part of our weekly routine.

## Why it worked

They were simple. A family, a problem, a hug at the end. You could watch with your parents, your siblings and even your grandparents, and everyone laughed at the same moments.

> Nobody needed a recommendation algorithm. The schedule was the algorithm.

## Your turn

Which show was your Friday night favorite? Tell us whether you were on the couch or on the floor.`,
  ),
  seed(
    3,
    "rabbit-ears-remotes-and-the-joy-of-channel-surfing",
    "Rabbit Ears, Remotes and the Joy of Channel Surfing",
    "Tech & Gadgets",
    "neon",
    "Tinfoil on the antenna, a remote with half the buttons worn off and a channel guide that scrolled by itself.",
    `Before apps and playlists, there was the art of channel surfing. One thumb, one remote, and an evening of possibilities.

## Adjusting the antenna

Everyone has a story about bending the rabbit ears just right. A little tinfoil, one person holding the antenna near the window, another shouting "stop, that's perfect!" from the couch.

## The remote that did everything

The remote was a sacred object. It had worn-off numbers, a missing battery cover held on by a rubber band, and a very specific spot on the couch where it always ended up.

- The static between channels
- The on-screen channel number in the corner
- The TV guide channel scrolling endlessly

## Still the best

Streaming is great, but flipping through channels and landing on something unexpected is a joy we haven't quite replaced. Do you miss it too?`,
  ),
];

export async function getAllPosts(): Promise<Post[]> {
  const [raw] = await run([["HGETALL", KEY]]);
  const map = toObj(raw);
  if (!Object.keys(map).length) {
    // first run: seed sample stories (ignore failures on read-only hosts)
    await run(SEEDS.map((p) => ["HSET", KEY, p.id, JSON.stringify(p)])).catch(() => {});
    return [...SEEDS];
  }
  return Object.values(map)
    .map((v) => JSON.parse(v) as Post)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPublished(): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.status === "published");
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug && p.status === "published");
}

export async function getPostById(id: string): Promise<Post | undefined> {
  return (await getAllPosts()).find((p) => p.id === id);
}

export async function savePost(p: Post): Promise<void> {
  await run([["HSET", KEY, p.id, JSON.stringify(p)]]);
}

export async function deletePost(id: string): Promise<void> {
  await run([["HDEL", KEY, id]]);
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const readMins = (content: string) => Math.max(1, Math.round(content.split(/\s+/).length / 200));
