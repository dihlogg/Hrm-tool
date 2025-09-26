"use client";
import { useEffect, useState } from "react";
import { socketService } from "@/services/web-socketService";
import { Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(socketService.getSocket());
  const [connected, setConnected] = useState(socketService.isConnected());

  useEffect(() => {
    const handleConnected = (socketInstance: Socket) => {
      setSocket(socketInstance);
      setConnected(true);
    };

    const handleDisconnected = () => {
      setConnected(false);
    };

    // Subscribe to socket events
    socketService.on('connected', handleConnected);
    socketService.on('disconnected', handleDisconnected);

    if (socketService.getSocket() && !socket) {
      setSocket(socketService.getSocket());
      setConnected(socketService.isConnected());
    }

    return () => {
      socketService.off('connected', handleConnected);
      socketService.off('disconnected', handleDisconnected);
    };
  }, []);

  return { socket, connected };
}