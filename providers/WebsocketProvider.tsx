import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getBaseUrl } from '../api';
import { useAuth } from '../providers/AuthProvider';
import { Platform } from 'react-native';

const getSocket = (namespace: string): Socket => {
  return io(`${getBaseUrl()}/${namespace}`, {
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    forceNew: true,
  });
};

interface IWebsocketContext {
  socket: Socket | null;
  isConnected: boolean;
  socketId: string | null;
}

const WebsocketContext = createContext<IWebsocketContext>({
  socket: null,
  isConnected: false,
  socketId: null,
});

const WebsocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        //const s = getSocket('price-feed');
        const s = getSocket('quote');
        setSocket(s);

        s.on('connect', () => {
          console.log('[WS] Connected with ID:', Platform.OS , s.id);
          setIsConnected(true);
          setSocketId(s.id || null);
        });

        s.on('connect_error', (err) => {
          console.error('[WS] Connection error:', err.message);
          setIsConnected(false);
          setSocketId(null);
        });

        s.on('disconnect', () => {
          console.log('[WS] Disconnected');
          setIsConnected(false);
          setSocketId(null);
        });

        return () => {
          console.log('[WS] Clean up');
          s.removeAllListeners();
          s.disconnect();
        };

      } catch (error) {
        console.error('[WS] Failed to connect socket error:', error);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (socket) {
        console.log('[WS] Disconnecting socket after unmount');
        socket.disconnect();
      }
    };
  }, []);

  return (
    <WebsocketContext.Provider value={{ socket, isConnected, socketId }}>
      {children}
    </WebsocketContext.Provider>
  );
};

const useWebsocket = () => {
  const context = useContext(WebsocketContext);
  if (!context?.socket) {
    throw new Error('useWebsocket must be used within WebsocketProvider after socket connects');
  }
  return context;
};

const useSocket = (namespace: string): Socket => {
  if (!namespace) throw new Error('Namespace required');
  return getSocket(namespace);
};

export { WebsocketProvider, useWebsocket, useSocket };
