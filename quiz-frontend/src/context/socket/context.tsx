import { createContext } from 'react';
import { ISocketContext } from './types';

export const SocketContext = createContext<ISocketContext | undefined>(undefined);




