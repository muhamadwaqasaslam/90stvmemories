import { run, toObj } from "./db";

export type MessageKind = "contact" | "subscribe" | "comment" | "memory";

export interface Message {
  id: string;
  kind: MessageKind;
  name: string;
  email: string;
  subject: string;
  /** every submitted field, label -> value */
  fields: Record<string, string>;
  page: string;
  country: string;
  device: string;
  read: boolean;
  createdAt: string;
}

const KEY = "messages";

export const KINDS: Record<MessageKind, string> = {
  contact: "Contact",
  subscribe: "Subscriber",
  comment: "Comment",
  memory: "TV memory",
};

export async function getMessages(): Promise<Message[]> {
  const [raw] = await run([["HGETALL", KEY]]);
  return Object.values(toObj(raw))
    .map((v) => JSON.parse(v) as Message)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveMessage(m: Message): Promise<void> {
  await run([["HSET", KEY, m.id, JSON.stringify(m)]]);
}

export async function deleteMessage(id: string): Promise<void> {
  await run([["HDEL", KEY, id]]);
}

export async function setRead(id: string, read: boolean): Promise<void> {
  const [raw] = await run([["HGET", KEY, id]]);
  if (typeof raw !== "string") return;
  await saveMessage({ ...(JSON.parse(raw) as Message), read });
}

export async function unreadCount(): Promise<number> {
  try {
    return (await getMessages()).filter((m) => !m.read).length;
  } catch {
    return 0;
  }
}
