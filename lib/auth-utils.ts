import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserById(userId: string): Promise<UserWithRole | null> {
  try {
    const result = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const userData = await getUserById(userId);
    return userData?.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

export function isSuperAdmin(role: string | null): boolean {
  return role === "super_admin";
}

export function isUser(role: string | null): boolean {
  return role === "user";
}