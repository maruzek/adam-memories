import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Resend({ from: "no-reply@auth.beestrong.cz" })],
});

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.log("User is not authenticated");
      return false; // Not authenticated
    }
    const user = await ctx.db
      .query("authAccounts")
      .withIndex("by_providerAccountId", (q) => {
        return q.eq("providerAccountId", identity.subject);
      })
      .first();

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
