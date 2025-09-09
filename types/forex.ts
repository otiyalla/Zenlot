export interface ExitProps {
    value: number,
    pips: number
}

export interface ForexTrade {
    id: string;
    symbol: string;
    entryPrice: number;
    stopLossPrice?: number;
    takeProfitPrice?: number;
    lotSize: number;
    executionType: 'buy' | 'sell';
    exit?: ExitProps;
    createdAt: Date;
}
/*
export interface TradeEntryState {
    symbol: string;
    entry: number;
    lot: number;
    pips: number;
    execution: 'buy' | 'sell';
    exchangeRate: number;
    stopLoss: ExitProps;
    takeProfit: ExitProps;
    editorState?: string | null;
    plainText?: string | null;
    status?: 'open' | 'close' | 'closed' | 'reached_tp' | 'reached_sl' | 'pending' | 'closed_in_profit' | 'closed_in_loss';
    [key: string]: any; // For extensibility
}
*/
export interface TradeEntryState {
    id: number; 
    symbol: string;
    entry: number;
    lot: number;
    pips: number;
    execution: 'buy' | 'sell';
    timestamp: string;
    exchangeRate: number;
    stopLoss: ExitProps;
    takeProfit: ExitProps;
    editorState?: string | null;
    plainText?: string;
    status?: 'open' | 'close' | 'closed' | 'reached_tp' | 'reached_sl' | 'pending' | 'closed_in_profit' | 'closed_in_loss';
    [key: string]: any; // For extensibility
}

export interface ForexRule {
    id: string;
    pips: number;
    type: 'take_profit' | 'stop_loss';
}

export interface ForexRulesTableProps {
  takeProfitRules: ForexRule[];
  stopLossRules: ForexRule[];
  onTakeProfitChange: (rules: ForexRule[]) => void;
  onStopLossChange: (rules: ForexRule[]) => void;
}

export interface IQuote {
    symbol: string;
    name: string;
    currency: string;
    stockExchange: string;
    exchangeShortName: string;
}

export interface ExecutionProps {
    execution: 'buy' | 'sell';
    exchangeRate: number;
}

export interface TradeRatioProps {
    risk: number;
    reward: number;
}

export interface PriceFeedData {
    ticker: string;
    bid: number;
    ask: number;
    open: number;
    high: number;
    low: number;
    change: number;
    date: string;
}

export type ITrade = Omit<TradeEntryState, 'id' | 'timestamp'>;

// Define the context value type

export interface TradeContextType {
    trade: TradeEntryState | ITrade;
    tradeHistory: TradeEntryState[];
    resetTrade: () => void;
    submitTrade: (validated: TradeEntryState | ITrade) => void;
    deleteTrade: (id: number) => void;
    duplicateTrade: (id: number) => void;
    editTrade: (id: number, update: TradeEntryState | ITrade) => void;
    refreshTrades: () => void;
    setTrade: React.Dispatch<React.SetStateAction<TradeEntryState | ITrade>>
}