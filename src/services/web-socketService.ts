"use client";
import { io, Socket } from "socket.io-client";
import { EventEmitter } from "events";

class SocketService extends EventEmitter {
  private socket: Socket | null = null;
  private readonly serverUrl = process.env.NEXT_PUBLIC_SOCKET_BASE_URL;
  private isConnecting: boolean = false;

  connect(token: string, employeeId: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      if (this.isConnecting) {
        // Đang kết nối, chờ kết nối hoàn tất
        this.once("connected", () => resolve(this.socket!));
        this.once("connection_error", reject);
        return;
      }

      this.isConnecting = true;

      // Socket.io treats the path in the URL as a "namespace". If NEXT_PUBLIC_SOCKET_BASE_URL
      // is "https://api.ltdhrm.me/hrm-notify", it tries to connect to the "/hrm-notify" namespace and fails.
      // We must extract only the origin (https://api.ltdhrm.me) to connect to the root namespace,
      // and let the 'path' option handle the routing through the gateway.
      const urlObj = new URL(this.serverUrl || "http://localhost:3002");
      const rootUrl = `${urlObj.protocol}//${urlObj.host}`;
      
      this.socket = io(rootUrl, {
        path: "/hrm-notify/socket.io",
        auth: { token, employeeId },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
      });

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server", this.socket?.id);
        this.isConnecting = false;
        this.emit("connected", this.socket);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from WebSocket server:", reason);
        this.emit("disconnected", reason);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        this.isConnecting = false;
        this.emit("connection_error", error);
        reject(error);
      });

      // Resolve khi kết nối thành công
      this.socket.once("connect", () => {
        resolve(this.socket!);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
      console.log("Socket disconnected");
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
