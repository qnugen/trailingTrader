import { Router } from 'express';
import { controller } from './binance.controller';

let router = Router();

router.route('/balance')
    .get(controller.getBalance);

router.route('/price')
    .post(controller.streamPrice);

router.route('/sockets')
    .get(controller.getSockets)
    .post(controller.closeSocket);


export let binanceRouter = router;