import { languageKey } from './languageKeys';

export const MIN_LOT_SIZE = '0.001';


export function getPipDifference(
  entryPrice: number,
  existPrice: number,
  pips: number = 0.0001,
): number {
  const pipsDifference = Math.abs(entryPrice - existPrice) / pips;
  const decimalPlaces = (1 / pips).toString().length;
  return parseFloat(pipsDifference.toFixed(decimalPlaces));
}

export function getExecutionType(
  entryPrice: number,
  stopLossPrice?: number,
  TakeProfitPrice?: number,
): 'buy' | 'sell' {
  if ((TakeProfitPrice === entryPrice || TakeProfitPrice! > stopLossPrice!) && stopLossPrice! < entryPrice && stopLossPrice! > 0) {
    return 'buy';
  } else if ((stopLossPrice === entryPrice || stopLossPrice! > TakeProfitPrice!) && TakeProfitPrice! < entryPrice && TakeProfitPrice! > 0) {
    return 'sell';
  } else if ((TakeProfitPrice! > entryPrice || stopLossPrice! < entryPrice ) && stopLossPrice! > 0) {
    return 'buy';
  } else if ((TakeProfitPrice! < entryPrice || stopLossPrice! > entryPrice) && (TakeProfitPrice! > 0 || stopLossPrice! > 0)) {
    return 'sell';
  }else {
    return 'buy';
  }
}

export function getSuggestedStopLoss(
  execution: 'buy' | 'sell',
  entry: number,
  pipValue: number,
  SL_RULES: { pips: number }[],
): { value: string; pips: number }[] {
  return SL_RULES.map((rule) => {
    const decimalPlaces = (1 / pipValue).toString().length;
    const pips = rule.pips;
    if (entry <= 0 ) return { value: '0', pips: 0 };
    const value = execution === 'buy' ? (entry - pips * pipValue).toFixed(decimalPlaces) 
      : (entry + pips * pipValue).toFixed(decimalPlaces);
    return { value, pips };
  });
}

export function getSuggestedTakeProfit(
  execution: 'buy' | 'sell',  
  entry: number,
  pipValue: number,
  TP_RULES: { pips: number }[],
): { value: string; pips: number }[] {
  return TP_RULES.map((rule) => {
    const decimalPlaces = (1 / pipValue).toString().length;
    const pips = rule.pips;
    const value = execution === 'buy' ? (entry + pips * pipValue).toFixed(decimalPlaces)
      : (entry - pips * pipValue).toFixed(decimalPlaces);
    return { value, pips };
  });
}

export function getRatio(
  stopLossPips: number,
  takeProfitPips: number,
): { risk: number; reward: number } {
  if (stopLossPips === 0 || takeProfitPips === 0) {
    return { risk: 0, reward: 0 };
  }
  const ratio = parseFloat((takeProfitPips / stopLossPips).toFixed(1));
  const risk = parseFloat((stopLossPips % takeProfitPips).toFixed(2));
  const reward = ratio
  return { risk, reward };
}


const CONTRACT_SIZE = {
  forex: 100000, //accurate
  gold: 100,  //accurate
  silver: 5000, //accurate
  copper: 25000,  //rest needs to be reviewed
  palladium: 50,
  platinum: 100,
  oil: 1000,
  gas: 1000,
  bitcoin: 0.0001,
  ethereum: 0.0001,
  litecoin: 0.0001,
  ripple: 0.0001,
}

const INSTRUMENT_TYPE = {
  gold: ['XAU'],
  silver: ['XAG'],
  copper: ['XCU'],
  palladium: ['XPD'],
  platinum: ['XPT'],
  oil: ['WTI'],
  gas: ['UGA'],
  bitcoin: ['BTC'],
  ethereum: ['ETH'],
  litecoin: ['LTC'],
  ripple: ['XRP'],
}

export function getInstrumentType(symbol: string): string {
  return (
    Object.keys(INSTRUMENT_TYPE).find(key =>
      INSTRUMENT_TYPE[key as keyof typeof INSTRUMENT_TYPE].some(item => symbol.includes(item))
    ) || 'forex'
  );
}

