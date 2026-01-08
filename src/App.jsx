import { useState, useCallback, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { WebSocketProvider, useWebSocket } from "./context/WebSocketContext";
import StationManager from "./components/StationManager";
import StationsPage from "./components/StationsPage";
import Player from "./components/Player";
import Playlist from "./components/Playlist";
import UploadModal from "./components/UploadModal";
import TitanBackground from "./components/TitanBackground";
import SparkCanvas from "./components/SparkCanvas";
import { Plus, List, Moon, Sun, Repeat, Shuffle, Radio } from "react-feather";

function PlayerLayout() {
  const {
    currentSong,
    currentSongIndex,
    isPlaying,
    isRepeat,
    isShuffle,
    progress,
    duration,
    songs,
    loading,
    play,
    pause,
    togglePlay: localTogglePlay,
    next: localNext,
    prev: localPrev,
    seek: localSeek,
    selectSong: localSelectSong,
    refreshSongs,
    toggleRepeat,
    toggleShuffle,
  } = useAudioPlayer();

  const { isConnected, currentStation, emitPlayerAction } = useWebSocket();
  const navigate = useNavigate();

  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Sync with Station State
  useEffect(() => {
    if (currentStation && songs.length > 0) {
      console.log("Syncing with station:", currentStation);

      // Sync Song
      if (currentStation.currentSong) {
        // Find index of station song in local songs
        // Assuming unique names or paths for simplicity
        const stationSongName = currentStation.currentSong.name;
        const localIndex = songs.findIndex((s) => s.name === stationSongName);

        if (localIndex !== -1 && localIndex !== currentSongIndex) {
          console.log("Sync: Changing song to", stationSongName);
          localSelectSong(localIndex);
        }
      }

      // Sync Play/Pause
      if (currentStation.isPlaying !== isPlaying) {
        console.log("Sync: Toggle play", currentStation.isPlaying);
        if (currentStation.isPlaying) play();
        else pause();
      }

      // Sync Timestamp (if drift > 2s)
      // Only sync provided timestamp if it's not 0 or if we are just joining/seeking
      if (Math.abs(currentStation.timestamp - progress) > 2) {
        console.log("Sync: Seeking to", currentStation.timestamp);
        localSeek(currentStation.timestamp);
      }
    }
  }, [
    currentStation,
    songs,
    currentSongIndex,
    isPlaying,
    progress,
    localSelectSong,
    play,
    pause,
    localSeek,
  ]);

  // Wrapper functions to intercept controls
  const handleTogglePlay = useCallback(() => {
    if (currentStation) {
      emitPlayerAction(isPlaying ? "pause" : "play", {
        song: currentSong,
        time: progress,
      });
    } else {
      localTogglePlay();
    }
  }, [
    currentStation,
    isPlaying,
    currentSong,
    progress,
    emitPlayerAction,
    localTogglePlay,
  ]);

  const handleNext = useCallback(() => {
    if (currentStation) {
      let nextIndex = (currentSongIndex + 1) % songs.length;
      if (isShuffle) {
        nextIndex = (currentSongIndex + 1) % songs.length;
      }
      const nextSong = songs[nextIndex];
      emitPlayerAction("change_song", { song: nextSong });
    } else {
      localNext();
    }
  }, [
    currentStation,
    currentSongIndex,
    songs,
    isShuffle,
    emitPlayerAction,
    localNext,
  ]);

  const handlePrev = useCallback(() => {
    if (currentStation) {
      const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      const prevSong = songs[prevIndex];
      emitPlayerAction("change_song", { song: prevSong });
    } else {
      localPrev();
    }
  }, [currentStation, currentSongIndex, songs, emitPlayerAction, localPrev]);

  const handleSeek = useCallback(
    (time) => {
      if (currentStation) {
        emitPlayerAction("seek", { time });
        localSeek(time);
      } else {
        localSeek(time);
      }
    },
    [currentStation, emitPlayerAction, localSeek]
  );

  // Toggle playlist
  const togglePlaylist = useCallback(() => {
    setPlaylistOpen((prev) => !prev);
  }, []);

  // Handle upload success
  const handleUploadSuccess = useCallback(() => {
    refreshSongs();
  }, [refreshSongs]);

  // Handle spark click - just visual effect, no freeze
  const handleSpark = useCallback(() => {
    // Sparks appear but no freeze
  }, []);

  // Toggle dark mode
  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-swiss-bg)" }}
      >
        <div className="text-center">
          <div
            className="font-black text-4xl uppercase tracking-tighter"
            style={{ color: "var(--color-swiss-ink)" }}
          >
            LOADING
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <StationManager />

      {/* Navigation Button to Stations */}
      <button
        onClick={() => navigate("/stations")}
        className="theme-toggle"
        style={{
          top: "240px",
          right: "30px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        title="Go to Stations"
      >
        <Radio size={16} />
        <span>RADIO</span>
      </button>

      <SparkCanvas onSpark={handleSpark} />
      <TitanBackground
        songName={currentSong.name}
        artistName={currentSong.artist}
      />

      {/* Dark Focus Overlay - dims background when playing */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.7)",
          zIndex: 5,
          pointerEvents: "none",
          opacity: isPlaying ? 1 : 0,
          transition: isPlaying
            ? "opacity 8s ease-in-out"
            : "opacity 2s ease-out",
        }}
      />

      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        <span style={{ marginLeft: "8px" }}>MODE</span>
      </button>

      {/* Repeat Button - Below Mode */}
      <button
        className="theme-toggle"
        onClick={toggleRepeat}
        style={{
          top: "100px",
          background: isRepeat ? "var(--color-swiss-orange)" : undefined,
          color: isRepeat ? "var(--color-swiss-bg)" : undefined,
        }}
      >
        <Repeat size={16} />
        <span style={{ marginLeft: "8px" }}>RPT</span>
      </button>

      {/* Shuffle Button - Below Repeat */}
      <button
        className="theme-toggle"
        onClick={toggleShuffle}
        style={{
          top: "170px",
          background: isShuffle ? "var(--color-swiss-orange)" : undefined,
          color: isShuffle ? "var(--color-swiss-bg)" : undefined,
        }}
      >
        <Shuffle size={16} />
        <span style={{ marginLeft: "8px" }}>SHF</span>
      </button>

      {/* Playlist Toggle - Top Left (hidden when playlist is open) */}
      {!playlistOpen && (
        <button
          className="theme-toggle"
          style={{ left: "30px", right: "auto" }}
          onClick={togglePlaylist}
        >
          <List size={16} />
          <span style={{ marginLeft: "8px" }}>LIST</span>
        </button>
      )}

      {songs.length === 0 ? (
        <div className="player-card">
          <div
            className="info"
            style={{
              borderBottom: "none",
              textAlign: "center",
              padding: "60px 24px",
            }}
          >
            <h1 className="song-title">
              NO
              <br />
              SONGS
            </h1>
            <div
              className="artist-row"
              style={{ justifyContent: "center", marginTop: "24px" }}
            >
              <button
                onClick={() => setUploadOpen(true)}
                className="btn btn-play"
                style={{
                  padding: "16px 32px",
                  border: "4px solid var(--color-swiss-ink)",
                }}
              >
                <Plus size={24} style={{ marginRight: "8px" }} />
                ADD SONG
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Player
          song={currentSong}
          isPlaying={isPlaying}
          progress={progress}
          duration={duration}
          onTogglePlay={handleTogglePlay}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeek={handleSeek}
        />
      )}

      {/* Upload Button - Bottom Right */}
      <button
        onClick={() => setUploadOpen(true)}
        className="theme-toggle"
        style={{ top: "auto", bottom: "30px" }}
        aria-label="Upload Song"
      >
        <Plus size={16} />
        <span style={{ marginLeft: "8px" }}>ADD</span>
      </button>

      <Playlist
        songs={songs}
        currentSongIndex={currentSongIndex}
        isOpen={playlistOpen}
        onSelectSong={(index) => {
          if (currentStation) {
            const song = songs[index];
            emitPlayerAction("change_song", { song });
          } else {
            localSelectSong(index);
          }
        }}
        onClose={() => setPlaylistOpen(false)}
      />

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <WebSocketProvider>
        <Routes>
          <Route path="/" element={<PlayerLayout />} />
          <Route path="/stations" element={<StationsPage />} />
        </Routes>
      </WebSocketProvider>
    </BrowserRouter>
  );
}

export default App;
