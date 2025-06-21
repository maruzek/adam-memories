import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { memoryTypes } from "./schema";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const memories = await ctx.db.query("memories").order("desc").collect();

    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const user = await ctx.db.get(userId);

    if (user?.role !== "admin" || !user || user?.role === null) {
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
    const identity = await ctx.auth.getUserIdentity();
    await ctx.db.insert("memories", {
      authorName: identity?.name ?? "Anonymous",
      authorEmail: identity?.email ?? "Anonymous",
      content: args.content,
      type: args.type,
      fileIds: args.fileIds ?? undefined,
      fileTypes: args.fileTypes ?? undefined,
      link: args.link ?? undefined, // Store link if present
    });
  },
});
