import { db } from "../index";
import { chirps } from "../schema";

export type Chirp = typeof chirps.$inferInsert;

export const insertChirp = async (chirp: Chirp) => {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
}
