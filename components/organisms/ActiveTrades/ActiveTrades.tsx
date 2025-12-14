import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from '@/components/atoms';
import { CollapsibleSection } from '@/components/molecules';
import { useTranslate } from '@/hooks/useTranslate';
import { useTrade } from '@/providers/TradeProvider';
import { TradeCard } from '../TradeCard';
import { ExitProps } from '@/types';

export interface ActiveTrade {
  id: string;
  symbol: string;
  entry: number;
  lot: number;
  pips: number;
  execution: 'buy' | 'sell';
  exchangeRate: number;
  stopLoss: ExitProps;
  takeProfit: ExitProps;
  editorState?: string | null;
  plainText?: string;
  status?: 'open';
  timestamp: string;
}
//TODO: Look into trade and the handlers
export interface ActiveTradesProps {
  trades?: ActiveTrade[];
  onCloseTrade?: (tradeId: string) => void;
  onViewDetails?: (tradeId: string) => void;
  testID?: string;
}

export const ActiveTrades: React.FC<ActiveTradesProps> = ({
  trades = [],
  onCloseTrade,
  onViewDetails,
  testID,
}) => {
  const { localize } = useTranslate();
  const { trade, tradeHistory } = useTrade();
  const activeTrades = tradeHistory.filter(trade => trade.status === "open");

  const handleCloseTrade = (tradeId: string) => {
    onCloseTrade?.(tradeId);
  };

  //TODO: Implement view details
  const handleViewDetails = (tradeId: string) => {
    onViewDetails?.(tradeId);
  };

  if (activeTrades.length === 0) {
    return (
      <View style={styles.emptyContainer} testID={testID}>
        <Text variant="heading" align="center">
          {localize('no_active_trades')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} testID={testID}>
      <CollapsibleSection
        title={`${localize('active_trades')} (${activeTrades.length})`}
        defaultOpen={true}
      >
        <View>
          {activeTrades.map((trade) =>
            <TradeCard key={trade.id} trade={trade} onPress={() => handleViewDetails(trade.id.toString())} />
          )}
        </View>
      </CollapsibleSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    gap: 8,
  }
});

