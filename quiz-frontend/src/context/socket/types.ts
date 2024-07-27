import { ReactNode } from 'react';
import { Socket } from 'socket.io-client';

export type ISocketContext = {
    socket: Socket | null;
}

export type SocketProviderProps = {
    children: ReactNode;
}