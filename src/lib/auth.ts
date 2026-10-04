export const COOKIE = "tv_admin";

const password = () => process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV === "production" ? "" : "retro90s");
const secret = () => process.env.SESSION_SECRET ?? password();

async function hmac(msg: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function checkPassword(input: string): Promise<boolean> {
  const pw = password();
  if (!pw) return false;
  // compare digests so timing does not leak the length
  return (await hmac("pw:" + input)) === (await hmac("pw:" + pw));
}

export const makeToken = () => hmac("tv-admin-session");

export async function isAuthed(token?: string): Promise<boolean> {
  if (!token || !password()) return false;
  return token === (await makeToken());
}
