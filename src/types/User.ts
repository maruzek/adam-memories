import type { Id } from "convex/_generated/dataModel";

export type User = {
    _id: Id<"users">;
    name?: string;
    email?: string;
    role?: "user" | "admin";
    _creationTime?: string;
}