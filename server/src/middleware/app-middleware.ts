import { Request, Response, NextFunction, Express } from 'express';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { default as config, ENV } from '../config';
import { Server } from "socket.io";

export function appMiddleware(app: Express, io: Server) {
    return (req: any, res: Response, next: NextFunction) => {
        // Serve static server only in production mode. In any other modes, treat this as a standalone API server.
        if (config.environment === ENV.prod) {
            app.use(express.static(path.join(__dirname, '../../../../client/dist')));
        }
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        req.io = io;
        next();
    }
}