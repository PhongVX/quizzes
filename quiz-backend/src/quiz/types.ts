import RabbitMQ from 'amqplib';
import { Socket } from 'socket.io';
import { IMessageQueue } from '../core/queue/types';

export interface IQuizSocketHandler {
    setQueue?: (queue: IMessageQueue) => void
    startQuiz: (socket: Socket) => void
}

export interface IQuizQueueHandler {
    consumeStartQuiz: () => void
    setChannel: (channel: RabbitMQ.Channel) => void
}

export interface IQuizRepository {
    startQuiz: (data: StartQuizParams) => Promise<boolean>,
}

export type StartQuizMessage = {
    quizId: string, 
    userId?: string,
    username: string
}

export type StartQuizParams = {
    quizId: string, 
    username: string
}

export type StartQuizDBObject = {
    quiz_id: string,
    username: string,
    start_time: string,
    end_time: string
}