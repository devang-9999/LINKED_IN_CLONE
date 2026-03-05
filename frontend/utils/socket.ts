import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      autoConnect: false,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.log("⚠️ Socket error:", err.message);
    });
  }

  return socket;
};