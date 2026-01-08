import { useRef, useEffect } from "react";

export default function TitanBackground({ songName, artistName }) {
  const line1aRef = useRef(null);
  const line1bRef = useRef(null);
  const line2aRef = useRef(null);
  const line2bRef = useRef(null);
  const line3aRef = useRef(null);
  const line3bRef = useRef(null);

  // Update text content via refs to avoid re-rendering animated elements
  useEffect(() => {
    const songText = songName
      ? `${songName.toUpperCase()} • `.repeat(15)
      : "NOW PLAYING • ".repeat(15);
    const artistText = artistName
      ? `${artistName.toUpperCase()} • `.repeat(15)
      : "MUSIC PLAYER • ".repeat(15);

    // Update both copies of each line
    if (line1aRef.current) line1aRef.current.textContent = songText;
    if (line1bRef.current) line1bRef.current.textContent = songText;
    if (line2aRef.current) line2aRef.current.textContent = artistText;
    if (line2bRef.current) line2bRef.current.textContent = artistText;
    if (line3aRef.current) line3aRef.current.textContent = songText;
    if (line3bRef.current) line3bRef.current.textContent = songText;
  }, [songName, artistName]);

  // Initial text
  const initialSongText = "NOW PLAYING • ".repeat(15);
  const initialArtistText = "MUSIC PLAYER • ".repeat(15);

  return (
    <div className="titan-stack">
      {/* Line 1 - Song Name */}
      <div className="titan-line-container">
        <div className="titan-text-wrapper scroll-left">
          <span ref={line1aRef} className="titan-text">
            {initialSongText}
          </span>
          <span ref={line1bRef} className="titan-text">
            {initialSongText}
          </span>
        </div>
      </div>

      {/* Line 2 - Artist Name (Orange) */}
      <div className="titan-line-container">
        <div className="titan-text-wrapper scroll-right">
          <span ref={line2aRef} className="titan-text highlight">
            {initialArtistText}
          </span>
          <span ref={line2bRef} className="titan-text highlight">
            {initialArtistText}
          </span>
        </div>
      </div>

      {/* Line 3 - Song Name again */}
      <div className="titan-line-container">
        <div className="titan-text-wrapper scroll-left">
          <span ref={line3aRef} className="titan-text">
            {initialSongText}
          </span>
          <span ref={line3bRef} className="titan-text">
            {initialSongText}
          </span>
        </div>
      </div>
    </div>
  );
}
