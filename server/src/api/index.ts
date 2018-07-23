import { Router } from 'express';
import { sampleRouter } from './sample/sample.router';
import { binanceRouter } from './binance/binance.router';

let router = Router();
router.use('/sample', sampleRouter);
router.use('/binance', binanceRouter);

export let apiRouter = router;

