import { v4 as uuidv4 } from "uuid";

const stations = {}; // { stationId: { id, name, currentSong, isPlaying, timestamp, listeners: [], host: uuid } }

export default function stationHandler(io, socket) {
  console.log(`User connected: ${socket.id}`);

  const broadcastList = () => {
    const list = Object.values(stations).map((s) => ({
      id: s.id,
      name: s.name,
      listenersCount: s.listeners.length,
      currentSong: s.currentSong ? s.currentSong.name : "Idle",
      isPlaying: s.isPlaying,
    }));
    io.emit("stations_list", list);
  };

  // Get active stations
  socket.on("get_stations", () => {
    const list = Object.values(stations).map((s) => ({
      id: s.id,
      name: s.name,
      listenersCount: s.listeners.length,
      currentSong: s.currentSong ? s.currentSong.name : "Idle",
      isPlaying: s.isPlaying,
    }));
    socket.emit("stations_list", list);
  });

  // Create a new station
  socket.on("create_station", (stationName, callback) => {
    const stationId = uuidv4();
    stations[stationId] = {
      id: stationId,
      name: stationName || `Station ${stationId.slice(0, 4)}`,
      currentSong: null,
      isPlaying: false,
      timestamp: 0,
      listeners: [],
      host: socket.id,
    };

    socket.join(stationId);
    stations[stationId].listeners.push(socket.id);

    console.log(`Station created: ${stationId} by ${socket.id}`);

    if (callback)
      callback({ success: true, stationId, station: stations[stationId] });

    broadcastList();
  });

  // Join an existing station
  socket.on("join_station", (stationId, callback) => {
    const station = stations[stationId];
    if (station) {
      socket.join(stationId);
      if (!station.listeners.includes(socket.id)) {
        station.listeners.push(socket.id);
      }

      console.log(`User ${socket.id} joined station ${stationId}`);

      // Notify others in room
      socket.to(stationId).emit("user_joined", {
        userId: socket.id,
        count: station.listeners.length,
      });

      // Notify everyone of list update (listener count changed)
      broadcastList();

      if (callback) callback({ success: true, station });
    } else {
      if (callback) callback({ success: false, message: "Station not found" });
    }
  });

  // Leave station
  socket.on("leave_station", (stationId) => {
    const station = stations[stationId];
    if (station) {
      socket.leave(stationId);
      station.listeners = station.listeners.filter((id) => id !== socket.id);

      console.log(`User ${socket.id} left station ${stationId}`);

      if (station.listeners.length === 0) {
        delete stations[stationId];
        console.log(`Station ${stationId} deleted (empty)`);
      } else {
        socket.to(stationId).emit("user_left", {
          userId: socket.id,
          count: station.listeners.length,
        });

        // If host left, assign new host
        if (station.host === socket.id) {
          station.host = station.listeners[0];
          io.to(stationId).emit("host_changed", { newHost: station.host });
        }
      }
      broadcastList();
    }
  });

  // Sync Player Actions
  socket.on("player_action", ({ stationId, action, payload }) => {
    const station = stations[stationId];
    if (!station) return;

    console.log(`Action in ${stationId}: ${action}`, payload);

    switch (action) {
      case "play":
        station.isPlaying = true;
        station.currentSong = payload.song || station.currentSong;
        break;
      case "pause":
        station.isPlaying = false;
        break;
      case "seek":
        station.timestamp = payload.time;
        break;
      case "change_song":
        station.currentSong = payload.song;
        station.isPlaying = true;
        station.timestamp = 0;
        break;
    }

    socket.to(stationId).emit("station_update", {
      type: action,
      ...payload,
      stationState: station,
    });

    // If song changed or play state, update list (optional, but good for preview)
    if (action === "change_song" || action === "play" || action === "pause") {
      broadcastList();
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    let updated = false;
    for (const [id, station] of Object.entries(stations)) {
      if (station.listeners.includes(socket.id)) {
        station.listeners = station.listeners.filter(
          (uid) => uid !== socket.id
        );
        socket.to(id).emit("user_left", {
          userId: socket.id,
          count: station.listeners.length,
        });
        if (station.listeners.length === 0) {
          delete stations[id];
        } else if (station.host === socket.id) {
          station.host = station.listeners[0];
          io.to(id).emit("host_changed", { newHost: station.host });
        }
        updated = true;
      }
    }
    if (updated) broadcastList();
  });
}
