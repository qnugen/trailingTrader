// modules
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as socketIo from 'socket.io-client';
import {Socket} from 'socket.io-client';

// Interfaces
import { Candle } from './interface/candle';

// parameters
const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class SocketService {
  private socket: Socket;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public send(eventName: string, args: any): void {
    this.socket.emit(eventName, args);
  }

  public onPrice(): Observable<Candle> {
    return new Observable<Candle>(observer => {
      this.socket.on("price", (data: Candle) => observer.next(data));
    });
  }
}
