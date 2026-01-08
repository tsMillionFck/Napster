import React, { useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { Radio, Users, LogOut } from "react-feather";

export default function StationManager() {
  const { isConnected, currentStation, leaveStation } = useWebSocket();

  if (!isConnected) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          background: "var(--color-swiss-orange)",
          color: "var(--color-swiss-bg)",
          padding: "8px 16px",
          fontWeight: "900",
          textTransform: "uppercase",
          border: "4px solid var(--color-swiss-ink)",
          boxShadow: "4px 4px 0px var(--color-swiss-ink)",
          zIndex: 100,
        }}
      >
        OFFLINE
      </div>
    );
  }

  if (currentStation) {
    return (
      <div
        style={{
          position: "fixed",
          top: "30px",
          right: "80px",
          background: "var(--color-swiss-bg)",
          border: "4px solid var(--color-swiss-ink)",
          padding: "16px",
          zIndex: 90,
          boxShadow: "8px 8px 0px var(--color-swiss-ink)",
          minWidth: "200px",
        }}
      >
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
