import type { Id } from "convex/_generated/dataModel";

export type Memory = {
  _id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  type: "text" | "image" | "video" | "link";
  fileIds?: Id<"_storage">[]; // Array of file IDs for images/videos
  fileTypes?: string[]; // Array of MIME types for files
  link?: string; // Optional embeddable link
  _creationTime: number; // Timestamp of creation
  fileUrls?: string[];
  fileUrl?: string;
};
