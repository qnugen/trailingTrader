export interface Candle {
  eventType: string,
  eventTime: number,
  symbol: string,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
  trades: number,
  interval: string,
  isFinal: boolean,
  quoteVolume: string,
  buyVolume: string,
  quoteBuyVolume: string
}
