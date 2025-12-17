import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, use } from 'react';
import { ITrade, TradeContextType, TradeEntryState, TradeStatus } from '@/types';
import { tradeApi } from '@/api/trade';
import { useAuth } from "./AuthProvider";
import { LOSS_STATUSES, WIN_STATUSES, getCurrencyValue, formatNumberByLocale } from '@/constants';

// Default state for a new trade entry
const defaultTrade: ITrade = {
    symbol: '',
    entry: 0,
    lot: 0.01,
    pips: 0.0001,
    execution: 'buy',
    exchangeRate: 1,
    stopLoss: { value: 0, pips: 0 },
    takeProfit: { value: 0, pips: 0 },
};


const TradeContext = createContext<TradeContextType | undefined>(undefined);

const TradeProvider = ({ children }: { children: ReactNode }) => {
    const { refreshAuthToken, user } = useAuth();
    const { language, accountCurrency } = user ?? {language: 'en'};
    const [trade, setTrade] = useState<TradeEntryState | ITrade>({ ...defaultTrade });
    const [tradeHistory, setTradeHistory] = useState<TradeEntryState[]>([]);
    const { getTrades, getPrice, getFXRate, deleteTrade: tradeDelete, createTrade, updateTrade } = tradeApi;
    
    useEffect(() => {
        const loadTrades = async () => {
            try {
                await refreshTrades();
            } catch (error) {
                console.error('❌ [TradeProvider] Failed to load trades:', error);
            }
        };
        loadTrades();
    }, []);

    const refreshTrades = async () => {
        try {
            const trades = await getTrades();
            setTradeHistory(trades);
            await refreshAuthToken();
        } catch (error) {
            setTradeHistory([]);
        }
    };

    const resetTrade = useMemo(() => () => setTrade(defaultTrade), [defaultTrade]);

    const getPipsAnalysis = (trades: TradeEntryState[]) => {
        interface IAnalysis {
            trades: number;
            gain: number;
            loss: number;
            net: number;
        }
        
        const pipsData = trades.reduce((acc: IAnalysis, trade: TradeEntryState, i: number, array: TradeEntryState[]) => {
            acc.trades = array.length;
            if(["reached_tp", "closed_in_profit"].includes(trade?.status as TradeStatus)){
                acc.gain += trade.takeProfit.pips;
            }
            if(["reached_sl", "closed_in_loss"].includes(trade?.status as TradeStatus)){
                acc.loss += trade.stopLoss.pips;
            }
            acc.net = Number((acc.gain - acc.loss).toFixed(2));
            return acc;
        }, {trades: 0, gain: 0, loss: 0, net: 0});
        return pipsData as IAnalysis;
    }

    const getValueAnalysis = (trades: TradeEntryState[]) => {
        interface IAnalysis {
            trades: number;
            gain: number;
            loss: number;
            net: number;
        }
        const pipsData = trades.reduce((acc: IAnalysis, trade: any, i: number, all: TradeEntryState[]) => {
            acc.trades = all.length;
            if(WIN_STATUSES.includes(trade?.status as TradeStatus)){
                const {symbol, entry, takeProfit, lot, closedExchangeRate} = trade;
                const currencyValue = getCurrencyValue(symbol, entry, takeProfit.value, lot, closedExchangeRate);
                acc.gain+=currencyValue
            }
            if(LOSS_STATUSES.includes(trade?.status as TradeStatus)){
                const {symbol, entry, stopLoss, lot, closedExchangeRate} = trade;
                const currencyValue = getCurrencyValue(symbol, entry, stopLoss.value, lot, closedExchangeRate);
                acc.loss+=currencyValue;
            }
            acc.net = Number((acc.gain - acc.loss).toFixed(2));
            return acc;
        }, {trades: 0, gain: 0, loss: 0, net: 0})
        return pipsData;
    }

    const getAnalysis = useMemo(() => (analysis_type: string) => {
        let trades: TradeEntryState[] = [];
        let analysis = {
            trades: 0,
            gain: 0,
            loss: 0,
            net: 0
        };
        switch (analysis_type) {
          case 'weekly_pips':
          case 'weekly_analysis':
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            trades = tradeHistory.filter(trade => new Date(trade.createdAt) >= startOfWeek);
            break;
          case 'monthly_pips':
          case 'monthly_analysis':
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            trades = tradeHistory.filter(trade => new Date(trade.createdAt) >= startOfMonth);
            break;
          default:
            break;
        }
        trades = trades.filter(trade => trade.status !== 'open');
        if (analysis_type.includes('pips')) {
            analysis = getPipsAnalysis(trades);
        }
        if (analysis_type.includes('analysis')) {
            analysis = getValueAnalysis(trades);
        }

        return analysis;
    }, [tradeHistory]);

    const currentRate = async (symbol: string) => {
        try {
            const rate = await getFXRate(symbol);
            const {ask, open, bid} = rate[0] ?? {};
            return {ask, open, bid};
        } catch (error) {
            console.error("get fx rate error: ", error);
        }
    }

    const submitTrade = async (validated: Partial<TradeEntryState>) => {
        const trade = { ...validated, status: "open" as TradeEntryState['status'], accountCurrency };
        try{
            const newTrade = await createTrade(trade);
            console.log('The new trade:', newTrade);
            setTradeHistory((prev) => {
                return [ newTrade, ...prev];
            });
            resetTrade();
        } catch (error) {
            console.error('Invalid trade:', error);
            return error;
        }
    }
    
    const deleteTrade = (id: number) => {
        try {
            
            tradeDelete(id);
            const newTrade = tradeHistory.filter(trade => trade.id !== id);
            setTradeHistory(newTrade);
        } catch (error) {
            console.error('error deleting trade:', error);
            return error;
        }
    }

    const duplicateTrade = async (id: number) => {
        const tradeToDuplicate = tradeHistory.find(trade => trade.id === id);
        if (tradeToDuplicate) {
            const duplicate = sensitiveData(tradeToDuplicate);
            const newTrade = await createTrade(duplicate);
            setTradeHistory(prev => [newTrade, ...prev]);
        }
    };

    const sensitiveData = (trade: TradeEntryState) => {
        const duplicatedTrade = { ...trade };
        const PROPERTIES_TO_DELETE = ['id', 'createdAt', 'updatedAt', 'userId', 'closedReason', 'closedExchangeRate', 'closedAt', 'closedPrice'];  
        PROPERTIES_TO_DELETE.forEach(property => {
            delete duplicatedTrade[property];
        });
        return duplicatedTrade;
    }

    const editTrade = async (id: number, update: TradeEntryState ) => {
       try {
        await updateTrade(id, update);
        setTradeHistory(prev =>
            prev.map(trade =>
                trade.id === id ? { ...trade, ...update } : trade
            )
        );
        resetTrade();
       } catch (error) {
        console.error('error editing trade:', error);
        return error;
       }
    };

    const tradeProvider = {
        trade, 
        setTrade,
        tradeHistory, 
        resetTrade,
        submitTrade,
        deleteTrade,
        duplicateTrade,
        editTrade,
        refreshTrades,
        currentRate,
        getAnalysis
    }

    return (
        <TradeContext.Provider value={tradeProvider}>
            {children}
        </TradeContext.Provider>
    );
};


const useTrade = () => {
    const context = useContext(TradeContext);
    if (!context) {
        throw new Error('useTrade must be used within a TradeProvider');
    }
    return context;
};

export {TradeProvider, useTrade};