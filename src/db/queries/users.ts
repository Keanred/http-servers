import { db } from "../index.js";
import { User, users } from "../schema.js";
import { eq } from "drizzle-orm";

export const createUser = async (user: User) => {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export const deleteUsers = async () => {
  await db.delete(users);
}

export const getUserByEmail = async (email: string) => {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

export const updateUser = async (userId: string, user: User) => {
  const [result] = await db.update(users).set(user).where(eq(users.id, userId)).returning();
  return result;
}

export const setChirpyRed = async (userId: string, isChirpyRed: boolean) => {
  const [result] = await db.update(users).set({ isChirpyRed }).where(eq(users.id, userId)).returning();
  return result;
}
