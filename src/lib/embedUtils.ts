// src/lib/embedUtils.ts

export function getYouTubeEmbedUrl(url: string): string | null {
  // Match youtube.com/watch?v=VIDEOID
  const match1 = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  // Match youtu.be/VIDEOID
  const match2 = url.match(/youtu\.be\/([\w-]+)/);
  const videoId = match1 ? match1[1] : match2 ? match2[1] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export function getSpotifyEmbedUrl(url: string): string | null {
  console.log("spotify match");
  // https://open.spotify.com/episode/7makk4oTQel546B0PZlDM5?si=QxoAkTzRQz26Y3kWEQxNJA
  const SPOTIFY_URL_REGEX =
    /^https:\/\/open\.spotify\.com\/(?:[a-z]{2}\/)?(album|artist|episode|playlist|show|track)\/([A-Za-z0-9]+)(?:\/)?(?:\?[^#]+)?(?:#.*)?$/;
  const match = url.match(SPOTIFY_URL_REGEX) || [];
  console.log("match:", match);
  const [, type, id] = match;
  console.log(type, id);

  if (!type || !id) {
    console.log("invalid spot url");
    return null;
  }

  return `https://open.spotify.com/embed/${type}/${id}`;
}
