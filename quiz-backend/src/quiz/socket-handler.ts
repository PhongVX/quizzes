import { Socket } from 'socket.io';
import { IQuizSocketHandler, StartQuizMessage } from "./types";
import { QueueEvents, SocketEvents } from '../common/types';
import { IMessageQueue } from '../core/queue/types';


export class QuizSocketHandler implements IQuizSocketHandler {
    private queue: IMessageQueue | undefined;
    constructor() {}

    setQueue = (queue: IMessageQueue) => {
        this.queue = queue;
    }

    startQuiz = (socket: Socket) => {
        socket.on(SocketEvents.StartQuiz, (msg: StartQuizMessage) => {
            console.log('message: ', msg);
            if (this.queue) {
                this.queue.sendMessageToQueue(QueueEvents.StartQuiz, JSON.stringify(msg));
            } 
        });
    }

    static submitQuiz = (socket: Socket) => {
        socket.on(SocketEvents.SubmitQuiz, (msg: any) => {
            console.log('message: ' + msg);
            // sendMessageToQueue(QUEUE, msg);
        });
    }
}