"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE, checkPassword, isAuthed, makeToken } from "../../lib/auth";
import { deletePost, getAllPosts, getPostById, savePost, slugify, type Post } from "../../lib/posts";
import { deleteMessage, setRead } from "../../lib/messages";
import { THEMES, type ThemeKey } from "../../lib/themes";

async function requireAdmin() {
  if (!(await isAuthed((await cookies()).get(COOKIE)?.value))) redirect("/admin/login");
}

export async function login(_: string | null, form: FormData): Promise<string | null> {
  if (!(await checkPassword(String(form.get("password") ?? "")))) return "Wrong password. Please try again.";
  (await cookies()).set(COOKIE, await makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}

export async function save(_: string | null, form: FormData): Promise<string | null> {
  await requireAdmin();
  const str = (k: string) => String(form.get(k) ?? "").trim();

  const title = str("title");
  const content = str("content");
  if (!title || !content) return "Title and article text are required.";

  const id = str("id");
  const existing = id ? await getPostById(id) : undefined;
  const slug = slugify(str("slug") || title);
  if (!slug) return "Could not build a URL from that title.";
  const clash = (await getAllPosts()).find((p) => p.slug === slug && p.id !== existing?.id);
  if (clash) return `The URL "${slug}" is already used by another article.`;

  const rawTags = str("tags");
  const tags = rawTags
    ? rawTags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean)
    : [];

  const now = new Date().toISOString();
  const theme = (str("theme") in THEMES ? str("theme") : "sunset") as ThemeKey;
  const post: Post = {
    id: existing?.id ?? crypto.randomUUID(),
    slug,
    title,
    content,
    excerpt: str("excerpt") || content.replace(/[#>*-]/g, "").slice(0, 160).trim() + "…",
    category: str("category") || "Memories",
    tags: tags.length > 0 ? tags : undefined,
    theme,
    imageUrl: /^(https?:\/\/|\/(?!\/))[^\s"'()]+$/.test(str("imageUrl")) ? str("imageUrl") : undefined,
    status: str("status") === "draft" ? "draft" : "published",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await savePost(post);
  revalidatePath("/");
  revalidatePath(`/posts/${slug}`);
  redirect("/admin/posts?saved=1");
}

export async function remove(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  const post = await getPostById(id);
  await deletePost(id);
  revalidatePath("/");
  if (post) revalidatePath(`/posts/${post.slug}`);
  redirect("/admin/posts?deleted=1");
}

export async function markMessage(form: FormData) {
  await requireAdmin();
  await setRead(String(form.get("id") ?? ""), form.get("read") === "1");
  revalidatePath("/admin/messages");
}

export async function removeMessage(form: FormData) {
  await requireAdmin();
  await deleteMessage(String(form.get("id") ?? ""));
  revalidatePath("/admin/messages");
}
