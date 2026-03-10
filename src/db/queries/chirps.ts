import { db } from "../index";
import { chirps } from "../schema";
import { asc } from "drizzle-orm";

export type Chirp = typeof chirps.$inferInsert;

export const insertChirp = async (chirp: Chirp) => {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
}

export const getAllChirps = async () => {
  const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
  return result;
}
