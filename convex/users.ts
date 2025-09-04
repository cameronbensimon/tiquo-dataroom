import { query } from "./_generated/server";
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