export function getCurrencyValue(
  symbol: string,
  entryPrice: number,
  existPrice: number,
  lotSize: number,
  exchangeRate: number = 1,
  contract_size?: number,
): number {

  const getDifference = (
    entryPrice: number,
    existPrice: number
  ): number  => Math.abs(entryPrice - existPrice);
  const pipDifference = getDifference(entryPrice, existPrice);
  if (isNaN(pipDifference) || pipDifference <= 0) {
    return 0;
  }
  const instrument = getInstrumentType(symbol);
  const unit = lotSize * CONTRACT_SIZE[instrument as keyof typeof CONTRACT_SIZE];
  const estimate =  (pipDifference * unit * exchangeRate).toFixed(2);
  return parseFloat(estimate);
}

export function getPipValue(entryPrice: number){
  const words = entryPrice.toString().split(".");
  const pips = words[1];
  const length = pips.length < 2 ? 0 : pips.length-2;
  const zeros = new Array(length).fill(0).join("");
  return `0.${zeros}1`;
}

export function formatNumberByLocale(number: number, language: keyof typeof languageKey, currency: string) {
  const locale = !!language ? languageKey[language] : navigator.language;
  const extra_options: {
    style?: 'currency' | 'decimal' | 'percent' | 'unit',
    currency?: string, 
  } = !!currency ? {
    style: 'currency',
    currency: currency.toUpperCase()
  } : {}
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...extra_options
  }).format(number);
}

export function parseErrors(errors: {}[]): {errorFields: string[], errorMessage: {[key: string]: string}} {
    const fields = new Set<string>();
    const errorMessage: { [key: string]: string } = {};
    errors.forEach((err: any) => {
        if (err.path && err.path.length > 0) {
            const field = err.path[0];
            fields.add(field);
            errorMessage[field] = err.message;
        }
    });
    const errorFields = Array.from(fields);
    return {errorFields, errorMessage};
}


export function getExchangeRate(
  baseCurrency: string,
  quoteCurrency: string,
  exchangeRates: Record<string, number>,
): number {
  const key = `${baseCurrency}/${quoteCurrency}`;
  return exchangeRates[key] || 1; // Default to 1 if not found
}

export function formatCurrency(
  amount: number,
  currency: string,
  exchangeRate: number = 1,
): string {
  const convertedAmount = amount * exchangeRate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(convertedAmount);
}

export function formatPips(pips: number): string {
  return pips.toFixed(2);
}

export function getSystemTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function localizeTimeZoneName(timeZone: string, language?: keyof typeof languageKey) {
  const date = new Date();

  const parts = new Intl.DateTimeFormat(languageKey[language ?? 'en'], {
    timeZone,
    timeZoneName: 'short',
  }).formatToParts(date);

  const tzPart = parts.find(p => p.type === 'timeZoneName');
  return tzPart?.value || timeZone;
}


export function formatDate(date: Date | string, language?: keyof typeof languageKey, showTime?: boolean): string {
  const locale = !!language ? languageKey[language] : navigator.language;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...(showTime && { hour: '2-digit', minute: '2-digit'})
  }).format(new Date(date));
}

export function lexicalToPlainText(editorState?: string | null, fallback?: string): string {
  if (!editorState) return fallback ?? '';
  try {
    const parsed = typeof editorState === 'string' ? JSON.parse(editorState) : editorState;
    const root = parsed?.root;
    if (!root?.children) return fallback ?? '';
    const lines: string[] = [];
    const walk = (node: any) => {
      if (!node) return;
      if (node.type === 'paragraph' && Array.isArray(node.children) && node.children.length === 0) {
        lines.push(''); // preserve empty paragraph spacing
      }
      if (typeof node.text === 'string' && node.text.length > 0) {
        lines.push(node.text);
      }
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };
    walk(root);
    // Collapse consecutive empties nicely
    const text = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    return text.length ? text : (fallback ?? '');
  } catch {
    return fallback ?? '';
  }
}