import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getSpotifyEmbedUrl, getYouTubeEmbedUrl } from "@/lib/embedUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { Memory } from "@/types/Memory";

export function MemoryCard({ memory }: { memory: Memory }) {
  const [open, setOpen] = useState(false);
  let dialogHasMinHeight = false;

  // Helper to render all files (images/videos)
  const renderFiles = (thumbOnly = false) => {
    if (!memory.fileIds || !memory.fileTypes || !Array.isArray(memory.fileIds))
      return null;
    const fileUrls =
      memory.fileUrls || memory.fileIds.map(() => memory.fileUrl || null);
    if (thumbOnly) {
      // Only show the first file as thumbnail
      const url = fileUrls[0];
      const type = memory.fileTypes[0] || "";
      if (type.startsWith("image/")) {
        return (
          <img
            src={url ?? ""}
            alt="Memory thumbnail"
            className="rounded-md block w-full cursor-pointer"
            loading="lazy"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
            onClick={() => setOpen(true)}
          />
        );
      } else if (type.startsWith("video/")) {
        return (
          <video
            className="rounded-md block w-full cursor-pointer"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
            preload="metadata"
            onClick={() => setOpen(true)}
          >
            <source src={url ?? ""} type={type} />
          </video>
        );
      }
      return null;
    }
    // Show all files (for modal)
    return (
      <div className="flex flex-col gap-3 items-center">
        {fileUrls
          .filter((url): url is string => !!url)
          .map((url: string, idx: number) => {
            const type = (memory.fileTypes && memory.fileTypes[idx]) || "";
            if (type.startsWith("image/")) {
              return (
                <img
                  key={url}
                  src={url}
                  alt="Memory"
                  className="rounded-md block max-h-[80vh]"
                  loading="lazy"
                // style={{
                //   height: "auto",
                //   objectFit: "contain",
                // }}
                />
              );
            } else if (type.startsWith("video/")) {
              return (
                <video
                  key={url}
                  controls
                  className="rounded-md block max-h-[80vh]"
                  preload="metadata"
                // style={{
                //   display: "block",
                //   width: "100%",
                //   height: "auto",
                //   objectFit: "contain",
                // }}
                >
                  <source src={url} type={type} />
                  Your browser does not support the video tag.
                </video>
              );
            }
            return null;
          })}
      </div>
    );
  };

  const renderContent = () => {
    // YouTube embed
    if (memory.type === "link" && typeof memory.link === "string") {
      const ytEmbedUrl = getYouTubeEmbedUrl(memory.link);
      // Improved YouTube thumbnail extraction
      const ytIdMatch = memory.link.match(
        /(?:v=|youtu.be\/|embed\/)([\w-]{11})/
      );
      const ytId = ytIdMatch ? ytIdMatch[1] : null;
      if (ytEmbedUrl && ytId) {
        return (
          <div className="cursor-pointer" onClick={() => setOpen(true)}>
            <img
              src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
              alt="YouTube thumbnail"
              className="rounded-md w-full cursor-pointer"
              style={{ maxHeight: 200, objectFit: "contain" }}
            />
          </div>
        );
      }
      const spotifyEmbedUrl = getSpotifyEmbedUrl(memory.link);
      if (spotifyEmbedUrl) {
        return (
          <div
            className="bg-gray-100 rounded-md flex items-center justify-center h-48 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <span className="text-gray-700">Spotify Link</span>
          </div>
        );
      }
      // fallback: show as link
      return (
        <a
          href={memory.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {memory.link}
        </a>
      );
    }
    // Render uploaded files (thumbnail only)
    if (memory.fileIds && memory.fileTypes && memory.fileIds.length > 0) {
      return renderFiles(true);
    }
    // Fallback for text
    if (memory.type === "text") {
      return (
        <p className="mb-2 whitespace-pre-line">
          {memory.content.length > 120
            ? memory.content.slice(0, 120) + "…"
            : memory.content}
        </p>
      );
    }
    return null;
  };

  // Modal content
  const renderModalContent = () => {
    if (memory.type === "link" && typeof memory.link === "string") {
      const ytEmbedUrl = getYouTubeEmbedUrl(memory.link);
      if (ytEmbedUrl) {
        dialogHasMinHeight = true;
        return (
          <iframe
            width="100%"
            height="315"
            src={ytEmbedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-md justify-self-center max-w-1/2 mx-auto"
          ></iframe>
        );
      }
      const spotifyEmbedUrl = getSpotifyEmbedUrl(memory.link);
      if (spotifyEmbedUrl) {
        dialogHasMinHeight = true;
        return (
          <iframe
            src={spotifyEmbedUrl}
            height={380}
            frameBorder="0"
            allow="encrypted-media"
            style={{ borderRadius: 8 }}
            className="w-full max-w-2xl mx-auto"
          />
        );
      }
      // fallback: show as link
      return (
        <a
          href={memory.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {memory.link}
        </a>
      );
    }
    if (memory.fileIds && memory.fileTypes && memory.fileIds.length > 0) {
      return renderFiles(false);
    }
    return null;
  };

  return (
    <>
      <Card
        className="w-full max-w-lg mx-auto group cursor-pointer transition-shadow hover:shadow-2xl hover:ring-2 hover:ring-yellow-400 relative"
        onClick={() => setOpen(true)}
        tabIndex={0}
        role="button"
        aria-label="Otevřít detail vzpomínky"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        }}
      >
        <CardHeader>
          <CardTitle>{memory.authorName || "Anonymní"}</CardTitle>
        </CardHeader>
        <CardContent>
          {memory.content && memory.type !== "text" && (
            <p className="mb-2 whitespace-pre-line">
              {memory.content.length > 120
                ? memory.content.slice(0, 120) + "…"
                : memory.content}
            </p>
          )}
          <div className="mt-3 relative">
            {renderContent()}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/60 text-white px-4 py-2 rounded-full text-lg font-semibold flex items-center gap-2 pointer-events-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
                Klikněte pro zobrazení více
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">
            Sdíleno dne{" "}
            {new Date(memory._creationTime).toLocaleDateString("cs-CZ")}
          </p>
        </CardFooter>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="min-w-10/12 w-full max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>{memory.authorName || "Anonymní"}</DialogTitle>
            <DialogDescription>
              Sdíleno dne{" "}
              {new Date(memory._creationTime).toLocaleDateString("cs-CZ")}
              {memory.authorEmail ? ` (${memory.authorEmail})` : ""}
            </DialogDescription>
          </DialogHeader>
          {memory.content && (
            <div className="mb-2 whitespace-pre-line">
              {memory.content}
            </div>
          )}
          {dialogHasMinHeight ? (
            <div className="min-h-[300px]">
              {renderModalContent()}
            </div>
          ) : renderModalContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
