export default function PlaylistItem({ song, index, isActive, onSelect }) {
  return (
    <li
      onClick={() => onSelect(index)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px 24px",
        borderBottom: "2px solid var(--color-swiss-ink)",
        cursor: "pointer",
        background: isActive ? "var(--color-swiss-ink)" : "transparent",
        color: isActive ? "var(--color-swiss-bg)" : "var(--color-swiss-ink)",
        transition: "all 0.1s ease",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "var(--color-swiss-orange)";
          e.currentTarget.style.color = "var(--color-swiss-bg)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--color-swiss-ink)";
        }
      }}
    >
      {/* Index */}
      <span
        style={{
          fontFamily: "'Courier Prime', monospace",
          fontWeight: 700,
          fontSize: "1.2rem",
          minWidth: "32px",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Cover */}
      <img
        src={song.cover}
        alt={song.name}
        style={{
          width: "48px",
          height: "48px",
          objectFit: "cover",
          filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
          border: "2px solid currentColor",
        }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {song.name}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          {song.artist}
        </p>
      </div>
    </li>
  );
}
