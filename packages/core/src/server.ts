import {UniformityApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import * as express from 'express';
import {Request, Response} from 'express';
import * as http from 'http';
import pEvent from 'p-event';
import * as path from 'path';

export class ExpressServer {
    private app: express.Application;
    private lbApp: UniformityApplication;
    private server?: http.Server;

    constructor(options: ApplicationConfig = {}) {
        this.app = express();
        this.lbApp = new UniformityApplication(options);

        // Route /api path to loopback
        this.app.use('/api', this.lbApp.requestHandler);

        // Custom Express routes
        this.app.get('/', (_req: Request, res: Response) => {
            res.sendFile(path.resolve(path.join(__dirname, '../public/express.html')));
        });
        this.app.get('/hello', (_req: Request, res: Response) => {
            res.send('Hello world!');
        });

        // Serve static files in the public folder
        this.app.use(express.static(path.join(__dirname, '../public')));
    }

    async boot() {
        await this.lbApp.boot();
    }

    public async start() {
        await this.lbApp.start();
        const port = this.lbApp.restServer.config.port || 3000;
        const host = this.lbApp.restServer.config.host || '127.0.0.1';
        this.server = this.app.listen(port, host);
        await pEvent(this.server, 'listening');
    }

    // For testing purposes
    public async stop() {
        if (!this.server) return;
        await this.lbApp.stop();
        this.server.close();
        await pEvent(this.server, 'close');
        this.server = undefined;
    }
}
