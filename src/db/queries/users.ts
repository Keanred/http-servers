import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export const createUser = async (user: NewUser) => {
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
