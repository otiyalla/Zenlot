import * as z from "zod/v4";
export const tradeValidationRegistry = z.registry<{ title: string; description: string }>();
export const createTradeValidation = z.object({
    symbol: z.string().min(1).register(tradeValidationRegistry, { title: "Symbol", description: "Trade symbol" }),
    entry: z.number().gt(0).register(tradeValidationRegistry, { title: "Entry", description: "Trade entry price" }),
    lot: z.number().gt(0).register(tradeValidationRegistry, { title: "Lot", description: "Trade lot size" }),
    pips: z.number().gt(0).register(tradeValidationRegistry, { title: "Pips", description: "Trade pips" }),
    execution: z.enum(['buy', 'sell']).register(tradeValidationRegistry, { title: "Execution", description: "Trade execution type (buy or sell)" }),
    exchangeRate: z.number().register(tradeValidationRegistry, { title: "Exchange Rate", description: "Trade exchange rate" }),
    rr: z.number().gt(0).register(tradeValidationRegistry, { title: "Risk-Reward Ratio", description: "Trade risk-reward ratio" }),
    risk: z.number().gt(0).register(tradeValidationRegistry, { title: "Risk", description: "Trade risk amount" }),
    reward: z.number().gt(0).register(tradeValidationRegistry, { title: "Reward", description: "Trade reward amount" }),
    takeProfit: z.object({
        value: z.number().gt(0).register(tradeValidationRegistry, { title: "Take Profit Value", description: "Trade take profit value" }),
        pips: z.number().gt(0).register(tradeValidationRegistry, { title: "Take Profit Pips", description: "Trade take profit pips" }),
    }).register(tradeValidationRegistry, { title: "Take Profit", description: "Trade take profit" }),
    stopLoss: z.object({
        value: z.number().gt(0).register(tradeValidationRegistry, { title: "Stop Loss Value", description: "Trade stop loss value" }),
        pips: z.number().gt(0).register(tradeValidationRegistry, { title: "Stop Loss Pips", description: "Trade stop loss pips" }),
    }).register(tradeValidationRegistry, { title: "Stop Loss", description: "Trade stop loss" }),
    status: z.enum(['open', 'close', 'closed', 'reached_tp', 'reached_sl', 'pending', 'closed_in_profit', 'closed_in_loss']).default('open').register(tradeValidationRegistry, { title: "Status", description: "Trade status" }),
    editorState: z.union([z.string(), z.null()]).optional().register(tradeValidationRegistry, { title: "Editor State", description: "Trade editor state" }),
    plainText: z.union([z.string(), z.null()]).optional().register(tradeValidationRegistry, { title: "Plain Text", description: "Trade plain text" }),
});

export const updateTradeValidation = createTradeValidation.extend({
    id: z.number().gt(0).register(tradeValidationRegistry, {title: "id", description: "unique trade id"}),
    createdAt: z.string().register(tradeValidationRegistry, { title: "Create at", description: "The trade created date" }),
    updatedAt: z.string().register(tradeValidationRegistry, { title: "Updated at", description: "The trade updated date" }),
})