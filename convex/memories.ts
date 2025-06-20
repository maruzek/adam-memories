import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { memoryTypes } from "./schema";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const memories = await ctx.db.query("memories").order("desc").collect();
    return Promise.all(
      memories.map(async (memory) => {
        if (memory.fileId) {
          return {
            ...memory,
            fileUrl: await ctx.storage.getUrl(memory.fileId),
            fileType:
              memory.type === "image"
                ? "image"
                : memory.type === "video"
                ? "video"
                : "file",
          };
        }
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
    fileId: v.optional(v.id("_storage")),
    link: v.optional(v.string()), // Accept link from client
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
      fileId: args.fileId ?? undefined,
      link: args.link ?? undefined, // Store link if present
    });
  },
});
