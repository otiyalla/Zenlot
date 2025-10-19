import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from '@/components/atoms';
import { SearchInput, StopLossEntry, TakeProfitEntry, TradeRatio, PipInfo, ExecutionType } from '@/components/molecules';
import { useTrade } from '@/providers/TradeProvider';
import { useUser } from '@/providers/UserProvider';
import { useTranslate } from '@/hooks/useTranslate';
import { getExecutionType, getRatio, getPipValue } from '@/constants/utils';
import { useWebsocket } from '@/providers/WebsocketProvider';
import { IQuote } from '@/types';

export interface TradeEntryFormProps {
  onSymbolSelect?: (symbol: string) => void;
  onEntryChange?: (entry: number) => void;
  testID?: string;
}

export const TradeEntryForm: React.FC<TradeEntryFormProps> = ({
  onSymbolSelect,
  onEntryChange,
  testID,
}) => {
  const { trade, setTrade } = useTrade();
  const { user } = useUser();
  const { localize } = useTranslate();
  const { socket } = useWebsocket(); 
  const [available, setAvailable] = useState<IQuote[]>([]);
  const [filteredResults, setFilteredResults] = useState<IQuote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { entry: entryPrice, stopLoss, takeProfit, symbol, exchangeRate } = trade;
  const [query, setQuery] = useState<string>(symbol ?? '');
  const { accountCurrency } = user;
  const sanitized = (text: string) => {
      const sanitized = text.replace(/[^0-9.]/g, ''); // Only allow digits and one dot
      const normalized = sanitized.replace(/(\..*?)\..*/g, '$1'); // Only one dot allowed
      return normalized;
  };
  const [entry, setEntry] = useState<string>(entryPrice ? entryPrice.toString() : '');
  const { risk, reward } = getRatio(stopLoss.pips, takeProfit.pips);
  const execution = getExecutionType(Number(entryPrice), stopLoss.value, takeProfit.value);
  
  const showExecution = !!(entryPrice && stopLoss.value) || 
    !!(entryPrice && takeProfit.value) || !!(stopLoss.vralue && takeProfit.value);

  useEffect(() => {
    if (!socket) return;
    if (!available.length){
      socket.emit('list-quotes', (data: any) =>{
        console.log('emmit list quotes', data);
        setLoading(true);
      });
      socket.on('list-quote-update', (data) => {
        setAvailable(data);
        if(query.length > 0){
          const filtered = data.filter((item: any) => onSearch(item, query));
          setFilteredResults(filtered);
        }else{
          setFilteredResults(data);
        }
        setLoading(false);
      });
    }
    
    return () => {
      socket.off('list-quotes');
      setLoading(false);
    }
  }, [available.length, query]);
  
  useEffect(() => {
    if (!socket) return;
    try {
        interface PriceFeedData {
            ticker: string;
            bid: number;
            ask: number;
            open: number;
            high: number;
            low: number;
            change: number;
            date: string;
        }
    
        socket.on('quote-update', (data: PriceFeedData[]) => {
            const [instrument] = data;
            if (!!instrument?.ticker) {
                const price = execution === 'buy' ? instrument.ask : instrument.bid;
                setEntry(price.toString());
                const pips = getPipValue(price);
                setTrade((prev) => ({ ...prev, entry: price, pips: Number(pips) }));
                
            }
        });

        socket.on('exchange-rate-update', (data: PriceFeedData[]) => {
            const [instrument] = data;
            if (!!instrument?.ticker) {
                const { open } = instrument;
                setTrade((prev) => ({...prev, exchangeRate: Number(open) }))
            }
        });

        socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });

        return () => {
            socket.off('quote-update');
            socket.off('exchange-rate-update');
            socket.off('connect_error');
            console.log('WebSocket disconnected (unregistering event)');
        }
        
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
    }, []);

  const onSearchQuery = (query: string) => {
    setQuery(query.toUpperCase());
    if (query.length > 0) {
      const filtered = available.filter((item: any) => onSearch(item, query));
      setFilteredResults(filtered);
      setTrade((prev) => ({ ...prev, symbol: query.toUpperCase() }));
    }
  };

  const onSearch = useCallback((result: IQuote, pair: string) => {
        return (result.symbol.toLowerCase().includes(pair.toLowerCase())
        || result.name.toLocaleLowerCase().includes(pair.toLocaleLowerCase()))     
  }, [query]);

  const getExhangeRate = (currency: string) => {
    if (currency !== accountCurrency.toUpperCase()){
        const symbol: string = `${currency}${accountCurrency.toUpperCase()}`
        socket?.emit('get-exchange-rate', symbol);
    }
  }

  const handleSymbolSelect = (item: any) => {
    const newSymbol = item.symbol;
    setTrade((prev) => ({ ...prev, symbol: newSymbol.toUpperCase()}));
    setQuery(newSymbol);
    const currency = item.currency;
    getExhangeRate(currency);
    socket?.emit('get-quote', symbol);

    onSymbolSelect?.(newSymbol);
  };

  

  const handleEntryChange = (text: string) => {
    const value = sanitized(text);
    setEntry(value);
    const price = parseFloat(value);
    if (!isNaN(price)) {
      setTrade((prev) => ({ ...prev, entry: price }));
      onEntryChange?.(price);
    }
  };

  const handleSearch = (query: string) => {
    setTrade((prev) => ({ ...prev, symbol: query.toUpperCase() }));
  };

  const renderSearchResult = (item: any) => (
    <View>
      <Text weight="medium">{item.symbol}</Text>
      {'currency' in item && (
        <Text variant="caption" color="secondary">
          Currency: {item.currency}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container} testID={testID}>
      {/* Header with execution type and account info */}
      <View style={styles.header}>
        <View>
          <Text variant="caption" color="secondary">{localize('type')}</Text>
          {showExecution && <ExecutionType execution={execution} />}
        </View>
        
        <View style={styles.accountInfo}>
          <Text variant="caption" color="secondary">
            {localize('account_currency')}: {localize(`short_currency.${accountCurrency}`)}
          </Text>
          <Text variant="caption" color="secondary">
            {localize('rate')}: {exchangeRate.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Symbol Search */}
      <SearchInput
        value={query}
        onChangeText={onSearchQuery}
        onSelect={handleSymbolSelect}
        //onSearch={handleSearch}
        placeholder={localize('placeholder.forex')}
        renderResult={renderSearchResult}
        testID="symbol-search"
        loading={loading}
        results={filteredResults}
      />

      {/* Entry Price Input */}
      <TextInput
        placeholder={localize('placeholder.entry')}
        value={entry}
        onChangeText={handleEntryChange}
        keyboardType="decimal-pad"
        inputMode="decimal"
        testID="entry-price-input"
        aria-label={localize('placeholder.entry')}
      />

      {/* Pip Info */}
      <PipInfo /> 

      {/* Ratio */}
      {!!reward && (
        <TradeRatio risk={risk} reward={reward} />
      )}
        

      {/* Stop Loss, Ratio, and Take Profit */}
      <View style={styles.tradeLevels}>
        <StopLossEntry execution={execution} exchangeRate={exchangeRate} />
        <TakeProfitEntry execution={execution} exchangeRate={exchangeRate} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  accountInfo: {
    alignItems: 'flex-end',
  },
  tradeLevels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
});
