import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUser(userId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    return user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getAllUsers() {
  try {
    const allUsers = await db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        accessAllowed: true,
        createdAt: true,
      },
    });
    return allUsers;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

export async function updateUserAccess(email: string, accessAllowed: boolean) {
  try {
    const result = await db
      .update(users)
      .set({ 
        accessAllowed,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email))
      .returning();

    if (result.length === 0) {
      throw new Error(`User with email ${email} not found`);
    }

    return { 
      success: true, 
      message: `Access updated for ${email}`,
      user: result[0]
    };
  } catch (error) {
    console.error('Error updating user access:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function createUser(email: string, accessAllowed: boolean = false) {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error(`User with email ${email} already exists`);
    }

    const result = await db
      .insert(users)
      .values({
        email: email.toLowerCase().trim(),
        accessAllowed,
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (result.length === 0) {
      throw new Error('Failed to create user');
    }

    return {
      success: true,
      message: `User ${email} created successfully`,
      user: result[0]
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}
