import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io } from "socket.io-client";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [currentStation, setCurrentStation] = useState(null);
  const [stationsList, setStationsList] = useState([]); // List of public stations
  const [stationError, setStationError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Use a ref to keep track of the socket to avoid cleanup issues
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to the backend server
    // Connect to the backend server
    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
    const newSocket = io(socketUrl);
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
      // Request initial list
      newSocket.emit("get_stations");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
      setCurrentStation(null);
      setSocket(null);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    newSocket.on("station_update", (data) => {
      console.log("Station update received:", data);
      if (data.stationState) {
        setCurrentStation((prev) => {
          return data.stationState;
        });
      }
    });

    newSocket.on("stations_list", (list) => {
      console.log("Stations list received:", list);
      setStationsList(list || []);
    });

    newSocket.on("user_joined", (data) => {
      console.log("User joined:", data);
      setCurrentStation((prev) =>
        prev ? { ...prev, listeners: [...prev.listeners, data.userId] } : prev
      );
    });

    newSocket.on("user_left", (data) => {
      console.log("User left:", data);
      setCurrentStation((prev) =>
        prev
          ? {
              ...prev,
              listeners: prev.listeners.filter((id) => id !== data.userId),
            }
          : prev
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createStation = (name) => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject("No socket connection");
      socket.emit("create_station", name, (response) => {
        if (response.success) {
          setCurrentStation(response.station);
          resolve(response.station);
        } else {
          setStationError(response.message);
          reject(response.message);
        }
      });
    });
  };

  const joinStation = (stationId) => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject("No socket connection");
      console.log("Joining station:", stationId);
      socket.emit("join_station", stationId, (response) => {
        if (response.success) {
          setCurrentStation(response.station);
          resolve(response.station);
        } else {
          setStationError(response.message);
          reject(response.message);
        }
      });
    });
  };

  const leaveStation = () => {
    if (socket && currentStation) {
      socket.emit("leave_station", currentStation.id);
      setCurrentStation(null);
    }
  };

  const emitPlayerAction = (action, payload) => {
    if (socket && currentStation) {
      socket.emit("player_action", {
        stationId: currentStation.id,
        action,
        payload,
      });
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        currentStation,
        stationsList,
        stationError,
        createStation,
        joinStation,
        leaveStation,
        emitPlayerAction,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
