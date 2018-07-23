import { Balance }    from '../interface/balance';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";

@Injectable()
export class BinanceService {

  constructor(private http: HttpClient) {
  }

  getBalances() {
    return this.http.get('http://localhost:3000/api/binance/balance');
  }

  streamPrices(tradingPair: string) {
    console.log(`BinanceService.streamPrices(${tradingPair})`);
    return this.http.post('http://localhost:3000/api/binance/price', {"tradingPair": tradingPair});
  }

  getSockets() {
    return this.http.get('http://localhost:3000/api/binance/sockets');
  }

  closeSocket(socket: string) {
    console.log(`BinanceService.closeSocket(${socket})`);
    return this.http.post('http://localhost:3000/api/binance/sockets', {"socket": socket});
  }
}
