import { Repeat, Shuffle, List } from "react-feather";

export default function PlaylistControls({
  isRepeat,
  isShuffle,
  onToggleRepeat,
  onToggleShuffle,
  onTogglePlaylist,
}) {
  const buttonBaseClass =
    "p-3 border-2 border-swiss-ink transition-colors duration-150 " +
    "hover:bg-swiss-ink hover:text-swiss-paper";

  return (
    <div className="fixed top-6 right-6 z-20 flex gap-2">
      <button
        className={`${buttonBaseClass} ${
          isRepeat
            ? "bg-swiss-ink text-swiss-paper"
            : "bg-swiss-paper text-swiss-ink"
        }`}
        onClick={onToggleRepeat}
        aria-label="Toggle Repeat"
      >
        <Repeat size={18} strokeWidth={2.5} />
      </button>
      <button
        className={`${buttonBaseClass} ${
          isShuffle
            ? "bg-swiss-ink text-swiss-paper"
            : "bg-swiss-paper text-swiss-ink"
        }`}
        onClick={onToggleShuffle}
        aria-label="Toggle Shuffle"
      >
        <Shuffle size={18} strokeWidth={2.5} />
      </button>
      <button
        className={`${buttonBaseClass} bg-swiss-paper text-swiss-ink`}
        onClick={onTogglePlaylist}
        aria-label="Toggle Playlist"
      >
        <List size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
