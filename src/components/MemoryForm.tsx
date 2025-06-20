import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type MemoryType = "text" | "image" | "video" | "link";

function resizeImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = img;
      let newWidth = width;
      let newHeight = height;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        newWidth = Math.round(width * ratio);
        newHeight = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No canvas context"));
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Image compression failed"));
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function MemoryForm({ onSuccess }: { onSuccess: () => void }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState<MemoryType>("text");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const sendMemory = useMutation(api.memories.send);
  const generateUploadUrl = useAction(api.memories.generateUploadUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((type === "image" || type === "video") && !file) {
      alert("Please select a file to upload.");
      return;
    }
    if (type === "link" && !link) {
      alert("Please enter a link to embed.");
      return;
    }
    if (type === "text" && !content) {
      alert("Please enter your message.");
      return;
    }
    if (type === "image" && file) {
      setUploading(true);
      // Optimize image before upload
      const optimizedBlob = await resizeImage(file);
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "image/jpeg" },
        body: optimizedBlob,
      });
      if (res.ok) {
        const { storageId } = await res.json();
        await sendMemory({
          content,
          type,
          fileId: storageId,
          link: link || undefined,
        });
      } else {
        alert("File upload failed");
        setUploading(false);
        return;
      }
      setUploading(false);
    } else if (type === "video" && file) {
      setUploading(true);
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (res.ok) {
        const { storageId } = await res.json();
        await sendMemory({
          content,
          type,
          fileId: storageId,
          link: link || undefined,
        });
      } else {
        alert("File upload failed");
        setUploading(false);
        return;
      }
      setUploading(false);
    } else {
      await sendMemory({ content, type, link: link || undefined });
    }
    setContent("");
    setFile(null);
    setLink("");
    onSuccess();
  };

  const getPlaceholder = () => {
    switch (type) {
      case "link":
        return "Paste a link to embed (e.g. YouTube, SoundCloud, etc.)";
      case "text":
        return "Write your message for Adam...";
      default:
        return "(Optional) Add a message for Adam...";
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Share a Memory with Adam</CardTitle>
        <CardDescription>
          Your message will be a great source of strength.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs
            value={type}
            onValueChange={(value) => {
              setType(value as MemoryType);
              setFile(null);
              setContent("");
              setLink("");
            }}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="text">Message</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid w-full items-center gap-4 pt-4">
            {(type === "image" || type === "video") && (
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="file"
                  type="file"
                  accept={type === "image" ? "image/*" : "video/*"}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="mb-4"
                />
                {file && (
                  <span className="text-xs text-gray-500">{file.name}</span>
                )}
                <Label htmlFor="content">(Optional) Message</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={getPlaceholder()}
                />
              </div>
            )}
            {type === "text" && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="content">Your Message</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={getPlaceholder()}
                />
              </div>
            )}
            {type === "link" && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="link">Link to Embed</Label>
                <Input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={getPlaceholder()}
                />
                <Label htmlFor="content">(Optional) Message</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="(Optional) Add a message for Adam..."
                />
              </div>
            )}
          </div>
          <Button className="mt-4 w-full" disabled={uploading}>
            {uploading ? "Uploading..." : "Send Memory"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
