import { cookies } from "next/headers";
import { COOKIE, isAuthed } from "./auth";

export async function adminOk(): Promise<boolean> {
  return isAuthed((await cookies()).get(COOKIE)?.value);
}

export const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
