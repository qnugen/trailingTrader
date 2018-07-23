// modules
import {Socket} from 'socket.io';
import {createServer, Server} from "http";

// own modules
import app from './src';
import config from './src/config';
import logger from './src/util/logger';

app.listen(config.port, () => {
    logger.log(`server started at port ${config.port}`);
});