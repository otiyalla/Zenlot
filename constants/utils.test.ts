
import { getPipDifference, getExecutionType } from './utils';

describe('getPipDifference', () => {
  it('should calculate pip difference with default pips value', () => {
    const entryPrice = 1.2345;
    const existPrice = 1.2305;
    const result = getPipDifference(entryPrice, existPrice);
    expect(result).toBe(40.0000);
  });

  it('should calculate pip difference with a custom pips value', () => {
    const entryPrice = 1.2345;
    const existPrice = 1.2305;
    const customPips = 0.0002;
    const result = getPipDifference(entryPrice, existPrice, customPips);
    expect(result).toBe(20.0000);
  });

  it('should return 0 when entryPrice equals existPrice', () => {
    const entryPrice = 1.2345;
    const existPrice = 1.2345;
    const result = getPipDifference(entryPrice, existPrice);
    expect(result).toBe(0.0000);
  });

  it('should handle large differences between entryPrice and existPrice', () => {
    const entryPrice = 2.0000;
    const existPrice = 1.0000;
    const result = getPipDifference(entryPrice, existPrice);
    expect(result).toBe(10000.0000);
  });

  it('should round the result to 4 decimal places', () => {
    const entryPrice = 1.23456;
    const existPrice = 1.23450;
    const result = getPipDifference(entryPrice, existPrice);
    expect(result).toBe(0.6000);
  });
});

describe('getExecutionType', () => {
  it('should return "buy-long" when TakeProfitPrice > entryPrice', () => {
    expect(getExecutionType(1.2, 1.1, 1.3)).toBe('buy-long');
  });

  it('should return "buy-long" when TakeProfitPrice > stopLossPrice', () => {
    expect(getExecutionType(1.2, 1.1, 1.15)).toBe('buy-long');
  });

  it('should return "sell" when TakeProfitPrice < entryPrice', () => {
    expect(getExecutionType(1.2, 1.1, 1.0)).toBe('sell');
  });

  it('should return "sell" when stopLossPrice > entryPrice', () => {
    expect(getExecutionType(1.2, 1.3, 1.1)).toBe('sell');
  });

  it('should return "sell" when TakeProfitPrice < stopLossPrice', () => {
    expect(getExecutionType(1.2, 1.3, 1.1)).toBe('sell');
  });

  it('should return "buy" when TakeProfitPrice === entryPrice and stopLossPrice < entryPrice', () => {
    expect(getExecutionType(1.2, 1.1, 1.2)).toBe('buy');
  });

  it('should return "sell" when stopLossPrice === entryPrice and TakeProfitPrice < entryPrice', () => {
    expect(getExecutionType(1.2, 1.2, 1.1)).toBe('sell');
  });

  it('should return "buy" as default case', () => {
    expect(getExecutionType(1.2, 1.2, 1.2)).toBe('buy');
  });

  it('should handle undefined stopLossPrice and TakeProfitPrice gracefully', () => {
    expect(getExecutionType(1.2)).toBe('buy');
  });
});
