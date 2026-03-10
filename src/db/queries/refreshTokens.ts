import { db } from "../index";
import { refreshTokens, users } from "../schema";
import { eq } from "drizzle-orm";

export type RefreshTokens = typeof refreshTokens.$inferInsert;

export const insertRefreshToken = async (token: RefreshTokens) => {
  const [result] = await db.insert(refreshTokens).values(token).returning();
  return result;
}

export const getRefreshToken = async (token: string) => {
  const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
  return result;
}

export const getUserFromRefreshToken = async (token: string) => {
  const [result] = await db
    .select({
      refreshToken: refreshTokens,
      user: users,
    })
    .from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))
    .where(eq(refreshTokens.token, token));

  return result;
}

export const revokeRefreshToken = async (token: string) => {
  const now = new Date();
  const [result] = await db
    .update(refreshTokens)
    .set({ revokedAt: now, updatedAt: now })
    .where(eq(refreshTokens.token, token))
    .returning();
  return result;
}
