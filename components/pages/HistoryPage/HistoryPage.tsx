import React, { useState, useMemo, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { PageTemplate } from '@/components/templates';
import { Text, TextInput, Icon, Button } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { Colors, LOSS_STATUSES, WIN_STATUSES } from '@/constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ExitProps, TradeEntryState } from '@/types';
import { useTrade } from '@/providers/TradeProvider';
import {
  ScrollView,
  HStack,
  VStack,
  Box,
  SearchIcon
} from '@/components/design-system/ui';
import { HistoryCard, HistoryDetails, HistoryEdit } from '@/components/organisms';

export interface TradeHistoryItem extends TradeEntryState {
  stopLoss: ExitProps;
  takeProfit: ExitProps;
  status: 'open' | 'close' | 'closed' | 'reached_tp' | 'reached_sl' | 'pending' | 'closed_in_profit' | 'closed_in_loss';
  [key: string]: any; // For extensibility
}


export interface HistoryPageProps {
  trades?: TradeHistoryItem[];
  onViewTrade?: (tradeId: number) => void;
  onExportHistory: () => void;
  onFilterTrades?: (filter: string) => void;
  testID?: string;
  pageSize?: number;
  onLoadMore?: () => void;
  loading?: boolean;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  trades = [],
  onViewTrade,
  onExportHistory,
  onFilterTrades,
  testID,
  pageSize = 5,
  onLoadMore,
  loading = false,
}) => {
  const { localize } = useTranslate();
  const { editTrade, deleteTrade } = useTrade();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'profitable' | 'losing' | 'recent' | 'thisWeek' | 'thisMonth'>('all');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const theme = Colors[useColorScheme() as 'light' | 'dark'];
  const [ isOpen, setIsOpen] = useState<boolean>(false);
  const [ viewTradeId, setViewTradeId] = useState<number | null>(null);
  const [ editTradeId, setEditTradeId] = useState<number | null>(null);

  // Quick search filters
  const quickFilters = [
    { key: 'all', label: 'all_trades' },
    { key: 'profitable', label: 'wins' },
    { key: 'losing', label: 'losses' },
    { key: 'recent', label: 'recent' },
    { key: 'thisWeek', label: 'this_week' },
    { key: 'thisMonth', label: 'this_month' },
  ];

  const filteredTrades = useMemo(() => {
    let result = trades;
    
    // Apply filter based on selected filter
    switch (selectedFilter) {
      case 'profitable':
        result = result.filter(trade => WIN_STATUSES.includes(trade.status));
        break;
      case 'losing':
        result = result.filter(trade => LOSS_STATUSES.includes(trade.status));
        break;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        result = result.filter(trade => new Date(trade.timestamp) >= oneWeekAgo);
        break;
      case 'thisWeek':
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        result = result.filter(trade => new Date(trade.createdAt) >= startOfWeek);
        break;
      case 'thisMonth':
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        result = result.filter(trade => new Date(trade.createdAt) >= startOfMonth);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }
    
    // Apply text search
    if (search.trim()) {
      const lowerSearch = search.trim().toLowerCase();
      result = result.filter(
        trade =>
          trade.symbol.toLowerCase().includes(lowerSearch) ||
          trade.plainText?.toLowerCase().includes(lowerSearch) ||
          localize(`forex.${trade.execution}`).toLowerCase().includes(lowerSearch) ||
          localize(`common.${trade.status}`).toLowerCase().includes(lowerSearch)
      );
    }
    
    return result;
  }, [trades, selectedFilter, search]);

  const visibleTrades = filteredTrades.slice(0, visibleCount);

  const handleFilterChange = useCallback((filter: 'all' | 'profitable' | 'losing' | 'recent' | 'thisWeek' | 'thisMonth') => {
    setSelectedFilter(filter);
    onFilterTrades?.(filter);
    setVisibleCount(pageSize); // Reset lazy loading on filter change
  }, [onFilterTrades, pageSize]);

  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
    setVisibleCount(pageSize); // Reset lazy loading on search
  }, [pageSize]);

  const handleLoadMore = useCallback(async () => {
    if (visibleCount < filteredTrades.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setVisibleCount(prev => prev + pageSize);
      try {
        await onLoadMore?.();
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [visibleCount, filteredTrades.length, isLoadingMore, pageSize, onLoadMore]);

  const handleViewTrade = useCallback((tradeId: number) => {
    onViewTrade?.(tradeId);
    if (viewTradeId !== tradeId) setViewTradeId(tradeId);
    if (viewTradeId === tradeId) setViewTradeId(null);

  }, [onViewTrade]);

  const handleDeleteTrade = useCallback(async (tradeId: number) => {
    try {
      await deleteTrade(tradeId);
      setViewTradeId(null);
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  }, [deleteTrade]);

  // Loading component for lazy loading states
  const renderLoadingItem = () => (
    <Box className="bg-background-100 p-4 rounded-lg mb-3 border border-outline-200">
      <HStack className="justify-between items-center mb-3">
        <VStack className="gap-1">
          <Box className="h-5 w-20 bg-background-200 rounded" />
          <Box className="h-3 w-12 bg-background-200 rounded" />
        </VStack>
        <VStack className="items-end gap-1">
          <Box className="h-5 w-16 bg-background-200 rounded" />
          <Box className="h-3 w-12 bg-background-200 rounded" />
        </VStack>
      </HStack>
      <VStack className="gap-2 mb-3">
        <HStack className="justify-between">
          <Box className="h-3 w-12 bg-background-200 rounded" />
          <Box className="h-3 w-16 bg-background-200 rounded" />
        </HStack>
        <HStack className="justify-between">
          <Box className="h-3 w-12 bg-background-200 rounded" />
          <Box className="h-3 w-16 bg-background-200 rounded" />
        </HStack>
        <HStack className="justify-between">
          <Box className="h-3 w-16 bg-background-200 rounded" />
          <Box className="h-3 w-20 bg-background-200 rounded" />
        </HStack>
      </VStack>
      <Box className="h-8 w-full bg-background-200 rounded" />
    </Box>
  );
  const renderTradeItem = ({ item }: { item: TradeHistoryItem }) => {
    
    if (editTradeId === item.id) {
      return (
        <HistoryEdit
          trade={item}
          isOpen={true}
          onClose={() => setEditTradeId(null)}
          onSave={async (updatedTrade) => {
            try {
              await editTrade(item.id, { ...item, ...updatedTrade } as TradeEntryState);
              setEditTradeId(null);
            } catch (error) {
              console.error('Error saving trade:', error);
            }
          }}
        />
      );
    }
    
    if (viewTradeId === item.id) {
      return (
        <HistoryDetails
          trade={item}
          isOpen={true}
          onClose={() => setViewTradeId(null)}
          onEdit={() => {
            setViewTradeId(null);
            setEditTradeId(item.id);
          }}
          onDelete={handleDeleteTrade}
          onShare={() => {}}
        />
      );
    }

    return (
      <HistoryCard
        trade={item}
        onViewDetails={() => handleViewTrade(item.id)}
        onDuplicate={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
  };

  const renderEmptyState = () => (
    <VStack className="p-8 items-center gap-2">
      <Text size={'xl'} weight='semibold' align='center'>{localize('no_trade_history')}</Text>
      <Text weight='medium' align='center'>{localize('start_trading_message')}</Text>
    </VStack>
  );

  const renderQuickFilter = (filter: { key: string; label: string }) => {
    const isSelected = selectedFilter === filter.key;
    return (
      <TouchableOpacity
        key={filter.key}
        style={{
          borderWidth: 1,
          borderColor: isSelected ? theme.secondary : theme.borderColor,
          backgroundColor: isSelected ? theme.secondary : 'transparent',
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 8,
        }}
        onPress={() => handleFilterChange(filter.key as any)}
      >
        <Text weight='semibold'>{localize(filter.label)}</Text>
      </ TouchableOpacity>
    );
  }

  return (
    <PageTemplate title={localize('history')} testID={testID}>
      <VStack className="flex-1">


        {/* Search Input */}
        <Box className="mb-2">
          <TextInput
            variant='filled'
            value={search}
            onChangeText={handleSearchChange}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={localize('search_trades')}
            rightIcon={<Icon name='search' size={18} library='gluestack' as={SearchIcon}/>}
            testID="trade-search-input"
            helperText={localize('search_trades_helper_text')}
          />
        </Box>

        {/* Horizontal Quick Search Filters */}
        <Box className="mb-4">
          
          <Text className="text-lg font-semibold mb-3 text-typography-900">{localize('quick_search')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 4, flexDirection: 'row' }}
          >
            {quickFilters.map((filter) => renderQuickFilter(filter))}
          </ScrollView>
        </Box>

        {/* Trade History */}
        <Box className="flex-1">
          <HStack className="justify-between items-center mb-3">
            <Text size={'lg'} weight='semibold'>
              {localize('trade_history')}
            </Text>
            <Text size={'sm'} weight='medium'>
              {filteredTrades.length} {localize('trades')}
            </Text>
          </HStack>
          
          {filteredTrades.length === 0 ? (
            renderEmptyState()
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={true}
              onMomentumScrollEnd={async (event) => {
                // ScrollView doesn't have onEndReached, consider using scroll position
                // But we'll just leave this as non-paginating for now.
                // To simulate pagination/lazy load manually, user must scroll and click a "Load more"
              }}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {visibleTrades.map((item, ind) => (
                <Box key={`${item.id}-i-${ind}`}>
                  {renderTradeItem({ item })}
                </Box>
              ))}
              {isLoadingMore ? (
                <VStack className="gap-2 mt-4">
                  {Array(3).fill(0).map((_, index) => (
                    <Box key={index}>
                      {renderLoadingItem()}
                    </Box>
                  ))}
                </VStack>
              ) : null}
              {/* If there are more to load, show a "Load More" button */}
              {visibleCount < filteredTrades.length && !isLoadingMore && (
                <VStack style={{ marginTop: 16, alignSelf: 'center' }}>
                  <Button
                    onPress={handleLoadMore}
                    title={localize('load_more')}
                    size="md"
                    variant="outline"
                    testID="history-load-more-btn"
                  />
                </VStack>
              )}
            </ScrollView>
          )}
        </Box>
      </VStack>
    </PageTemplate>
  );
};
