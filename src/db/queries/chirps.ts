import { db } from "../index";
import { chirps } from "../schema";
import { asc } from "drizzle-orm";
import { eq } from "drizzle-orm";

export type Chirp = typeof chirps.$inferInsert;

export const insertChirp = async (chirp: Chirp): Promise<Chirp> => {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
}

export const getAllChirps = async (): Promise<Chirp[]> => {
  const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
  return result;
}

export const getChirpById = async (id: string): Promise<Chirp> => {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
  return result;
}

export const deleteChirpById = async (id: string): Promise<void> => {
  await db.delete(chirps).where(eq(chirps.id, id));
}
