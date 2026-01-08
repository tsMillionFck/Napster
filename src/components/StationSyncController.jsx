import { useEffect } from "react";
import { useAudioPlayerContext } from "../context/AudioContext";
import { useWebSocket } from "../context/WebSocketContext";

export default function StationSyncController() {
  const {
    songs,
    currentSongIndex,
    isPlaying,
    progress,
    play,
    pause,
    seek,
    selectSong,
  } = useAudioPlayerContext();

  const { currentStation } = useWebSocket();

  // Sync with Station State
  useEffect(() => {
    if (currentStation && songs.length > 0) {
      console.log("Syncing with station:", currentStation);

      // Sync Song
      if (currentStation.currentSong) {
        const stationSongName = currentStation.currentSong.name;
        // Find by name - assuming names are unique enough for now
        const localIndex = songs.findIndex((s) => s.name === stationSongName);

        if (localIndex !== -1 && localIndex !== currentSongIndex) {
          console.log("Sync: Changing song to index", localIndex);
          // Select song but don't auto-play yet, let the next block handle play/pause
          selectSong(localIndex, false);
        }
      }

      // Sync Play/Pause
      if (currentStation.isPlaying !== isPlaying) {
        console.log(
          `Sync: Switching play state to ${currentStation.isPlaying}`
        );
        if (currentStation.isPlaying) play();
        else pause();
      }

      // Sync Timestamp (Only when paused, to avoid loop with static server timestamp)
      // The server timestamp is "last seek/pause time", not "current live time".
      if (
        !currentStation.isPlaying &&
        Math.abs(currentStation.timestamp - progress) > 0.5
      ) {
        console.log(`Sync: Adjusting timestamp to ${currentStation.timestamp}`);
        seek(currentStation.timestamp);
      }
    }
  }, [
    currentStation,
    songs,
    currentSongIndex,
    isPlaying,
    // progress, - purposefully excluded to avoid loop, see original logic
    selectSong,
    play,
    pause,
    seek,
  ]);

  return null;
}
