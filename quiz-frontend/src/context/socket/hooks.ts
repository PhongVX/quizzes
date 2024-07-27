import { useContext } from "react";

import { SocketContext } from "./context";
import { ISocketContext } from "./types";


export const useSocket = (): ISocketContext => {
    const context = useContext(SocketContext);
    if (!context) {
      throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
  