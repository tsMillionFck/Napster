import { useState, useRef, useEffect, useCallback } from "react";

const API_URL = "http://localhost:5001/api";

export function useAudioPlayer() {
  const audioRef = useRef(new Audio());
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  // Default/fallback songs from musicDi folder
  const DEFAULT_SONGS = [
    {
      name: "House of Balloon",
      artist: "The Weeknd",
      cover: "/musicDi/Image/HouseOfBallons.jpg",
      path: "/musicDi/Songs/HouseOfBalloon.mp3",
    },
    {
      name: "Dark Times",
      artist: "The Weeknd",
      cover: "/musicDi/Image/DarkTIme.jpg",
      path: "/musicDi/Songs/DarkTime.mp3",
    },
    {
      name: "Call Out My Name",
      artist: "The Weeknd",
      cover: "/musicDi/Image/calloutmyname.jpg",
      path: "/musicDi/Songs/calloutmyname.mp3",
    },
    {
      name: "So High",
      artist: "Sidhu Moosewala",
      cover: "/musicDi/Image/soHigh.jpeg",
      path: "/musicDi/Songs/SoHigh.mp3",
    },
    {
      name: "NYPD",
      artist: "Diljit Dosanjh",
      cover: "/musicDi/Image/nypd.jpeg",
      path: "/musicDi/Songs/NYPD.mp3",
    },
    {
      name: "Paapi",
      artist: "Sidhu Moosewala",
      cover: "/musicDi/Image/paapi.jpeg",
      path: "/musicDi/Songs/Paapi.mp3",
    },
  ];

  // Fetch songs from API
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`${API_URL}/songs`);
        const data = await res.json();

        if (data.length > 0) {
          // Transform API data to include full URLs
          const transformedSongs = data.map((song) => ({
            ...song,
            cover: `http://localhost:5001${song.cover}`,
            path: `http://localhost:5001${song.path}`,
          }));
          setSongs(transformedSongs);
        } else {
          // Use default songs if API is empty
          setSongs(DEFAULT_SONGS);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch songs, using defaults:", error);
        // Use default songs on error
        setSongs(DEFAULT_SONGS);
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const currentSong = songs[currentSongIndex] || {
    name: "No Songs",
    artist: "Add songs to get started",
    cover: "",
    path: "",
  };

  // Load song when index or songs change
  useEffect(() => {
    if (songs.length === 0) return;

    const audio = audioRef.current;
    audio.src = currentSong.path;
    audio.load();

    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentSongIndex, songs]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        next();
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [isRepeat, isShuffle, currentSongIndex]);

  const play = useCallback(() => {
    audioRef.current.play().catch(console.error);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    if (songs.length === 0) return;

    if (isShuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === currentSongIndex && songs.length > 1);
      setCurrentSongIndex(randomIndex);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    }
  }, [isShuffle, currentSongIndex, songs.length]);

  const prev = useCallback(() => {
    if (songs.length === 0) return;
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  }, [songs.length]);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  const selectSong = useCallback((index, autoPlay = true) => {
    setCurrentSongIndex(index);
    if (autoPlay) {
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current.play().catch(console.error);
      }, 100);
    } else {
      setIsPlaying(false);
      audioRef.current.pause();
    }
  }, []);

  const toggleRepeat = useCallback(() => setIsRepeat((prev) => !prev), []);
  const toggleShuffle = useCallback(() => setIsShuffle((prev) => !prev), []);

  // Refresh songs from API
  const refreshSongs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/songs`);
      const data = await res.json();
      const transformedSongs = data.map((song) => ({
        ...song,
        cover: `http://localhost:5001${song.cover}`,
        path: `http://localhost:5001${song.path}`,
      }));
      setSongs(transformedSongs);
    } catch (error) {
      console.error("Failed to refresh songs:", error);
    }
  }, []);

  return {
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
    togglePlay,
    next,
    prev,
    seek,
    selectSong,
    toggleRepeat,
    toggleShuffle,
    refreshSongs,
  };
}
