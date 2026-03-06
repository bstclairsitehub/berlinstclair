'use client'

interface SpotifyEmbedProps {
  /** Spotify URI or URL — supports playlists, albums, and tracks */
  spotifyUrl?: string
  height?: number
}

/**
 * Extracts Spotify embed path from various URL formats.
 * Supports: open.spotify.com/playlist/..., spotify:playlist:..., etc.
 */
function getEmbedUrl(input: string): string {
  // Already an embed URL
  if (input.startsWith('https://open.spotify.com/embed/')) return input

  // Standard Spotify URL: https://open.spotify.com/playlist/xxx
  const urlMatch = input.match(
    /open\.spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/
  )
  if (urlMatch) {
    return `https://open.spotify.com/embed/${urlMatch[1]}/${urlMatch[2]}?utm_source=generator&theme=0`
  }

  // Spotify URI: spotify:playlist:xxx
  const uriMatch = input.match(/spotify:(playlist|album|track):([a-zA-Z0-9]+)/)
  if (uriMatch) {
    return `https://open.spotify.com/embed/${uriMatch[1]}/${uriMatch[2]}?utm_source=generator&theme=0`
  }

  // Fallback — return as-is
  return input
}

// Default playlist — a chill vibes playlist
const DEFAULT_PLAYLIST = 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0SM0LYsmbMT?utm_source=generator&theme=0'

export default function SpotifyEmbed({
  spotifyUrl,
  height = 380,
}: SpotifyEmbedProps) {
  const embedUrl = spotifyUrl ? getEmbedUrl(spotifyUrl) : DEFAULT_PLAYLIST

  return (
    <div className="w-full rounded-sm overflow-hidden border border-dp-border bg-dp-surface">
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="w-full"
        title="Spotify Player"
      />
    </div>
  )
}
