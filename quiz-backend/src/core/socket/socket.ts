
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { QuizSocketHanlder } from '../../quiz/socket-handler';
import { IQuizSocketHanlder } from '../../quiz/types';
import { IMessageQueue } from '../queue/types';
import { IWebSocket } from './types';

type InitSocketObject = {
    server: http.Server;

}

export class SocketIOImpl implements IWebSocket {
    private io: SocketIOServer;
    private quizSocketHandler: IQuizSocketHanlder;

    constructor({ server }: InitSocketObject) {
        this.io = new SocketIOServer(server, {
            cors: {
              origin: '*',
            },
        });
        this.quizSocketHandler = new QuizSocketHanlder();
    }

    getIO = ():SocketIOServer => {
        return this.io;
    }

    setQueue = (queue: IMessageQueue) => {
        this.quizSocketHandler.setQueue?.(queue);
    }

    onConnection = () => {
        this.io.on('connection', (socket) => {
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
            this.quizSocketHandler.startQuiz(socket);
            this.quizSocketHandler.submitQuiz(socket);
            this.quizSocketHandler.getLatestLeaderBoard(socket);
        });
    }

    emitMessageToRoom = (roomId: string, event: string, data: any) => {
        this.io.to(roomId).emit(event, data);
    }
}