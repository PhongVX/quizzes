import { IMessageQueue } from "../queue/types"

export interface IWebSocket {
    setQueue?: (queue: IMessageQueue) => void
    onConnection: () => void
}