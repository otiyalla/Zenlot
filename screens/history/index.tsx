
import React from 'react';
import { HistoryPage } from '@/components/pages';
import { useTrade } from '@/providers/TradeProvider';

//TODO: History - Trading history, Journal, success and performance metrics

export default function History() {
  const { tradeHistory } = useTrade();
  const handleViewTrade = (tradeId: number) => {
    // Navigate to trade details
    console.log('View trade:', tradeId);
  };

  const handleExportHistory = () => {
    // Export trade history
    console.log('Export history');
  };

  const handleFilterTrades = (filter: string) => {
    // Filter trades
    console.log('Filter trades:', filter);
  };

  return (
    <HistoryPage
      trades={tradeHistory}
      onViewTrade={handleViewTrade}
      onExportHistory={handleExportHistory}
      onFilterTrades={handleFilterTrades}
    />
  );
}
