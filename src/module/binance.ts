import {Elysia, t} from "elysia";
import {binanceService} from "../service";
import {BinaceType} from "../enum";

const binancePlugin = new Elysia()
    .group("/binance", (group) =>
        group
            .use(binanceService)
            .get("/spot/klines", async ({binanceService, query}) => {
                return await binanceService.getKline(query, BinaceType.SPOT)
            }, {
                detail: {
                    tags: ['binance'],
                },
                query: t.Object({
                    symbol: t.String(),
                    interval: t.String(),
                    limit: t.Optional(t.String()),
                    startTime: t.Optional(t.String()),
                    endTime: t.Optional(t.String()),
                    timeZone: t.Optional(t.String())
                })
            })
            .get("/future/klines", async ({binanceService, query}) => {
                return await binanceService.getKline(query, BinaceType.FUTURE)
            }, {
                detail: {
                    tags: ['binance'],
                },
                query: t.Object({
                    symbol: t.String(),
                    interval: t.String(),
                    limit: t.Optional(t.String()),
                    startTime: t.Optional(t.String()),
                    endTime: t.Optional(t.String()),
                    timeZone: t.Optional(t.String())
                })
            })
            .get("/future/ticker/price", async ({binanceService, query}) => {
                return await binanceService.getTickerPrice(query.symbol, BinaceType.FUTURE)
            }, {
                detail: {
                    tags: ['binance'],
                },
                query: t.Object({
                    symbol: t.String(),
                })
            })
            .get("/spot/ticker/price", async ({binanceService, query}) => {
                return await binanceService.getTickerPrice(query.symbol, BinaceType.SPOT)
            }, {
                detail: {
                    tags: ['binance'],
                },
                query: t.Object({
                    symbol: t.String(),
                })
            })
            .get("/spot/ticker/daily", async ({binanceService, query}) => {
                return await binanceService.getDailyTicker(query.symbol, BinaceType.SPOT)
            }, {
                detail: {
                    tags: ['binance'],
                },
                query: t.Object({
                    symbol: t.String()
                })
            })
            .get("/future/ticker/daily", async ({binanceService, query}) => {
                return await binanceService.getDailyTicker(query.symbol, BinaceType.FUTURE)
            }, {
                detail: {
                    tags: ['binance'],
                },
                query: t.Object({
                    symbol: t.String()
                })
            })
    )

export default binancePlugin