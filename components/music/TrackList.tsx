import Image from 'next/image'

export interface Track {
  title: string
  artist: string
  album: string
  albumArt: string
  spotifyUrl?: string
  appleMusicUrl?: string
}

const SAMPLE_TRACKS: Track[] = [
  {
    title: 'Pink + White',
    artist: 'Frank Ocean',
    album: 'Blonde',
    albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&q=80',
    spotifyUrl: '#',
  },
  {
    title: 'Cellophane',
    artist: 'FKA twigs',
    album: 'MAGDALENE',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80',
    spotifyUrl: '#',
  },
  {
    title: 'Notion',
    artist: 'Tash Sultana',
    album: 'Notion - Single',
    albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&q=80',
    spotifyUrl: '#',
  },
  {
    title: 'Ivy',
    artist: 'Frank Ocean',
    album: 'Blonde',
    albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&q=80',
    spotifyUrl: '#',
  },
  {
    title: 'Nights',
    artist: 'Frank Ocean',
    album: 'Blonde',
    albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&q=80',
    spotifyUrl: '#',
  },
]

export default function TrackList({ tracks }: { tracks?: Track[] }) {
  const items = tracks ?? SAMPLE_TRACKS

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-xs uppercase tracking-widest text-dp-gold font-semibold">
          Now Playing
        </h2>
        <div className="h-px flex-1 ml-4 bg-dp-border" />
      </div>

      <div className="divide-y divide-dp-border border border-dp-border bg-dp-surface">
        {items.map((track, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 hover:bg-dp-elevated transition-colors group"
          >
            {/* Track number */}
            <span className="font-sans text-xs text-dp-text-muted w-5 text-right tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Album art */}
            <div className="relative w-10 h-10 flex-shrink-0 bg-dp-elevated overflow-hidden">
              <Image
                src={track.albumArt}
                alt={track.album}
                fill
                className="object-cover"
              />
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="font-headline text-sm text-dp-text truncate group-hover:text-dp-gold transition-colors">
                {track.title}
              </p>
              <p className="font-sans text-xs text-dp-text-secondary truncate">
                {track.artist} · {track.album}
              </p>
            </div>

            {/* Links */}
            <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {track.spotifyUrl && (
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs uppercase tracking-widest text-dp-gold hover:text-dp-gold/80"
                >
                  Spotify
                </a>
              )}
              {track.appleMusicUrl && (
                <a
                  href={track.appleMusicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary hover:text-dp-text"
                >
                  Apple
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
