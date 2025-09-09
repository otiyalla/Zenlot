import React, { useEffect, useState, useCallback } from 'react';
import {StopLossEntry, TakeProfitEntry, TradeRatio, PipInfo, ExecutionType} from '@/components/molecules';
import Search  from '@/components/atoms/Search';
import { TextInputComponent } from '@/components/atoms/TextInput';
import { getExecutionType, getRatio, getPipValue } from '@/constants/utils';
import { VStack, HStack, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { useUser } from '@/providers/UserProvider';
import { useTrade } from '@/providers/TradeProvider';
import { useWebsocket } from '@/providers/WebsocketProvider';
import { View } from 'react-native';
import { IQuote, TradeEntryState } from '@/types';


const TradeEntry: React.FC<{}> = () => {
    const { trade, setTrade } =  useTrade();
    const { entry: entryPrice, stopLoss, takeProfit, symbol, exchangeRate: rate } = trade;
    const [entry, setEntry] = useState<string>(entryPrice ? entryPrice.toString() : '');
    const [pair, setPair] = useState<string>(symbol);
    const [exchangeRate, setExchangeRate] = useState<number>(rate);
    const { user } = useUser();
    const { accountCurrency } = user;
    const {localize} = useTranslate();
    const { risk, reward } = getRatio(stopLoss.pips, takeProfit.pips);
    const showExecution: boolean = !!(entryPrice && stopLoss.value) || !!(entryPrice && takeProfit.value) || !!(stopLoss.value && takeProfit.value);
    const execution = getExecutionType(Number(entryPrice), stopLoss.value, takeProfit.value);
    const { socket, isConnected } = useWebsocket();
    const [socketError, setSocketError] = useState<string | null>(null);
    
    
    useEffect(() => {
        if (!socket || !isConnected) return;
        
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
                    setTrade((prev: TradeEntryState) => {
                        return { ...prev, entry: price, pips: Number(pips)}
                    })
                }
            });

            socket.on('exchange-rate-update', (data: PriceFeedData[]) => {
                const [instrument] = data;
                if (!!instrument?.ticker) {
                    const { open } = instrument;
                    setExchangeRate(Number(open));
                    setTrade((prev: TradeEntryState) => {
                        return { ...prev, exchangeRate: Number(open)}
                    })
                }
            });

            socket.on('connect_error', (error) => {
                console.error('WebSocket connection error:', error);
                setSocketError('Connection failed');
            });

            return () => {
                socket.off('quote-update');
                socket.off('exchange-rate-update');
                socket.off('connect_error');
                console.log('WebSocket disconnected (unregistering event)');
            }
            
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
            setSocketError('Connection failed');
        }
    }, []);

    const onSearch = useCallback((result: IQuote, pair: string) => {
        return (result.symbol.toLowerCase().includes(pair.toLowerCase())
        || result.name.toLocaleLowerCase().includes(pair.toLocaleLowerCase()))     
    }, [pair])
    
    const handleEntryPriceChange = (text: string) => {
        setEntry(text);
        const price = parseFloat(text);
        if (!isNaN(price)) {
            setTrade((prev: TradeEntryState) => {
                return { ...prev, entry: price, symbol: pair}
            })
        }
    };

    const getExhangeRate = (currency: string) => {
        if (currency !== accountCurrency.toUpperCase()){
            const symbol: string = `${currency}${accountCurrency.toUpperCase()}`
            socket?.emit('get-exchange-rate', symbol);
        } else setExchangeRate(1);
    }

    const onSelect = (item: unknown) => {
        console.log('onSelect: ', item, "the pair: ", pair);
        if (typeof item === 'object' && item !== null && 'symbol' in item) {
            const { symbol, currency } = item as IQuote;
            onSymbolChange(symbol);
            getExhangeRate(currency);
            socket?.emit('get-quote', symbol);
        }
    };

    const onSymbolChange = (text: string) => {
        setPair(text.toUpperCase());
        setTrade((prev: TradeEntryState) => {
            return { ...prev, symbol: text.toUpperCase()}
        })
    };

    const renderSearchItem = (results: IQuote) => {
        return (
            <View>
                <Text>{results.symbol} Currency: {results.currency}</Text>
            </View>
        )
    }

    return (
        <>
            <HStack space='sm' style={{ marginBottom: 10, justifyContent: 'space-between' }}>
                <VStack>
                    <Text>{localize('type')}</Text>
                    {showExecution && (<ExecutionType execution={execution}/>)}
                </VStack>
                <VStack space='xs'>
                    <Text>{localize('account_currency')}: {localize(`short_currency.${accountCurrency}`)}</Text>
                    <Text>{localize('rate')}: {exchangeRate.toFixed(2)}</Text>
                </VStack>
            </HStack>
            <Search query={pair} onChangeText={onSymbolChange} onSelect={onSelect} placeholderText={localize('placeholder.forex')} onSearch={onSearch} renderSearchItem={renderSearchItem} />
            <Text className='pl-[10]'>{localize('forex.entry_price')}</Text>
            <TextInputComponent 
                placeholder={localize('placeholder.entry')}
                value={entry}
                onChangeText={handleEntryPriceChange}
                keyboardType='decimal-pad'
                inputMode='decimal'
                aria-label={localize('placeholder.entry')}
            />
            <PipInfo/>
            <HStack space='xs' style={{ margin: 5, justifyContent: 'space-between' }}>
                <StopLossEntry execution={execution} exchangeRate={exchangeRate} />
                {!!reward && (<TradeRatio risk={risk} reward={reward}/>)}
                <TakeProfitEntry execution={execution}  exchangeRate={exchangeRate} />
            </HStack>
        </>
    );
};

export default TradeEntry;