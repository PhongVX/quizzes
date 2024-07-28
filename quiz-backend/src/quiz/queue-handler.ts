import RabbitMQ from 'amqplib';
import { IQuizQueueHandler, StartQuizParams, SubmitQuizParams } from "./types";
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
                    const startQuizMessage = JSON.parse(message) as StartQuizParams;
                    const startQuizResult = await this.quizService.startQuiz(startQuizMessage);
                    if (startQuizResult) {
                        this.quizService.startQuizConfirmed(this.socket, startQuizMessage);
                        this.channel?.ack(msg);
                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    
    consumeSubmitQuiz = () => {
        try {
            if (!this.channel) {
              throw new Error('Channel is not initialized');
            }
            this.channel.assertQueue(QueueEvents.SubmitQuiz, { durable: true });
            this.channel?.consume(QueueEvents.SubmitQuiz, async(msg) => {
                if (msg !== null) {
                    const message = msg.content.toString();
                    console.log(`Received: ${message}`);
                    const submitQuizParams = JSON.parse(message) as SubmitQuizParams;
                    const submitQuizResult = await this.quizService.submitQuiz(submitQuizParams);
                    if (submitQuizResult) {
                        this.quizService.submitQuizConfirmed(this.socket, submitQuizParams);
                        this.channel?.ack(msg);
                    }
                }
            });  
        } catch (err) {
            console.log(err);
        }
    }
}