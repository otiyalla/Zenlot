
import React from 'react';
import { HistoryPage } from '@/components/pages';
import { useTrade } from '@/providers/TradeProvider';

export default function History() {
  const { tradeHistory, refreshTrades } = useTrade();

  const handleViewTrade = (tradeId: number) => {
    // Navigate to trade details
    console.log('View trade:', tradeId);
  };

  const handleRefresh = () => {
    refreshTrades();
  };

  const handleFilterTrades = (filter: string) => {
    // Filter trades
    console.log('Filter trades:', filter);
  };

  return (
    <HistoryPage
      onRefresh={handleRefresh}
      trades={tradeHistory}
      onViewTrade={handleViewTrade}
      onFilterTrades={handleFilterTrades}
    />
  );
}
