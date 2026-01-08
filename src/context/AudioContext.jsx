import React, { createContext, useContext } from "react";
import { useAudioPlayer as useAudioPlayerHook } from "../hooks/useAudioPlayer";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const audioPlayer = useAudioPlayerHook();

  return (
    <AudioContext.Provider value={audioPlayer}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioPlayerContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error(
      "useAudioPlayerContext must be used within an AudioProvider"
    );
  }
  return context;
};
