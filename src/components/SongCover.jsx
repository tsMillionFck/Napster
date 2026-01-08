export default function SongCover({ song, isPlaying }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden">
      {/* Sticker Label */}
      <div className="absolute top-3 left-3 z-10 bg-swiss-red text-white font-bold text-xs uppercase tracking-widest px-2 py-1">
        {isPlaying ? "NOW PLAYING" : "PAUSED"}
      </div>

      {/* Album Cover Image */}
      <img
        src={song.cover}
        alt={song.name}
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
      />
    </div>
  );
}
