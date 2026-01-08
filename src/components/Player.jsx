import SwissCross from "./SwissCross";

export default function Player({
  song,
  isPlaying,
  progress,
  duration,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  isReadOnly = false,
}) {
  // Format time as MM:SS
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  // Handle progress bar click
  const handleProgressClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const newTime = percent * duration;
    onSeek(newTime);
  };

  // Split song name for dramatic display
  const displayName =
    song.name.length > 12
      ? song.name.split(" ").map((word, i) => (
          <span key={i}>
            {word}
            <br />
          </span>
        ))
      : song.name;

  return (
    <div className="player-card">
      <SwissCross />

      {/* Hero - Album Cover */}
      <div className="hero">
        {song.cover && (
          <img src={song.cover} className="album-art" alt={song.name} />
        )}
      </div>

      {/* Progress Bar */}
      <div
        className="progress-bar-container"
        onClick={isReadOnly ? undefined : handleProgressClick}
        style={{
          height: "8px",
          background: "var(--color-swiss-ink)",
          cursor: isReadOnly ? "not-allowed" : "pointer",
          position: "relative",
        }}
      >
        <div
          className="progress-bar-fill"
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            background: "var(--color-swiss-orange)",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* Info Section */}
      <div className="info">
        <h1 className="song-title">{displayName}</h1>
        <div className="artist-row">
          <p className="artist">{song.artist}</p>
          <p className="time">
            {formatTime(progress)} / {formatTime(duration)}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div
        className="controls"
        style={{
          opacity: isReadOnly ? 0.5 : 1,
          pointerEvents: isReadOnly ? "none" : "auto",
        }}
      >
        <button className="btn" onClick={onPrev} aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>
        <button
          className="btn btn-play"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button className="btn" onClick={onNext} aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
