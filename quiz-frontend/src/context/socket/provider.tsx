import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { SocketContext } from './context';
import { SocketProviderProps } from './types';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
  
    useEffect(() => {
      const socketIo = io(process.env.API_URL || 'http://localhost:8080');
      setSocket(socketIo);
  
      return () => {
        socketIo.disconnect();
      };
    }, []);
  
    return (
      <SocketContext.Provider value={{ socket }}>
        {children}
      </SocketContext.Provider>
    );
};