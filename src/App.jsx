import { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useAudioPlayerContext, AudioProvider } from "./context/AudioContext";
import HostControls from "./components/HostControls";
import { WebSocketProvider, useWebSocket } from "./context/WebSocketContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import StationManager from "./components/StationManager";
import StationSyncController from "./components/StationSyncController";
import StationsPage from "./components/StationsPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Player from "./components/Player";
import Playlist from "./components/Playlist";
import UploadModal from "./components/UploadModal";
import TitanBackground from "./components/TitanBackground";
import SparkCanvas from "./components/SparkCanvas";
import RadialMenu from "./components/RadialMenu";
import PlayerMenu from "./components/PlayerMenu";
import {
  Plus,
  List,
  Moon,
  Sun,
  Repeat,
  Shuffle,
  Radio,
  User,
  LogOut,
  LogIn,
} from "react-feather";

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
  } = useAudioPlayerContext();

  const { isConnected, currentStation, emitPlayerAction, isHost } =
    useWebSocket();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Sync logic moved to StationSyncController

  // Sync logic removed

  // Wrapper functions
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
      if (isShuffle) nextIndex = (currentSongIndex + 1) % songs.length; // Shuffle handled by backend/host effectively or simply next
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

  const togglePlaylist = useCallback(
    () => setPlaylistOpen((prev) => !prev),
    []
  );
  const handleUploadSuccess = useCallback(() => refreshSongs(), [refreshSongs]);
  const handleSpark = useCallback(() => {}, []);
  const toggleTheme = useCallback(() => setDarkMode((prev) => !prev), []);

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
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
        className="theme-toggle btn-radio desktop-only"
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
        title="Go to Stations"
      >
        <Radio size={16} />
        <span>RADIO</span>
      </button>
      {/* Auth Button - Bottom Left */}
      <button
        onClick={() => {
          if (user) {
            if (window.confirm("Log out?")) logout();
          } else {
            navigate("/login");
          }
        }}
        className="theme-toggle btn-auth desktop-only"
        style={{
          background: user ? "var(--color-swiss-ink)" : undefined,
          color: user ? "var(--color-swiss-bg)" : undefined,
          minWidth: user ? "120px" : "auto",
        }}
        title={user ? "Log Out" : "Log In"}
      >
        {user ? <LogOut size={16} /> : <LogIn size={16} />}
        <span style={{ marginLeft: "8px" }}>
          {user ? user.username : "LOGIN"}
        </span>
      </button>
      <SparkCanvas onSpark={handleSpark} />
      <TitanBackground
        songName={currentSong.name}
        artistName={currentSong.artist}
      />
      {/* Dark Focus Overlay */}
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
      {/* Theme Toggle */}
      <button
        className="theme-toggle btn-mode desktop-only"
        onClick={toggleTheme}
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        <span style={{ marginLeft: "8px" }}>MODE</span>
      </button>
      {/* Repeat Button */}
      <button
        className="theme-toggle btn-repeat desktop-only"
        onClick={toggleRepeat}
        style={{
          background: isRepeat ? "var(--color-swiss-orange)" : undefined,
          color: isRepeat ? "var(--color-swiss-bg)" : undefined,
        }}
      >
        <Repeat size={16} />
        <span style={{ marginLeft: "8px" }}>RPT</span>
      </button>
      {/* Shuffle Button */}
      <button
        className="theme-toggle btn-shuffle desktop-only"
        onClick={toggleShuffle}
        style={{
          background: isShuffle ? "var(--color-swiss-orange)" : undefined,
          color: isShuffle ? "var(--color-swiss-bg)" : undefined,
        }}
      >
        <Shuffle size={16} />
        <span style={{ marginLeft: "8px" }}>SHF</span>
      </button>
      {/* Playlist Toggle */}
      {!playlistOpen && (
        <button
          className="theme-toggle btn-list desktop-only"
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
          isReadOnly={currentStation && !isHost}
        />
      )}
      {/* Host Controls Button - Only visible if Host */}
      {currentStation &&
        isConnected &&
        currentStation.host === user?.id && ( // We need to check socket id, but WebSocketContext provides isHost.
          // Wait, socket.id available in WebSocketContext. user.id is Auth logic.
          // Let's use context "isHost" which we derived.
          // We need to destructure isHost from useWebSocket first.
          <button
            onClick={() => navigate("/station/host")}
            className="theme-toggle btn-mode desktop-only"
            style={{
              bottom: "100px", // Stack above others
              background: "var(--color-swiss-orange)",
              color: "var(--color-swiss-bg)",
              width: "auto",
              padding: "0 16px",
              right: "20px",
            }}
          >
            <Users size={16} />
            <span style={{ marginLeft: "8px" }}>HOST CTRL</span>
          </button>
        )}
      {/* Upload Button */}
      <button
        onClick={() => setUploadOpen(true)}
        className="theme-toggle btn-upload desktop-only"
      >
        <Plus size={16} />
        <span style={{ marginLeft: "8px" }}>ADD</span>
      </button>
      {/* Mobile Radial Menu (System: Left) */}
      <RadialMenu
        user={user}
        darkMode={darkMode}
        isHost={isHost && currentStation}
        onToggleTheme={toggleTheme}
        onNavigate={navigate}
        onLogout={logout}
        onUpload={() => setUploadOpen(true)}
      />
      {/* Mobile Player Menu (Player: Right) */}
      <PlayerMenu
        isRepeat={isRepeat}
        isShuffle={isShuffle}
        playlistOpen={playlistOpen}
        onToggleRepeat={toggleRepeat}
        onToggleShuffle={toggleShuffle}
        onTogglePlaylist={togglePlaylist}
      />
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
      <AuthProvider>
        <WebSocketProvider>
          <AudioProvider>
            <StationSyncController />
            <Routes>
              <Route path="/" element={<PlayerLayout />} />
              <Route path="/stations" element={<StationsPage />} />
              <Route path="/room/host" element={<HostControls />} />{" "}
              {/* Using /room/host path */}
              <Route path="/station/host" element={<HostControls />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </AudioProvider>
        </WebSocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
