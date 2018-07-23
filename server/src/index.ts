// Modules
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
import {Socket} from "socket.io";
import {createServer} from "http";

// Own modules
import { apiRouter } from './api';
import { appMiddleware, errorHandler } from './middleware';
import config from '../src/config';

// variables
let app = express();
const server = createServer(app);
const io = require("socket.io")(server, { wsEngine: "ws" });

app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
app.use(appMiddleware(app, io));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use(errorHandler);

io.on('connect', (socket: Socket) => {
    console.log('Connected client on port %s.', config.port);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

export default server;