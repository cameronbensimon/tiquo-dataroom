import { query, mutation } from "./_generated/server";
import { auth } from "./auth";
import { v } from "convex/values";

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    return user;
  },
});

// Get all users (basic query)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const users = await ctx.db.query("users").collect();
    return users.map(user => ({
      _id: user._id,
      email: user.email,
    }));
  },
});

// Update user access permission
export const updateUserAccess = mutation({
  args: {
    email: v.string(),
    accessAllowed: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      throw new Error(`User with email ${args.email} not found`);
    }

    // Update the user's AccessAllowed field
    await ctx.db.patch(user._id, {
      AccessAllowed: args.accessAllowed,
    });

    return { success: true, message: `Access updated for ${args.email}` };
  },
});

