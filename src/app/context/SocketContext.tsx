import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { serverApi } from "../../lib/config";

export const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Create socket connection
    const newSocket = io(serverApi, {
      withCredentials: true,
      transports: ["websocket", "polling"], // Try websocket first, fallback to polling
      autoConnect: true,
    });

    // Connection event handlers for debugging
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log("Closing socket connection");
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
