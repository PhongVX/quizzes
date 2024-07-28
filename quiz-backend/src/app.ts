import express, { Request, Response } from 'express';
import http from 'http';
import * as core from 'express-serve-static-core';

import { HttpMethod } from './common/types';
import { ApiImpl } from './core/api/api';
import { SocketIOImpl } from './core/socket/socket';
import { RabbitMQImpl } from './core/queue/rabbitmq';
import { IMessageQueue } from './core/queue/types';
import { IWebSocket } from './core/socket/types';
import { IDatabase } from './common/database/types';
import { Postgres } from './common/database/postgres/postgres';


export class App {
    private app: core.Express;
    private server: http.Server;
    private webSocket: IWebSocket;
    private queue: IMessageQueue;
    private db: IDatabase;
    private port: number;
    
    constructor(port: number = 8080) {
        this.app = express();
        this.app.use(express.json());
        this.port = port;
        this.server = http.createServer(this.app);
        this.db = new Postgres();
        this.queue = this.initializeQueue();
        this.webSocket = this.initializeWebSocket();
        this.initializeApi(); 
        this.patchingInitilize();  
    }

    private initializeWebSocket = () => {
        return new SocketIOImpl({ server: this.server });
    }

    private initializeQueue = () => {
        return new RabbitMQImpl(this.db);
    }

    private patchingInitilize = () => {
        this.webSocket.setQueue?.(this.queue); 
        this.queue.setSocket?.(this.webSocket); 
    }

    private initializeApi = () => {
        const api = new ApiImpl(this.db);
        this.app.get('/health-check', (_: Request, res: Response) => {
            res.send('OK');
        });
        api.getAllRoutes().forEach((route) => {
            switch(route.method) {
                case HttpMethod.GET:
                    this.app.get(route.path, route.handler);
                    break;
                case HttpMethod.POST:
                    this.app.post(route.path, route.handler);
                    break;
                case HttpMethod.PUT:
                    this.app.put(route.path, route.handler);
                    break;
                case HttpMethod.PATCH:
                    this.app.put(route.path, route.handler);
                    break;
            }
        });
    }

    start = async() => {
        await this.queue.connect();
        this.queue.consumeMessage();

        this.webSocket.onConnection();
        
        this.server.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}`);
        });
    }
}