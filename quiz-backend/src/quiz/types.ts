import RabbitMQ from 'amqplib';
import { Socket } from 'socket.io';
import { IMessageQueue } from '../core/queue/types';
import { IWebSocket } from '../core/socket/types';

export interface IQuizSocketHanlder {
    setQueue?: (queue: IMessageQueue) => void
    startQuiz: (socket: Socket) => void
    submitQuiz: (socket: Socket) => void
    continueQuiz: (socket: Socket) => void
}

export interface IQuizQueueHandler {
    consumeStartQuiz: () => void
    consumeSubmitQuiz: () => void
    setSocket: (socket: IWebSocket) => void
    setChannel: (channel: RabbitMQ.Channel) => void
}

export interface IQuizRepository {
    startQuiz: (data: StartQuizParams) => Promise<boolean>
    submitQuiz: (data: SubmitQuizParams) => Promise<boolean>
    findListQuestionByQuizId: (quizId: string) => Promise<any>
    findQuizSubmissionByUsernameAndQuizId: (data: SubmitQuizParams) => Promise<any>
}


export type StartQuizParams = {
    quizId: string, 
    username: string
}

export type SubmitQuizParams = {
    username: string,
    quizId: string,
    listAnswer: Record<string, string>;
    score?: number
    numberOfCorrectAnswers?: number,
    numberOfQuestions?: number
}

export type StartQuizDBObject = {
    quiz_id: string,
    username: string,
    start_time: string,
    end_time: string
}