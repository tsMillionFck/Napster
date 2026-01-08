import React, { useState } from "react";
import { Disc, X, Repeat, Shuffle, List } from "react-feather";

export default function PlayerMenu({
  isRepeat,
  isShuffle,
  playlistOpen,
  onToggleRepeat,
  onToggleShuffle,
  onTogglePlaylist,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const actions = [
    {
      icon: <Repeat size={20} />,
      label: "Repeat",
      onClick: onToggleRepeat,
      active: isRepeat,
    },
    {
      icon: <Shuffle size={20} />,
      label: "Shuffle",
      onClick: onToggleShuffle,
      active: isShuffle,
    },
    {
      icon: <List size={20} />,
      label: "List",
      onClick: onTogglePlaylist,
      active: playlistOpen,
    },
  ];

  return (
    <div className="player-menu-container">
      {/* Overlay when open */}
      <div
        className={`radial-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Main Toggle Button */}
      <button
        className={`radial-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleOpen}
      >
        {isOpen ? <X size={24} /> : <Disc size={24} />}
      </button>

      {/* Menu Items */}
      <div className={`radial-items ${isOpen ? "open" : ""}`}>
        {actions.map((action, index) => (
          <button
            key={index}
            className="radial-item"
            onClick={() => {
              action.onClick();
              setIsOpen(false);
            }}
            style={{
              transitionDelay: `${index * 50}ms`,
              background: action.active
                ? "var(--color-swiss-orange)"
                : "var(--color-swiss-bg)",
              color: action.active
                ? "var(--color-swiss-bg)"
                : "var(--color-swiss-ink)",
            }}
            title={action.label}
          >
            {action.icon}
            <span className="radial-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
