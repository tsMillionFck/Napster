import React, { useState } from "react";
import {
  Plus,
  Moon,
  Sun,
  Radio,
  LogOut,
  LogIn,
  Menu,
  X,
  Users,
} from "react-feather";

// This component is now the "System Menu" (Top-Left)
export default function RadialMenu({
  user,
  darkMode,
  isHost,
  onToggleTheme,
  onNavigate,
  onLogout,
  onUpload,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const actions = [
    {
      icon: <Radio size={20} />,
      label: "Radio",
      onClick: () => onNavigate("/stations"),
      active: false,
    },
    {
      icon: <Users size={20} />,
      label: "Host",
      onClick: () => onNavigate("/station/host"),
      active: false,
      hidden: !isHost,
    },
    {
      icon: user ? <LogOut size={20} /> : <LogIn size={20} />,
      label: user ? "Logout" : "Login",
      onClick: () => {
        if (user) {
          if (window.confirm("Log out?")) onLogout();
        } else {
          onNavigate("/login");
        }
      },
      active: !!user,
    },
    {
      icon: darkMode ? <Sun size={20} /> : <Moon size={20} />,
      label: "Theme",
      onClick: onToggleTheme,
      active: false,
    },
    {
      icon: <Plus size={20} />,
      label: "Upload",
      onClick: onUpload,
      active: false,
    },
  ];

  return (
    <div className="radial-menu-container">
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
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu Items */}
      <div className={`radial-items ${isOpen ? "open" : ""}`}>
        {actions
          .filter((action) => !action.hidden)
          .map((action, index) => {
            // Calculate position on a circle arc
            // We want an arc from roughly -90deg (top) to 0deg (right) or similar,
            // but since button is bottom-right, we want arc from top to left.
            // Let's stack them vertically for now as a "Speed Dial" which is safer for mobile width
            // Or actually, let's do a true radial if we can.
            // Let's do a vertical stack popping up from the button, it's cleaner on small screens.

            return (
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
            );
          })}
      </div>
    </div>
  );
}
