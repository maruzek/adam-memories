import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = await getAuthUserId(ctx);
    if (!identity) {
      console.log("User is not authenticated");
      return false; // Not authenticated
    }
    // const user = await ctx.db
    //   .query("users")
    //   .withIndex("by_id", (q) => q.eq("_id", identity.subject))
    //   .first();
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
