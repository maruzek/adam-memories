import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const memoryTypes = v.union(
  v.literal("text"),
  v.literal("image"),
  v.literal("video"),
  v.literal("link")
);

const schema = defineSchema({
  ...authTables,
  memories: defineTable({
    authorName: v.string(),
    authorEmail: v.string(),
    content: v.string(),
    type: memoryTypes,
    fileIds: v.optional(v.array(v.id("_storage"))),
    fileTypes: v.optional(v.array(v.string())),
    link: v.optional(v.string()), // Add link field for embeddable links
  })
    .index("by_authorEmail", ["authorEmail"])
    .index("by_type", ["type"]),
});

export default schema;
