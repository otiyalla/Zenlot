import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { PageTemplate } from '@/components/templates';
import { Text, Button } from '@/components/atoms';
import { CollapsibleSection } from '@/components/molecules';
import { useTranslate } from '@/hooks/useTranslate';
import { useTrade } from '@/providers/TradeProvider';

export interface TradeHistoryItem {
  id: string;
  symbol: string;
  entry: number;
  exit: number;
  pnl: number;
  pnlPercentage: number;
  execution: 'buy' | 'sell';
  entryDate: string;
  exitDate: string;
  notes?: string;
}
//TODO: REVIEW 
export interface HistoryPageProps {
  trades?: TradeHistoryItem[];
  onViewTrade?: (tradeId: string) => void;
  onExportHistory: () => void;
  onFilterTrades?: (filter: string) => void;
  testID?: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  trades = [],
  onViewTrade,
  onExportHistory,
  onFilterTrades,
  testID,
}) => {
  const { localize } = useTranslate();
  const { trade } = useTrade();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'profitable' | 'losing'>('all');

  const handleFilterChange = (filter: 'all' | 'profitable' | 'losing') => {
    setSelectedFilter(filter);
    onFilterTrades?.(filter);
  };

  const filteredTrades = trades.filter(trade => {
    switch (selectedFilter) {
      case 'profitable':
        return trade.pnl > 0;
      case 'losing':
        return trade.pnl < 0;
      default:
        return true;
    }
  });

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderTradeItem = ({ item }: { item: TradeHistoryItem }) => (
    <View style={styles.tradeItem}>
      <View style={styles.tradeHeader}>
        <View style={styles.symbolSection}>
          <Text weight="semibold" size="lg">
            {item.symbol}
          </Text>
          <Text variant="caption" color="secondary">
            {item.execution.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.pnlSection}>
          <Text 
            weight="bold" 
            size="lg"
            color={item.pnl >= 0 ? 'success' : 'error'}
          >
            {formatCurrency(item.pnl)}
          </Text>
          <Text 
            variant="caption"
            color={item.pnl >= 0 ? 'success' : 'error'}
          >
            {formatPercentage(item.pnlPercentage)}
          </Text>
        </View>
      </View>

      <View style={styles.tradeDetails}>
        <View style={styles.detailRow}>
          <Text variant="caption" color="secondary">
            {localize('entry')}
          </Text>
          <Text weight="medium">
            {formatCurrency(item.entry)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text variant="caption" color="secondary">
            {localize('exit')}
          </Text>
          <Text weight="medium">
            {formatCurrency(item.exit)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text variant="caption" color="secondary">
            {localize('entry_date')}
          </Text>
          <Text weight="medium">
            {formatDate(item.entryDate)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text variant="caption" color="secondary">
            {localize('exit_date')}
          </Text>
          <Text weight="medium">
            {formatDate(item.exitDate)}
          </Text>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesSection}>
          <Text variant="caption" color="secondary">
            {localize('notes')}
          </Text>
          <Text variant="body" style={styles.notes}>
            {item.notes}
          </Text>
        </View>
      )}

      <Button
        title={localize('view_details')}
        onPress={() => onViewTrade?.(item.id)}
        variant="outline"
        size="sm"
        //style={styles.detailsButton}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="heading" align="center">
        {localize('no_trade_history')}
      </Text>
      <Text variant="body" color="secondary" align="center">
        {localize('start_trading_message')}
      </Text>
    </View>
  );

  return (
    <PageTemplate
      title={localize('trade_history')}
      testID={testID}
    >
      <View style={styles.container}>
        {/* Filters */}
        <CollapsibleSection
          title={localize('filters')}
          defaultOpen={false}
        >
          <View style={styles.filterButtons}>
            <Button
              title={localize('all_trades')}
              onPress={() => handleFilterChange('all')}
              variant={selectedFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
            />
            <Button
              title={localize('profitable')}
              onPress={() => handleFilterChange('profitable')}
              variant={selectedFilter === 'profitable' ? 'primary' : 'outline'}
              size="sm"
            />
            <Button
              title={localize('losing')}
              onPress={() => handleFilterChange('losing')}
              variant={selectedFilter === 'losing' ? 'primary' : 'outline'}
              size="sm"
            />
          </View>
        </CollapsibleSection>

        {/* Export Actions */}
        <CollapsibleSection
          title={localize('export_data')}
          defaultOpen={false}
        >
          <View style={styles.exportActions}>
            <Button
              title={localize('export_csv')}
              onPress={onExportHistory}
              variant="outline"
              fullWidth
              //style={styles.exportButton}
            />
          </View>
        </CollapsibleSection>

        {/* Trade History */}
        <CollapsibleSection
          title={`${localize('trade_history')} (${filteredTrades.length})`}
          defaultOpen={true}
        >
          {filteredTrades.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={filteredTrades}
              keyExtractor={(item) => item.id}
              renderItem={renderTradeItem}
              style={styles.tradesList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </CollapsibleSection>
      </View>
    </PageTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  exportActions: {
    gap: 8,
  },
  exportButton: {
    marginBottom: 8,
  },
  tradesList: {
    maxHeight: 400,
  },
  tradeItem: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbolSection: {
    gap: 2,
  },
  pnlSection: {
    alignItems: 'flex-end',
    gap: 2,
  },
  tradeDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notesSection: {
    marginBottom: 12,
    gap: 4,
  },
  notes: {
    fontStyle: 'italic',
    color: '#666666',
  },
  detailsButton: {
    alignSelf: 'flex-start',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
});

