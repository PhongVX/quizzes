import { Socket } from 'socket.io';
import { IQuizSocketHanlder, StartQuizParams, SubmitQuizParams } from "./types";
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
            if (this.queue) {
                this.queue.sendMessageToQueue(QueueEvents.StartQuiz, JSON.stringify(msg));
            } 
        });
    }

    continueQuiz = (socket: Socket) => {
        socket.on(SocketEvents.ContinueQuiz, (msg: StartQuizParams) => {
            console.log('Re-join')
            socket.join(`${msg.quizId}_${msg.username}`);
        });
    }

    submitQuiz = (socket: Socket) => {
        socket.on(SocketEvents.SubmitQuiz, (msg: SubmitQuizParams) => {
            if (this.queue) {
                this.queue.sendMessageToQueue(QueueEvents.SubmitQuiz, JSON.stringify(msg));
            } 
        });
    }
}