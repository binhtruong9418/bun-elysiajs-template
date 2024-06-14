import {Elysia} from "elysia";
import {BinaceType} from "../enum";

const Binance = require('node-binance-api-full');

export class BinanceService {
    private readonly binance: any;

    constructor() {
        this.binance = Binance({
            APIKEY: process.env.BINANCE_API_KEY,
            APISECRET: process.env.BINANCE_SECRET_KEY,
        });
    }

    async getKline(query: any, type: BinaceType) {
        const {symbol, interval, startTime, endTime, limit, timeZone} = query
        const options: any = {}
        if (startTime) options.startTime = +startTime
        if (endTime) options.endTime = +endTime
        if (limit) options.limit = +limit
        if (timeZone) options.timeZone = timeZone
        try {
            let ticks: any = []
            if (type === BinaceType.FUTURE) {
                ticks = await this.binance.futures.candlesticks(symbol.toUpperCase(), interval, Object.keys(options).length ? options : undefined) ?? []
            } else {
                ticks = await this.binance.spot.candlesticks(
                    symbol.toUpperCase(),
                    interval,
                    Object.keys(options).length ? options : undefined,
                ) ?? []
            }

            return ticks.map((tick: any) => ({
                time: +tick[0],
                open: +tick[1],
                high: +tick[2],
                low: +tick[3],
                close: +tick[4],
                volume: +tick[5],
                closeTime: +tick[6],
            }))
        } catch (e) {
            throw new Error(e.msg)
        }

    }

    async getTickerPrice(symbol: string, type: BinaceType) {
        try {
            const symbolUpperCase = symbol.toUpperCase()
            if(type === BinaceType.FUTURE) {
                const priceData = await this.binance.futures.prices(symbolUpperCase)
                return priceData[symbolUpperCase]
            } else {
                const priceData = await this.binance.spot.prices(symbolUpperCase)
                return priceData[symbolUpperCase]
            }
        } catch (e) {
            throw new Error(e.msg)
        }
    }

    async getDailyTicker(symbol: string, type: BinaceType) {
        try {
            if(type === BinaceType.FUTURE) {
                return await this.binance.futures.daily(symbol.toUpperCase())
            } else {
                return await this.binance.spot.daily(symbol.toUpperCase())
            }
        } catch (e) {
            throw new Error(e.msg)
        }
    }

}


export default new Elysia()
    .decorate('binanceService', new BinanceService())