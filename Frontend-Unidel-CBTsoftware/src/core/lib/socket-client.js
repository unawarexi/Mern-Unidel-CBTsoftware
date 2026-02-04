import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
  "http://localhost:3000";

let socket;

export const connectSocket = (user) => {
  if (socket?.connected && socket.auth?.userId === (user?.id || user?._id)) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  const userId = user?.id || user?._id;

  if (!userId) return null;

  socket = io(SOCKET_URL, {
    query: {
      userId,
      role: user?.role,
    },
    auth: {
      userId,
      role: user?.role,
    },
    withCredentials: true,
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect error:", err);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
