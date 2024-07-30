import { Socket } from 'socket.io';
import { IQuizSocketHanlder, StartQuizParams, QuizParams } from "./types";
import { QueueEvents, SocketEvents } from '../common/types';
import { IMessageQueue } from '../core/queue/types';


export class QuizSocketHanlder implements IQuizSocketHanlder {
    private queue: IMessageQueue | undefined;
    constructor() {}

    setQueue = (queue: IMessageQueue) => {
        this.queue = queue;
    }

    startQuiz = (socket: Socket) => {
        socket.on(SocketEvents.StartQuiz, (msg: StartQuizParams) => {
            socket.join(`${msg.quizId}_${msg.username}`);
            socket.join(`${msg.quizId}`);
            if (this.queue) {
                this.queue.sendMessageToQueue(QueueEvents.StartQuiz, JSON.stringify(msg));
            } 
        });
    }

    continueQuiz = (socket: Socket) => {
        socket.on(SocketEvents.ContinueQuiz, (msg: StartQuizParams) => {
            socket.join(`${msg.quizId}_${msg.username}`);
            socket.join(`${msg.quizId}`);
            if (this.queue) {
                this.queue.sendMessageToQueue(QueueEvents.StartQuiz, JSON.stringify(msg));
            } 
        });
    }

    submitQuiz = (socket: Socket) => {
        socket.on(SocketEvents.SubmitQuiz, (msg: QuizParams) => {
            if (this.queue) {
                this.queue.sendMessageToQueue(QueueEvents.SubmitQuiz, JSON.stringify(msg));
            } 
        });
    }
}