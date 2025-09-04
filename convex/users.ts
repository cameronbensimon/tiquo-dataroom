import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

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

// Check if user has access permission
export const checkUserAccess = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return false;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return false;
    }

    return user.AccessAllowed ?? false;
  },
});

// Update user access permissions (admin only)
export const updateUserAccess = mutation({
  args: {
    userId: v.id("users"),
    AccessAllowed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Note: Add admin check here when you implement admin roles
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const { userId, AccessAllowed } = args;
    
    if (AccessAllowed !== undefined) {
      await ctx.db.patch(userId, { AccessAllowed });
    }
  },
});

// Get all users with their access permissions (admin only)
export const getAllUsersWithAccess = query({
  args: {},
  handler: async (ctx) => {
    // Note: Add admin check here when you implement admin roles
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const users = await ctx.db.query("users").collect();
    return users.map(user => ({
      _id: user._id,
      email: user.email,
      AccessAllowed: user.AccessAllowed ?? false,
    }));
  },
});

// Initialize user access permissions (called when user signs up)
export const initializeUserAccess = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      AccessAllowed: false, // No access by default
    });
  },
});

// Grant access to a user (admin utility)
export const grantAccess = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.userId, {
      AccessAllowed: true,
    });
  },
});

// Revoke access from a user (admin utility)
export const revokeAccess = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.userId, {
      AccessAllowed: false,
    });
  },
});
