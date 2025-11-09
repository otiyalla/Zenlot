import { api, getTokens } from '.';
import { getCurrencyValue } from '@/constants/utils';


export const tradeApi = {
    async getTrades() {
        const { access_token, refresh_token, userId } = await getTokens();
        
        const headers = {
            access_token: access_token || '',
            refresh_token: refresh_token || '',
        };
        const url = `trade?userId=${userId}`;
        return await api.read(url, headers);
    },

    async getTrade(id: string) {
        const { access_token, refresh_token } = await getTokens();
        const headers = {
            access_token: access_token || '',
            refresh_token: refresh_token || '',
        };
        const url = `trade/${id}`;
        return await api.read(url, headers);
    },

    async getPrice(symbol: string){
        const { access_token, refresh_token } = await getTokens();
        const headers = {
            access_token: access_token || '',
            refresh_token: refresh_token || '',
        };
        const url = `pricefeed?symbol=${symbol}`;
        return await api.read(url, headers);
    },

    async getFXRate(symbol: string){
        const { access_token, refresh_token } = await getTokens();
        const headers = {
            access_token: access_token || '',
            refresh_token: refresh_token || '',
        };
        const url = `pricefeed/exchangeRate/${symbol}`;
        return await api.read(url, headers);
    },

    async createTrade(data: any) {
        const { access_token, refresh_token, userId } = await getTokens();
        const headers = {
            access_token: access_token || '',
            refresh_token: refresh_token || '',
        };
        return await api.create('trade', { ...data, userId }, headers);
    },

    async updateTrade(id: number, data: any) {
        const { access_token, refresh_token } = await getTokens();
        const headers = {
            access_token: access_token || '',
            refresh_token: refresh_token || '',
        };
        return await api.update(`trade/${id}`, data, headers);
    },

    async deleteTrade(id: number) {
        const { access_token, refresh_token } = await getTokens();
        const headers = {
            access_token: access_token || '',
            refresh_token: refresh_token || '',
        };
        return await api.delete(`trade/${id}`, headers);
    },

    async getRange(params: string){
        const { access_token, refresh_token, userId } = await getTokens();
        const headers = {
            access_token:
             access_token || '',
            refresh_token: refresh_token || '',
        };
        //http://localhost:3000/trade/range?start=2025-08-10T05:54:56.487Z&end=2025-08-17T05:54:56.487Z&userId=2
        return await api.read(`trade/range?${params}&userId=${userId}`, headers);

    },
    async getWeeklyPips(){
        type statusType = 'open' | 'close' | 'closed' | 'reached_tp' | 'reached_sl' | 'pending' | 'closed_in_profit' | 'closed_in_loss';
        const now = new Date();
        const day = now.getDay();
        const week = 7;
        const start = new Date(now.setDate(now.getDate() - day)).toISOString();
        const end = new Date(now.setDate(now.getDate() + week)).toISOString();
        const params = `start=${start}&end=${end}`;
        const trades = await this.getRange(params);
        const pipsData = trades.reduce((acc: {total: number, gain: number, loss: number}, trade: any, i: number, all: []) => {
            acc.total = all.length;
            if(["reached_tp", "closed_in_profit"].includes(trade?.status as statusType)){
                acc.gain+=trade.takeProfit.pips
            }
            if(["reached_sl", "closed_in_loss"].includes(trade?.status as statusType)){
                acc.loss+=trade.stopLoss.pips
            }
            return acc;
        }, {total: 0, gain: 0, loss: 0})
        return pipsData;

    },
    async getMonthlylyPips(){
        type statusType = 'open' | 'close' | 'closed' | 'reached_tp' | 'reached_sl' | 'pending' | 'closed_in_profit' | 'closed_in_loss';
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const end = new Date(now.getFullYear(), now.getMonth()+1, 0).toISOString();
        const params = `start=${start}&end=${end}`;
        const trades = await this.getRange(params);
        const pipsData = trades.reduce((acc: {total: number, gain: number, loss: number}, trade: any, i: number, all: []) => {
            acc.total = all.length;
            if(["reached_tp", "closed_in_profit"].includes(trade?.status as statusType)){
                acc.gain+=trade.takeProfit.pips
            }
            if(["reached_sl", "closed_in_loss"].includes(trade?.status as statusType)){
                acc.loss+=trade.stopLoss.pips
            }
            return acc;
        }, {total: 0, gain: 0, loss: 0})
        return pipsData;
    },
    async getMonthlyTradeValue(){
        type statusType = 'open' | 'close' | 'closed' | 'reached_tp' | 'reached_sl' | 'pending' | 'closed_in_profit' | 'closed_in_loss';
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const end = new Date(now.getFullYear(), now.getMonth()+1, 0).toISOString();
        const params = `start=${start}&end=${end}`;
        const trades = await this.getRange(params);
        const pipsData = trades.reduce((acc: {total: number, gain: number, loss: number}, trade: any, i: number, all: []) => {
            acc.total = all.length;
            if(["reached_tp", "closed_in_profit"].includes(trade?.status as statusType)){
                const {symbol, entryPrice, takeProfit, lot, exchangeRate} = trade;
                acc.gain+=getCurrencyValue(symbol, entryPrice, takeProfit.value, lot, exchangeRate);
            }
            if(["reached_sl", "closed_in_loss"].includes(trade?.status as statusType)){
                const {symbol, entryPrice, stopLoss, lot, exchangeRate} = trade;
                acc.loss+=getCurrencyValue(symbol, entryPrice, stopLoss.value, lot, exchangeRate);
            }
            return acc;
        }, {total: 0, gain: 0, loss: 0})
        return pipsData;
    },
    async getWeeklyTradeValue(){
        type statusType = 'open' | 'close' | 'closed' | 'reached_tp' | 'reached_sl' | 'pending' | 'closed_in_profit' | 'closed_in_loss';
        const now = new Date();
        const day = now.getDay();
        const week = 7;
        const start = new Date(now.setDate(now.getDate() - day)).toISOString();
        const end = new Date(now.setDate(now.getDate() + week)).toISOString();
        const params = `start=${start}&end=${end}`;
        const trades = await this.getRange(params);
        const pipsData = trades.reduce((acc: {total: number, gain: number, loss: number}, trade: any, i: number, all: []) => {
            acc.total = all.length;
            if(["reached_tp", "closed_in_profit"].includes(trade?.status as statusType)){
                const {symbol, entryPrice, takeProfit, lot, exchangeRate} = trade;
                acc.gain+=getCurrencyValue(symbol, entryPrice, takeProfit.value, lot, exchangeRate);
            }
            if(["reached_sl", "closed_in_loss"].includes(trade?.status as statusType)){
                const {symbol, entryPrice, stopLoss, lot, exchangeRate} = trade;
                acc.loss+=getCurrencyValue(symbol, entryPrice, stopLoss.value, lot, exchangeRate);
            }
            return acc;
        }, {total: 0, gain: 0, loss: 0})
        return pipsData;
    }
};