import React, { createContext, useContext, useState, ReactNode, useEffect, use } from 'react';
import { ITrade, TradeContextType, TradeEntryState } from '@/types';
import { tradeApi } from '@/api/trade';
import { useAuth } from "./AuthProvider";

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


// Create the context
const TradeContext = createContext<TradeContextType | undefined>(undefined);

// Provider component
const TradeProvider = ({ children }: { children: ReactNode }) => {
    const [trade, setTrade] = useState<TradeEntryState | ITrade>(defaultTrade);
    const [tradeHistory, setTradeHistory] = useState<TradeEntryState[]>([]);
    const { getTrades, getPrice, deleteTrade: tradeDelete, createTrade, updateTrade } = tradeApi;
    const { refreshAuthToken } = useAuth();

    useEffect(() => {
        refreshTrades();
    }, []);


    const refreshTrades = async () => {
        try {
            const trades = await getTrades();
            setTradeHistory(trades);
            await refreshAuthToken();
        } catch (error) {
            console.error('Failed to refresh trades:', error);
        }
    };

    const resetTrade = React.useMemo(() => () => setTrade(defaultTrade), [defaultTrade]);

    const submitTrade = async (validated: TradeEntryState | ITrade) => {
        const trade = { ...validated, status: "open" as TradeEntryState['status']};
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

    const editTrade = async (id: number, update: TradeEntryState | ITrade) => {
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
        refreshTrades
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