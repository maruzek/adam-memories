interface SpotifyEmbedProps {
  /**
   * Any Spotify URL (https://open.spotify.com/track/... ) or URI
   * (spotify:track:...)
   */
  url: string;
  /** iframe height in px (default 380) */
  height?: number;
  /** iframe width (e.g. "100%", "300px") (default "100%") */
  width?: string;
}

const SpotifyEmbed = ({
  url,
  height = 380,
  width = "100%",
}: SpotifyEmbedProps) => {
  // Regex to capture type and id from URL or URI
  const m =
    url.match(
      /(spotify[:/])(track|album|playlist|artist)([:/])([a-zA-Z0-9]+)/
    ) || [];
  const [, , type, , id] = m;

  if (!type || !id) {
    return;
  }

  const embedUrl = `https://open.spotify.com/embed/${type}/${id}`;

  return (
    <iframe
      title={`Spotify ${type} ${id}`}
      src={embedUrl}
      width={width}
      height={height}
      frameBorder="0"
      allow="encrypted-media"
      style={{ borderRadius: 8 }}
    />
  );
};

export default SpotifyEmbed;
