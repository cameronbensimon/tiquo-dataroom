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

// Check if user has specific access permission
export const checkUserAccess = query({
  args: {
    accessType: v.union(
      v.literal("general"),
      v.literal("companyDocuments"), 
      v.literal("deck"),
      v.literal("productTechnology"),
      v.literal("brandStrategy")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return false;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return false;
    }

    // Map access types to user fields
    const accessMap = {
      general: user.generalAccess ?? false,
      companyDocuments: user.companyDocumentsAccess ?? false,
      deck: user.deckAccess ?? false,
      productTechnology: user.productTechnologyAccess ?? false,
      brandStrategy: user.brandStrategyAccess ?? false,
    };

    return accessMap[args.accessType];
  },
});

// Update user access permissions (admin only)
export const updateUserAccess = mutation({
  args: {
    userId: v.id("users"),
    generalAccess: v.optional(v.boolean()),
    companyDocumentsAccess: v.optional(v.boolean()),
    deckAccess: v.optional(v.boolean()),
    productTechnologyAccess: v.optional(v.boolean()),
    brandStrategyAccess: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Note: Add admin check here when you implement admin roles
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const { userId, ...accessFields } = args;
    
    // Filter out undefined values
    const updateFields = Object.fromEntries(
      Object.entries(accessFields).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(userId, updateFields);
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
      generalAccess: user.generalAccess ?? false,
      companyDocumentsAccess: user.companyDocumentsAccess ?? false,
      deckAccess: user.deckAccess ?? false,
      productTechnologyAccess: user.productTechnologyAccess ?? false,
      brandStrategyAccess: user.brandStrategyAccess ?? false,
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
      generalAccess: true, // Give general access by default
      companyDocumentsAccess: false,
      deckAccess: false,
      productTechnologyAccess: false,
      brandStrategyAccess: false,
    });
  },
});

// Grant full access to a user (admin utility)
export const grantFullAccess = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.userId, {
      generalAccess: true,
      companyDocumentsAccess: true,
      deckAccess: true,
      productTechnologyAccess: true,
      brandStrategyAccess: true,
    });
  },
});

// Revoke all access except general (admin utility)
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
      generalAccess: true, // Keep general access
      companyDocumentsAccess: false,
      deckAccess: false,
      productTechnologyAccess: false,
      brandStrategyAccess: false,
    });
  },
});
