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

type MemoryType = "text" | "upload" | "link";

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
  const [files, setFiles] = useState<File[]>([]); // <-- array of files
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const sendMemory = useMutation(api.memories.send);
  const generateUploadUrl = useAction(api.memories.generateUploadUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "upload" && files.length === 0) {
      alert("Prosím, přidejte alespoň jeden soubor k nahrání.");
      return;
    }
    if (type === "link" && !link) {
      alert("Prosím, vložte platný odkaz.");
      return;
    }
    if (type === "text" && !content) {
      alert("Prosím, napište svou zprávu.");
      return;
    }

    const fileIds: string[] = [];
    const fileTypes: string[] = [];

    if (type === "upload" && files.length > 0) {
      setUploading(true);
      for (const file of files) {
        let uploadFile = file;
        if (file.type.startsWith("image/")) {
          // Optimize image before upload
          uploadFile = await resizeImage(file);
        }
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: uploadFile,
        });
        if (res.ok) {
          const { storageId } = await res.json();
          fileIds.push(storageId);
          fileTypes.push(file.type);
        } else {
          alert("File upload failed");
          setUploading(false);
          return;
        }
      }
      setUploading(false);
      await sendMemory({
        content,
        type: "image", // treat as image/video for backend
        fileIds,
        fileTypes,
        link: link || undefined,
      });
    } else {
      await sendMemory({
        content,
        type: type === "upload" ? "image" : type,
        link: link || undefined,
      });
    }
    setContent("");
    setFiles([]);
    setLink("");
    onSuccess();
  };

  const getPlaceholder = () => {
    switch (type) {
      case "link":
        return "Vložte odkaz na video, obrázek nebo jiný obsah...";
      case "text":
        return "Zde můžete napsat svou zprávu pro Adama...";
      default:
        return "Zde můžete přidat zprávu k nahraným fotkám nebo videím...";
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Podělte se o svou vzpomínku s Adamem</CardTitle>
        <CardDescription>
          Vaše zpráva bude pro Adama velkou oporou.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs
            value={type}
            onValueChange={(value) => {
              setType(value as MemoryType);
              setFiles([]);
              setContent("");
              setLink("");
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Zpráva</TabsTrigger>
              <TabsTrigger value="upload">Nahrát fotky/videa</TabsTrigger>
              <TabsTrigger value="link">Odkaz</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid w-full items-center gap-4 pt-4">
            {type === "upload" && (
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="file"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) =>
                    setFiles(e.target.files ? Array.from(e.target.files) : [])
                  }
                  className="mb-4"
                />
                {files.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {files.map((f) => f.name).join(", ")}
                  </span>
                )}
                <Label htmlFor="content">Zpráva</Label>
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
                <Label htmlFor="content">Vaše zpráva</Label>
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
                <Label htmlFor="link">Odkaz k vložení</Label>
                <Input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={getPlaceholder()}
                />
                <Label htmlFor="content">Zpráva</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Přidejte zprávu pro Adama..."
                />
              </div>
            )}
          </div>
          <Button className="mt-4 w-full" disabled={uploading}>
            {uploading ? "Nahrávám..." : "Odeslat vzpomínku"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
