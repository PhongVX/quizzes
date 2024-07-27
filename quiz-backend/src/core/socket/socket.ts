
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { QuizSocketHandler } from '../../quiz/socket-handler';
import { IQuizSocketHandler } from '../../quiz/types';
import { IMessageQueue } from '../queue/types';
import { IWebSocket } from './types';

type InitSocketObject = {
    server: http.Server;

}

export class SocketIOImpl implements IWebSocket {
    private io: SocketIOServer;
    private quizSocketHandler: IQuizSocketHandler;

    constructor({ server }: InitSocketObject) {
        this.io = new SocketIOServer(server, {
            cors: {
              origin: '*',
            },
        });
        this.quizSocketHandler = new QuizSocketHandler();
    }

    setQueue = (queue: IMessageQueue) => {
        this.quizSocketHandler.setQueue?.(queue);
    }

    onConnection = () => {
        this.io.on('connection', (socket) => {
            this.quizSocketHandler.startQuiz(socket);
            // this.quizSocketHandler.submitQuiz(socket);
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }
}