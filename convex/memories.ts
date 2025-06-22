import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { memoryTypes } from "./schema";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { user: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const user = await ctx.db.get(userId);

    if (user?.role !== "admin" || !user || user?.role === null) {
      return [];
    }

    let memories;

    if (args.user) {
      memories = await ctx.db
        .query("memories")
        .filter((q) => q.eq(q.field("authorEmail"), args.user))
        .order("desc")
        .collect();
    } else {
    memories = await ctx.db.query("memories").order("desc").collect();
    }

    if (!memories || memories.length === 0) {
      return [];
    }

    return Promise.all(
      memories.map(async (memory) => {
        if (
          memory.fileIds &&
          Array.isArray(memory.fileIds) &&
          memory.fileIds.length > 0
        ) {
          // Get all file URLs for each fileId
          const fileUrls = await Promise.all(
            memory.fileIds.map((fileId) => ctx.storage.getUrl(fileId))
          );
          return {
            ...memory,
            fileUrls: fileUrls.filter((url): url is string => !!url),
          };
        }
        // // fallback for old single fileId
        // if (memory.fileId) {
        //   return {
        //     ...memory,
        //     fileUrls: [await ctx.storage.getUrl(memory.fileId)],
        //   };
        // }
        return memory;
      })
    );
  },
});

export const generateUploadUrl = action({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const send = mutation({
  args: {
    content: v.string(),
    type: memoryTypes,
    fileIds: v.optional(v.array(v.id("_storage"))),
    fileTypes: v.optional(v.array(v.string())),
    link: v.optional(v.string()),
    authorName: v.optional(v.string()),
    authorEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: User must be logged in to send memories.");
    }

    const user = await ctx.db.get(userId);

    let email;
    if (user) {
      email = user.email;
    }

    await ctx.db.insert("memories", {
      authorName: args.authorName ?? "Anonymous",
      authorEmail: email ?? "Anonymous",
      content: args.content,
      type: args.type,
      fileIds: args.fileIds ?? undefined,
      fileTypes: args.fileTypes ?? undefined,
      link: args.link ?? undefined, // Store link if present
    });
  },
});
