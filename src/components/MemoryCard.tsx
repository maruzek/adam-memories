import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getSpotifyEmbedUrl, getYouTubeEmbedUrl } from "@/lib/embedUtils";

export function MemoryCard({ memory }: { memory: any }) {
  const renderContent = () => {
    // YouTube embed
    if (memory.type === "link" && typeof memory.content === "string") {
      const ytEmbedUrl = getYouTubeEmbedUrl(memory.link);
      if (ytEmbedUrl) {
        return (
          <iframe
            width="100%"
            height="315"
            src={ytEmbedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-md"
          ></iframe>
        );
      }

      const spotifyEmbedUrl = getSpotifyEmbedUrl(memory.link);
      if (spotifyEmbedUrl) {
        return (
          <iframe
            src={spotifyEmbedUrl}
            width="100%"
            height={380}
            frameBorder="0"
            allow="encrypted-media"
            style={{ borderRadius: 8 }}
          />
        );
      }
    }

    if (
      (memory.type === "image" || memory.type === "video") &&
      memory.fileUrl
    ) {
      if (memory.type === "image") {
        // Use width/height, loading, and srcSet for optimization
        return (
          <img
            src={memory.fileUrl}
            alt="Memory"
            className="rounded-md w-full h-auto object-cover"
            loading="lazy"
            srcSet={memory.fileUrl + " 1x, " + memory.fileUrl + " 2x"}
          />
        );
      } else if (memory.type === "video") {
        return (
          <video controls className="rounded-md w-full" preload="metadata">
            <source src={memory.fileUrl} />
            Your browser does not support the video tag.
          </video>
        );
      }
    }
    switch (memory.type) {
      case "image":
        return (
          <img
            src={memory.content}
            alt="Memory"
            className="rounded-md w-full h-auto object-cover"
            loading="lazy"
            style={{ maxHeight: 400 }}
            srcSet={memory.content + " 1x, " + memory.content + " 2x"}
          />
        );
      case "video":
        return (
          <a href={memory.content} target="_blank" rel="noopener noreferrer">
            {memory.content}
          </a>
        );
      case "link":
        return (
          <a
            href={memory.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {memory.content}
          </a>
        );
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{memory.author}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="">{memory.content}</p>
        <div className="mt-5">{renderContent()}</div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-500">
          Shared on {new Date(memory._creationTime).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
}
