import { Request, Response, NextFunction } from 'express';
import Binance from "binance-api-node";
import { Account, AssetBalance, WebSocket }from "binance-api-node";
import * as request from "request-promise-native";
import * as download from "image-downloader";
import * as fs from 'async-file';
import * as util from "util";

const binance = Binance({
    apiKey: "",
    apiSecret: "",
});

let websockets: {[key:string]: Function} = {};

async function downloadImg (id: number, slug: string, width: number): Promise<string> {
    const validWidth = [16,32,64];
    if (validWidth.indexOf(width) == -1) {
        return ("Invalid width");
    }

    const filename: string = `${slug}_${width}.png`;
    const dest: string = `../client/src/assets/images/${filename}`;
    const stat = await fs.exists(dest);

    const options = {
        url: `https://s2.coinmarketcap.com/static/img/coins/${width}x${width}/${id}.png`,
        dest: dest
    };

    if(!stat) {
        await download.image(options);
    }
    return filename;
}

export let controller = {
    getBalance: async (req: Request, res: Response, next: NextFunction) => {
        let data: any = [];

        let accountInfo: Account = await binance.accountInfo({useServerTime: true});
        let prices: any = await binance.prices();
        let assets: any = JSON.parse(await request("https://s2.coinmarketcap.com/generated/search/quick_search.json"));

        let balances: AssetBalance[] = accountInfo.balances.filter((b) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0);

        for (let balance of balances) {
            let pairs = [];
            for (let price in prices) {
                if (price.startsWith(balance.asset)) {
                    pairs.push({
                        "pair": price,
                        "price": prices[price]
                    });
                }
            }

            let item = {
                "balance": {
                    "free": balance.free,
                    "locked": balance.locked
                },
                symbol: balance.asset,
                "pairs": pairs,
                name: balance.asset,
                shortname: balance.asset,
                logo: ""
            };

            if (balance.asset == "YOYO") {
                let asset = assets.find((a: any) => a.symbol == "YOYOW");
                item.name = asset.name;
                item.shortname = asset.slug;
                item.logo = await downloadImg(asset.id, asset.slug, 64);
            }

            for (let asset of assets) {
                if (balance.asset == asset.symbol) {
                    item.name = (asset.name) ? (asset.name) : asset.symbol;
                    item.shortname = asset.slug;
                    item.logo = await downloadImg(asset.id, asset.slug, 64);
                }
            }
            data.push(item);
        }

        res.json(data);
    },
    streamPrice: (req: any, res: Response, next: NextFunction) => {
        websockets[req.body.tradingPair] = websockets[req.body.tradingPair] || {};
        websockets[req.body.tradingPair] = binance.ws.candles(req.body.tradingPair, '1m', candle => {
            console.log(`websockets[${req.body.tradingPair}]: ${candle.close}`);
            req.io.emit("price", candle);
        });
        res.json(req.body.tradingPair);
    },
    getSockets: (req: Request, res: Response, next: NextFunction) => {
        res.json(Object.keys(websockets));
    },
    closeSocket: (req: Request, res: Response, next: NextFunction) => {
        Object.keys(websockets)
            .filter((s) => s == req.body.socket)
            .map((s) => {
                websockets[s]();
                delete websockets[s];
            });
        },
};