import RabbitMQ from 'amqplib';
import { IMessageQueue } from './types';
import { IQuizQueueHandler } from '../../quiz/types';
import { QuizQueueHandler } from '../../quiz/queue-handler';
import { QuizService } from '../../quiz/service';
import { QuizRepository } from '../../quiz/repository';
import { IDatabase } from '../../common/database/types';
import { IWebSocket } from '../socket/types';

export class RabbitMQImpl implements IMessageQueue {
    private connection: RabbitMQ.Connection | undefined;
    private channel: RabbitMQ.Channel | undefined;
    private quizQueueHandler: IQuizQueueHandler;

    constructor(db: IDatabase) {
        const quizRepos = new QuizRepository(db);
        const quizService = new QuizService(quizRepos);
        this.quizQueueHandler = new QuizQueueHandler(quizService);
    }

    getChannel = (): RabbitMQ.Channel | undefined => {
        return this.channel;
    }

    setSocket = (webSocket: IWebSocket) => {
        this.quizQueueHandler.setSocket(webSocket);
    }

    connect = async () => {
        this.connection = await RabbitMQ.connect(process.env.MESSAGE_QUEUE_URL || `amqp://admin:123456@localhost:5672`);
        this.channel = await this.connection.createChannel();
        this.quizQueueHandler.setChannel(this.channel);
        return this;
    }
    
    sendMessageToQueue = async(queue: string, message: string) => {
        try {
            if (!this.channel) {
              throw new Error('Channel is not initialized');
            }
      
            await this.channel.assertQueue(queue, {
              durable: true
            });
      
            this.channel.sendToQueue(queue, Buffer.from(message), {
                persistent: true
            });
          } catch (error) {
            console.error('Error sending message to queue:', error);
            throw error;
        }
    }

    consumeMessage = () => {
        this.quizQueueHandler.consumeStartQuiz();
        this.quizQueueHandler.consumeSubmitQuiz();
    }
}