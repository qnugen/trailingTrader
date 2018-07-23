import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { Balance } from '../interface/balance';
import { Candle } from '../interface/candle';
import { MatDialog } from '@angular/material';
import { BinanceService } from "../binance/binance.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public assets: any = [];
  public pairs: any = [];
  public sockets: any = [];

  public asset = "";
  public tradingpair = "";
  public price = 0.0;
  public currency = "";
  public numberOfDecimals = 0;

  public stopDistance = 5;
  public stopDistancePrice = 0;

  public limitDistance = 5.1;
  public limitDistancePrice = 0;

  public tradeAmount = 0.0;
  public tradeAmountPrice = 0;

  public laziness = 0.05;
  public lazinessPrice = 0;

  constructor(public dialog: MatDialog, private socketService: SocketService, private binanceService: BinanceService) {
  }

  private reset() {
    this.tradingpair = "";
    this.price = 0.0;
    this.currency = "";
  }

  private countDecimals (value: number) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
  }

  public getTradingPairs(asset) {
    this.reset();
    this.pairs = this.assets.find((a) => a.symbol == asset).pairs;
  }

  public setTradingPair(tradingpair) {
    this.reset();
    this.tradingpair = tradingpair;
    this.price = this.pairs.find((p) => p.pair == this.tradingpair).price;
    this.numberOfDecimals = this.countDecimals(this.price);
    this.currency = this.tradingpair.replace(this.asset, "");

    this.tradeAmount = this.assets.find((a) => a.symbol == this.asset).balance.free;

    this.stopDistancePrice = parseFloat(((1-this.stopDistance/100)*this.price).toFixed(this.numberOfDecimals));
    this.limitDistancePrice = parseFloat(((1-this.limitDistance/100)*this.price).toFixed(this.numberOfDecimals));
    this.tradeAmountPrice = parseFloat(((this.tradeAmount)*this.limitDistancePrice).toFixed(this.numberOfDecimals));
    this.lazinessPrice = parseFloat(((1+this.laziness/100)*this.price).toFixed(this.numberOfDecimals));
  }

  public updateStopDistance(stopDistance, price) {
    console.log(`updateStopDistance(${stopDistance},${price})`);
    this.stopDistancePrice = parseFloat(((1-this.stopDistance/100)*this.price).toFixed(this.numberOfDecimals))
  }

  public updateLimitDistance(limitDistance, price) {
    console.log(`updateLimitDistance(${limitDistance},${price})`);
    this.limitDistancePrice = parseFloat(((1-this.limitDistance/100)*this.price).toFixed(this.numberOfDecimals))
  }

  public updateTradeAmount(tradeAmount, price) {
    console.log(`updateTradeAmount(${tradeAmount},${price})`);
    this.tradeAmountPrice = parseFloat(((this.tradeAmount)*this.price).toFixed(this.numberOfDecimals))
  }

  public updateLaziness(laziness, price) {
    console.log(`updateLaziness(${laziness},${price})`);
    this.lazinessPrice = parseFloat(((1+this.laziness/100)*this.price).toFixed(this.numberOfDecimals))
  }

  closeSocket (socket) {
    const idx = this.sockets.findIndex((s) => s == socket);
    this.sockets.splice(idx, 1);
    console.log(`closeSocket(${socket})`);
    this.binanceService.closeSocket(socket)
      .subscribe(status => {
        console.log(`this.binanceService.closeSocket.status: ${status}`);
    });
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService.onPrice()
      .subscribe((candle: Candle) => {
        if (candle.symbol == this.tradingpair) {
          this.price = parseFloat(candle.close)
        }
      });
  }

  ngOnInit() {
    this.initIoConnection();

    this.binanceService.getBalances()
      .subscribe(balances => {
        this.assets = balances;
      });
  }
}
