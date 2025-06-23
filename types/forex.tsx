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