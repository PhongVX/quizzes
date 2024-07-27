import RabbitMQ from 'amqplib';
import { IWebSocket } from '../socket/types';

export interface IMessageQueue {
    getChannel: () => RabbitMQ.Channel | undefined 
    setWebSocket?: (webSocket: IWebSocket) => void
    connect: () => Promise<this>
    sendMessageToQueue: (queue: string, message: string) => void
    consumeMessage: () => void
}