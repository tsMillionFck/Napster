import React, { useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { useNavigate } from "react-router-dom";
import { Radio, Users, Plus, ArrowLeft, Play, BarChart2 } from "react-feather";

export default function StationsPage() {
  const { createStation, joinStation, stationsList, isConnected } =
    useWebSocket();
  const navigate = useNavigate();

  const [stationName, setStationName] = useState("");
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!stationName.trim()) return;
    try {
      await createStation(stationName);
      navigate("/"); // Go to player/station view
    } catch (err) {
      setError(err);
    }
  };

  const handleJoin = async (id) => {
    try {
      await joinStation(id);
      navigate("/");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="stations-page-container">
      {/* Header */}
      <div className="stations-header">
        <button onClick={() => navigate("/")} className="btn stations-back-btn">
          <ArrowLeft /> BACK TO MUSIC
        </button>

        <div className="stations-status">
          <div
            className="status-dot"
            style={{
              background: isConnected ? "#22c55e" : "var(--color-swiss-orange)",
            }}
          />
          <span style={{ fontWeight: "900", textTransform: "uppercase" }}>
            {isConnected ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Hero Title */}
      <div className="stations-hero">
        <h1 className="stations-hero-title">
          PUBLIC
          <br />
          STATIONS<span style={{ color: "var(--color-swiss-orange)" }}>.</span>
        </h1>
      </div>

      {/* Main Content Grid */}
      <div className="stations-grid">
        {/* Left: Stations List */}
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {stationsList.length === 0 ? (
              <div
                style={{
                  width: "100%",
                  padding: "60px",
                  border: "4px dashed var(--color-swiss-ink)",
                  textAlign: "center",
                  opacity: 0.5,
                  fontSize: "1.2rem",
                  fontWeight: "700",
                }}
              >
                NO ACTIVE STATIONS FOUND
              </div>
            ) : (
              stationsList.map((station) => (
                <div
                  key={station.id}
                  style={{
                    border: "4px solid var(--color-swiss-ink)",
                    padding: "24px",
                    width: "calc(50% - 10px)",
                    background: "var(--color-swiss-bg)",
                    boxShadow: "8px 8px 0px var(--color-swiss-ink)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    transition: "transform 0.1s",
                    cursor: "pointer",
                  }}
                  onClick={() => handleJoin(station.id)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translate(-2px, -2px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translate(0, 0)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <Radio size={32} color="var(--color-swiss-orange)" />
                    <div
                      style={{
                        background: "var(--color-swiss-ink)",
                        color: "var(--color-swiss-bg)",
                        padding: "4px 8px",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                      }}
                    >
                      {station.listenersCount} LISTENING
                    </div>
                  </div>

                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.5rem",
                        fontWeight: "900",
                        textTransform: "uppercase",
                      }}
                    >
                      {station.name}
                    </h3>
                    <p
                      style={{
                        margin: "8px 0 0",
                        opacity: 0.6,
                        fontSize: "0.9rem",
                        fontFamily: "monospace",
                      }}
                    >
                      NOW PLAYING: {station.currentSong}
                    </p>
                  </div>

                  {station.isPlaying && (
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        alignItems: "flex-end",
                        height: "16px",
                      }}
                    >
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: "4px",
                            background: "var(--color-swiss-orange)",
                            height: "100%",
                            animation: `bounce 1s infinite ${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Create Panel */}
        <div
          className="create-panel"
          style={{
            border: "4px solid var(--color-swiss-ink)",
            padding: "30px",
            height: "fit-content",
            position: "sticky",
            top: "40px",
            background: "var(--color-swiss-ink)",
            color: "var(--color-swiss-bg)",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "900",
              margin: "0 0 24px 0",
              textTransform: "uppercase",
            }}
          >
            Start
            <br />
            Broadcast
          </h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <label
              style={{ fontSize: "0.9rem", fontWeight: "700", opacity: 0.8 }}
            >
              STATION NAME
            </label>
            <input
              type="text"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              placeholder="MY STATION"
              style={{
                padding: "16px",
                background: "var(--color-swiss-bg)",
                border: "none",
                color: "var(--color-swiss-ink)",
                fontSize: "1.2rem",
                fontWeight: "700",
                textTransform: "uppercase",
                outline: "none",
              }}
            />

            <button
              onClick={handleCreate}
              style={{
                padding: "20px",
                background: "var(--color-swiss-orange)",
                border: "none",
                color: "var(--color-swiss-bg)",
                fontSize: "1.2rem",
                fontWeight: "900",
                textTransform: "uppercase",
                cursor: "pointer",
                marginTop: "12px",
                display: "flex",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <Plus /> CREATE STATION
            </button>

            {error && (
              <div
                style={{
                  color: "#ff4444",
                  fontWeight: "700",
                  marginTop: "12px",
                }}
              >
                ERROR: {error}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: "40px",
              borderTop: "2px solid rgba(255,255,255,0.2)",
              paddingTop: "20px",
            }}
          >
            <p style={{ fontSize: "0.9rem", opacity: 0.7, lineHeight: 1.6 }}>
              Creating a station allows you to synchronize playback with anyone
              who joins. You control the music.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
            0%, 100% { height: 20%; }
            50% { height: 100%; }
        }
      `}</style>
    </div>
  );
}
