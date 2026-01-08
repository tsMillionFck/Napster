import { useState, useRef } from "react";
import { X, Upload } from "react-feather";

const API_URL = "http://localhost:5001/api";

export default function UploadModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !artist || !audioFile || !coverFile) {
      setError("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("artist", artist);
    formData.append("audio", audioFile);
    formData.append("cover", coverFile);

    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/songs`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      setName("");
      setArtist("");
      setAudioFile(null);
      setCoverFile(null);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: "100%",
    border: "4px solid var(--color-swiss-ink)",
    padding: "12px 16px",
    background: "var(--color-swiss-bg)",
    color: "var(--color-swiss-ink)",
    fontSize: "1rem",
    fontWeight: 700,
    textTransform: "uppercase",
  };

  const buttonStyle = {
    ...inputStyle,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.1s ease",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "var(--color-swiss-bg)",
          border: "4px solid var(--color-swiss-ink)",
          boxShadow: "12px 12px 0px var(--color-swiss-ink)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "4px solid var(--color-swiss-ink)",
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
                margin: 0,
                fontWeight: 900,
                fontSize: "1.5rem",
                textTransform: "uppercase",
                color: "var(--color-swiss-ink)",
              }}
            >
              UPLOAD
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-swiss-ink)",
            }}
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {error && (
            <div
              style={{
                background: "var(--color-swiss-orange)",
                color: "white",
                padding: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {error}
            </div>
          )}

          {/* Song Name */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "8px",
                fontSize: "0.875rem",
                color: "var(--color-swiss-ink)",
              }}
            >
              Song Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              placeholder="ENTER NAME"
            />
          </div>

          {/* Artist */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "8px",
                fontSize: "0.875rem",
                color: "var(--color-swiss-ink)",
              }}
            >
              Artist
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              style={inputStyle}
              placeholder="ENTER ARTIST"
            />
          </div>

          {/* Audio File */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "8px",
                fontSize: "0.875rem",
                color: "var(--color-swiss-ink)",
              }}
            >
              Audio (MP3)
            </label>
            <input
              ref={audioInputRef}
              type="file"
              accept=".mp3,audio/mpeg"
              onChange={(e) => setAudioFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() => audioInputRef.current?.click()}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-swiss-ink)";
                e.currentTarget.style.color = "var(--color-swiss-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-swiss-bg)";
                e.currentTarget.style.color = "var(--color-swiss-ink)";
              }}
            >
              {audioFile ? audioFile.name : "CHOOSE FILE..."}
            </button>
          </div>

          {/* Cover Image */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "8px",
                fontSize: "0.875rem",
                color: "var(--color-swiss-ink)",
              }}
            >
              Cover Image
            </label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-swiss-ink)";
                e.currentTarget.style.color = "var(--color-swiss-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-swiss-bg)";
                e.currentTarget.style.color = "var(--color-swiss-ink)";
              }}
            >
              {coverFile ? coverFile.name : "CHOOSE IMAGE..."}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            style={{
              width: "100%",
              padding: "16px",
              background: "var(--color-swiss-ink)",
              color: "var(--color-swiss-bg)",
              border: "none",
              fontWeight: 900,
              fontSize: "1rem",
              textTransform: "uppercase",
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background 0.1s ease",
            }}
            onMouseEnter={(e) => {
              if (!uploading)
                e.currentTarget.style.background = "var(--color-swiss-orange)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-swiss-ink)";
            }}
          >
            <Upload size={20} />
            {uploading ? "UPLOADING..." : "UPLOAD"}
          </button>
        </form>
      </div>
    </div>
  );
}
