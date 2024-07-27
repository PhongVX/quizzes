import RabbitMQ from 'amqplib';
import { IQuizQueueHandler, StartQuizMessage } from "./types";
import { QueueEvents } from '../common/types';
import { IWebSocket } from '../core/socket/types';
import { IQuizService } from './service';


export class QuizQueueHandler implements IQuizQueueHandler{
    private channel: RabbitMQ.Channel | undefined;
    private socket: IWebSocket | undefined;
    private quizService: IQuizService;
    constructor(quizService: IQuizService, channel?: RabbitMQ.Channel) {
        this.channel = channel;
        this.quizService = quizService;
    }

    setSocket = (socket: IWebSocket) => {
        this.socket = socket;
    }

    setChannel = (channel: RabbitMQ.Channel ) => {
        this.channel = channel;
    }

    consumeStartQuiz = () => {
        try {
            if (!this.channel) {
              throw new Error('Channel is not initialized');
            }
            this.channel.assertQueue(QueueEvents.StartQuiz, { durable: true });
            this.channel?.consume(QueueEvents.StartQuiz, async(msg) => {
                if (msg !== null) {
                    const message = msg.content.toString();
                    console.log(`Received: ${message}`);
                    const startQuizMessage = JSON.parse(message) as StartQuizMessage;
                    console.log('startQuizMessage', startQuizMessage);

                    let startQuizResult = await this.quizService.startQuiz(startQuizMessage);
                    if (startQuizResult) {
                        this.channel?.ack(msg);
                    }
                }
            });
        } catch (err) {
            throw err;
        }
    }

    consumeSubmitQuiz = () => {
        try {
            if (!this.channel) {
              throw new Error('Channel is not initialized');
            }
            this.channel.assertQueue(QueueEvents.SubmitQuiz, { durable: true });
            this.channel?.consume(QueueEvents.SubmitQuiz, (msg) => {
                if (msg !== null) {
                    const message = msg.content.toString();
                    console.log(`Received: ${message}`);
                    this.channel?.ack(msg);
                }
            });  
        } catch (err) {
            throw err;
        }
    }
}