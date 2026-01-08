import React, { useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { Radio, Users, LogOut } from "react-feather";

export default function StationManager() {
  const { isConnected, currentStation, leaveStation } = useWebSocket();

  if (!isConnected) {
    return <div className="station-offline">OFFLINE</div>;
  }

  if (currentStation) {
    return (
      <div className="station-widget">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Radio size={16} color="var(--color-swiss-orange)" />
            <span
              style={{
                fontWeight: "900",
                textTransform: "uppercase",
                maxWidth: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentStation.name}
            </span>
          </div>
          <button
            onClick={leaveStation}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-swiss-ink)",
            }}
            title="Leave Station"
          >
            <LogOut size={16} />
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.8rem",
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          <Users size={12} />
          <span>{currentStation.listeners?.length || 0} LISTENING</span>
        </div>
        <div
          style={{
            marginTop: "8px",
            fontSize: "0.7rem",
            fontFamily: "monospace",
            opacity: 0.6,
          }}
        >
          ID: {currentStation.id.slice(0, 8)}...
        </div>
      </div>
    );
  }

  return null;
}
