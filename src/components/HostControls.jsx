import React from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { useAudioPlayerContext } from "../context/AudioContext";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Radio,
} from "react-feather";

export default function HostControls() {
  const { currentStation, isHost, leaveStation, emitPlayerAction } =
    useWebSocket();
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    play,
    pause,
    next,
    prev,
    seek,
    selectSong,
  } = useAudioPlayerContext();

  const navigate = useNavigate();

  // Redirect if not connected or not host
  React.useEffect(() => {
    if (!currentStation || !isHost) {
      navigate("/");
    }
  }, [currentStation, isHost, navigate]);

  if (!currentStation) return null;

  // Handlers that EMIT actions
  const handleTogglePlay = () => {
    // For host, we emit the action. The PlayerLayout listener will actually toggle the audio.
    // But we also want responsive UI.
    const action = isPlaying ? "pause" : "play";
    emitPlayerAction(action, {
      song: currentSong,
      time: progress,
    });
  };

  const handleNext = () => {
    if (currentStation && songs.length > 0) {
      // Calculate next index
      const nextIndex = (currentSongIndex + 1) % songs.length;
      const nextSong = songs[nextIndex];
      // Emit change_song action
      emitPlayerAction("change_song", { song: nextSong });
    }
  };

  const handlePrev = () => {
    if (currentStation && songs.length > 0) {
      // Calculate prev index
      const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      const prevSong = songs[prevIndex];
      // Emit change_song action
      emitPlayerAction("change_song", { song: prevSong });
    }
  };

  return (
    <div
      className="host-controls-container"
      style={{
        minHeight: "100vh",
        background: "var(--color-swiss-bg)",
        color: "var(--color-swiss-ink)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "1rem",
            fontWeight: "700",
            color: "var(--color-swiss-ink)",
          }}
        >
          <ArrowLeft /> BACK TO PLAYER
        </button>

        <div
          style={{
            background: "var(--color-swiss-ink)",
            color: "var(--color-swiss-bg)",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          <Radio size={16} /> HOSTING
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        {/* Station Info */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "900",
              margin: 0,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {currentStation.name}
          </h1>
          <div
            style={{
              marginTop: "16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--color-swiss-orange)",
              color: "white",
              padding: "8px 20px",
              fontWeight: "bold",
              borderRadius: "100px",
            }}
          >
            <Users size={20} />
            <span>
              {currentStation.listeners.length} LISTENER
              {currentStation.listeners.length !== 1 ? "S" : ""}
            </span>
          </div>
        </div>

        {/* Current Song Card */}
        <div
          style={{
            background: "var(--color-swiss-ink)",
            color: "var(--color-swiss-bg)",
            padding: "40px",
            width: "100%",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "12px 12px 0px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={currentSong.cover || "https://via.placeholder.com/300"}
            alt={currentSong.name}
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              marginBottom: "24px",
              border: "4px solid var(--color-swiss-bg)",
            }}
          />
          <h2
            style={{
              fontSize: "2rem",
              margin: "0 0 8px 0",
              textAlign: "center",
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            {currentSong.name}
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              margin: 0,
              opacity: 0.8,
              fontFamily: "monospace",
            }}
          >
            {currentSong.artist}
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {/* We rely on local state updates eventually, but we trigger via socket */}
          {/* Actually, App.jsx handles the emit logic.
                 Is there a way to reuse the `handleNext` from App.jsx?
                 Not easily without passing it down.
                 We will reconstruct the emit logic here. It's safer.
             */}
          <button
            className="btn"
            // onClick prev
            // Need logic for prev
            style={{ transform: "scale(1.5)" }}
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={handleTogglePlay}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: "none",
              background: "var(--color-swiss-orange)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(255, 71, 0, 0.3)",
            }}
          >
            {isPlaying ? (
              <Pause size={48} fill="currentColor" />
            ) : (
              <Play size={48} fill="currentColor" />
            )}
          </button>

          <button
            className="btn"
            // onClick next
            style={{ transform: "scale(1.5)" }}
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
      <div>
        {/* Footer - maybe listener list? */}
        <div
          style={{ borderTop: "2px solid rgba(0,0,0,0.1)", paddingTop: "20px" }}
        >
          <h3
            style={{
              fontSize: "1.2rem",
              textTransform: "uppercase",
              margin: "0 0 16px 0",
            }}
          >
            Room ID
          </h3>
          <code
            style={{
              background: "#eee",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "1.2rem",
            }}
          >
            {currentStation.id}
          </code>
        </div>
      </div>
    </div>
  );
}
