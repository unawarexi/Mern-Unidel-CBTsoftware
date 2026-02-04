import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth-store";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "../core/lib/socket-client";

export const useSocket = () => {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState(getSocket());

  useEffect(() => {
    if (user) {
      const s = connectSocket(user);
      setSocket(s);
    } else {
      disconnectSocket();
      setSocket(null);
    }
  }, [user]);

  return socket;
};

export const useSocketEvent = (event, callback) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, event, callback]);
};
