import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = await getAuthUserId(ctx);
    if (!identity) {
      console.log("User is not authenticated");
      return false; // Not authenticated
    }

    if (!userId) {
      console.log("User ID not found");
      return false; // User ID not found
    }
    const user = await ctx.db.get(userId);

    // console.log("email", identity.email);
    console.log("user: ", user);

    if (!user) {
      console.log("identity", identity);
      console.log(
        "User not found in the database",
        identity.provider as string,
        identity.subject
      );
      return false; // User not found in the database
    }

    return user?.role === "admin";
  },
});

export const setName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("setName called with args:", args);
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .first();
    if (user) {
      await ctx.db.patch(user._id, { name: args.name });
    }
  },
});

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null; // If userId is not found, return null
    return await ctx.db.get(userId); // Get the current user by ID
  },
});
