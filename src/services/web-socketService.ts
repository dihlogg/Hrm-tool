"use client";

import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private readonly serverUrl =
  process.env.NEXT_PUBLIC_HRM_NOTIFY_URL || "http://localhost:3002";

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(this.serverUrl, {
        transports: ["websocket"],
      });

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server", this.socket?.id);
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("🔌 Socket disconnected");
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
