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
  authAccounts: defineTable({
    emailVerified: v.optional(v.string()),
    phoneVerified: v.optional(v.string()),
    provider: v.string(),
    providerAccountId: v.optional(v.string()), // <-- make this optional
    secret: v.optional(v.string()),
    userId: v.id("users"),
  })
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("by_providerAccountId", ["providerAccountId"]), // <-- add this line
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
  })
    .index("email", ["email"])
    .index("by_role", ["role"]),
});

export default schema;
