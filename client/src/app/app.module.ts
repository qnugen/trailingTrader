import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AppRouters } from './app.routes';
import { SocketService } from './socket.service';
import { BinanceService } from "./binance/binance.service";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    AppRouters,
    HttpClientModule
  ],
  providers: [HttpClientModule, SocketService, BinanceService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private socketService: SocketService) {
  }
}
