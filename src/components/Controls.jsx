import { Play, Pause, SkipBack, SkipForward } from "react-feather";

export default function Controls({ isPlaying, onTogglePlay, onNext, onPrev }) {
  const buttonBaseClass =
    "flex-1 py-4 flex items-center justify-center border-r-2 border-swiss-ink last:border-r-0 " +
    "bg-swiss-paper text-swiss-ink transition-colors duration-150 " +
    "hover:bg-swiss-ink hover:text-swiss-paper cursor-pointer";

  return (
    <div className="flex border-t-2 border-swiss-ink">
      <button
        className={buttonBaseClass}
        onClick={onPrev}
        aria-label="Previous"
      >
        <SkipBack size={24} strokeWidth={2.5} />
      </button>
      <button
        className={buttonBaseClass}
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause size={28} strokeWidth={2.5} />
        ) : (
          <Play size={28} strokeWidth={2.5} />
        )}
      </button>
      <button className={buttonBaseClass} onClick={onNext} aria-label="Next">
        <SkipForward size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}
