import { Server as SocketIOServer } from 'socket.io';
import { IMessageQueue } from "../queue/types"

export interface IWebSocket {
    getIO: () => SocketIOServer
    setQueue?: (queue: IMessageQueue) => void
    onConnection: () => void
    emitMessageToRoom: (roomId: string, message: string, data: any)  => void
}

export enum EmiterType {
    QuizSocketEmiter = 'QuizSocketEmiter'
}

export type EmitData = {
    type: EmiterType,
    data: any
}