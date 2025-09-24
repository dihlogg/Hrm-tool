"use client";

import { socketService } from "@/services/web-socketService";
import { useEffect, useState } from "react";

export function useSocket() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socketService.disconnect(); // cleanup
    };
  }, []);

  return { socket: socketService.getSocket(), connected };
}
