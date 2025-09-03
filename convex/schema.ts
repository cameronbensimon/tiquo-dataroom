import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // Include Convex Auth tables (includes users table)
  ...authTables,
  
  // Your application tables can be added here
  // The users table is provided by authTables
});
