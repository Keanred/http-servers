import { db } from "../index";
import { chirps } from "../schema";
import { asc, desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

export type Chirp = typeof chirps.$inferInsert;
export type SortOrder = 'asc' | 'desc';

export const insertChirp = async (chirp: Chirp): Promise<Chirp> => {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
}

export const getAllChirps = async (sort: SortOrder = 'asc'): Promise<Chirp[]> => {
  const orderFn = sort === 'desc' ? desc : asc;
  const result = await db.select().from(chirps).orderBy(orderFn(chirps.createdAt));
  return result;
}

export const getChirpsByAuthorId = async (authorId: string, sort: SortOrder = 'asc'): Promise<Chirp[]> => {
  const orderFn = sort === 'desc' ? desc : asc;
  const result = await db.select().from(chirps).where(eq(chirps.userId, authorId)).orderBy(orderFn(chirps.createdAt));
  return result;
}

export const getChirpById = async (id: string): Promise<Chirp> => {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
  return result;
}

export const deleteChirpById = async (id: string): Promise<void> => {
  await db.delete(chirps).where(eq(chirps.id, id));
}
