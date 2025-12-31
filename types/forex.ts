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
export interface ITrade {
    symbol: string;
    entry: number;
    lot: number;
    pips: number;
    execution: 'buy' | 'sell';
    editorState?: string | null;
    plainText?: string | null;
    exchangeRate: number;
    stopLoss: ExitProps;
    takeProfit: ExitProps;
}

export type TradeStatus = 'open' | 'close' | 'closed' | 'reached_tp' | 'reached_sl' | 'pending' | 'closed_in_profit' | 'closed_in_loss';

export interface TradeEntryState extends ITrade {
    id: string;
    rr: number;
    risk: number;
    reward: number;
    createdAt: Date | string;
    updatedAt: Date | string;
    tags?: string[];
    status: TradeStatus;
    accountCurrency: string;
    closedAt?: Date | string,
    closedPrice?: number,
    closedExchangeRate?: number,
    closedReason?: string,
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

export interface AvailableSymbolsProps {
    symbol: string;
    currency: string;
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

export interface TradeContextType {
    trade: TradeEntryState | ITrade;
    tradeHistory: TradeEntryState[];
    resetTrade: () => void;
    submitTrade: (validated: Partial<TradeEntryState>) => void;
    deleteTrade: (id: string) => void;
    duplicateTrade: (id: string) => void;
    editTrade: (id: string, update: TradeEntryState) => void;
    refreshTrades: () => void;
    currentRate: (symbol: string) => Promise<{ ask: number, open: number, bid: number } | undefined>;
    getAnalysis: (analysis_type: string) => { trades: number, gain: number, loss: number, net: number }
    setTrade: React.Dispatch<React.SetStateAction<TradeEntryState | ITrade>>
}