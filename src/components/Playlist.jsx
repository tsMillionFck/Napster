import { ChevronLeft } from "react-feather";
import PlaylistItem from "./PlaylistItem";

export default function Playlist({
  songs,
  currentSongIndex,
  isOpen,
  onSelectSong,
  onClose,
}) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 z-50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{
        background: "var(--color-swiss-bg)",
        borderRight: "4px solid var(--color-swiss-ink)",
      }}
    >
      {/* Header with close button */}
      <div
        style={{
          padding: "24px",
          borderBottom: "4px solid var(--color-swiss-ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              background: "var(--color-swiss-orange)",
            }}
          />
          <h2
            style={{
              fontWeight: 900,
              fontSize: "1.5rem",
              textTransform: "uppercase",
              letterSpacing: "-1px",
              margin: 0,
              color: "var(--color-swiss-ink)",
            }}
          >
            QUEUE
          </h2>
        </div>

        {/* Close Arrow Button */}
        <button
          onClick={onClose}
          style={{
            background: "var(--color-swiss-ink)",
            color: "var(--color-swiss-bg)",
            border: "none",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.1s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-swiss-orange)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--color-swiss-ink)")
          }
          aria-label="Close playlist"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Song List */}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          overflowY: "auto",
          height: "calc(100% - 92px)",
        }}
      >
        {songs.map((song, index) => (
          <PlaylistItem
            key={index}
            song={song}
            index={index}
            isActive={index === currentSongIndex}
            onSelect={onSelectSong}
          />
        ))}
      </ul>
    </div>
  );
}
