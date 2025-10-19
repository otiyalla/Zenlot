import React, { useState } from 'react';
import { Box } from '@/components/design-system/ui';
import { Text } from '@/components/atoms';
import { Pressable } from '@/components/design-system/ui';
import { TextInput } from '@/components/atoms';
import { getPipDifference, getSuggestedTakeProfit, getCurrencyValue, formatNumberByLocale } from '@/constants/utils';
import { useTranslate } from '@/hooks/useTranslate';
import { useTrade } from '@/providers/TradeProvider';
import { useUser } from '@/providers/UserProvider';
import { TradeEntryState, ExecutionProps } from '@/types';


export const TakeProfitEntry = ({ exchangeRate, execution }: ExecutionProps) => {
    const { trade, setTrade} = useTrade();
    const tpValue = trade.takeProfit.value ? trade.takeProfit.value.toString() : '';
    const [value, setValue] = useState(tpValue);
    const [isFocused, setIsFocused] = useState(false);
    const { localize } = useTranslate();
    const { symbol, entry, lot, pips: pipValue } = trade;
    const { user } = useUser();
    const { rules, language, accountCurrency } = user;
    const { take_profit } = rules.forex;
    const currencyValue = getCurrencyValue(symbol, entry, Number(value), lot, exchangeRate);
    const gain = formatNumberByLocale(currencyValue, language, accountCurrency);const pips = getPipDifference(entry, Number(value), pipValue);
    const takeProfit = getSuggestedTakeProfit(execution, entry, pipValue, take_profit);
    
    const handleChange = (text: string) => {
        setValue(text); 
        const takeProfit = text ? {
            value: Number(text),
            pips: getPipDifference(entry, Number(text), pipValue)
        } : { value: 0, pips: 0 }
                
        setTrade((prev: TradeEntryState) => {
            return { ...prev, takeProfit}
        });
        
        setIsFocused(false);
    };

    const suggestedTakeProfit =  takeProfit.map(({value, pips}, index) => (
        <Pressable
            key={index}
            onPress={() => {
                handleChange(value.toString());
            }}
        >
            <Box>
                <Text>{value}, {pips} {localize('forex.pips')}</Text>
            </Box>
        </Pressable>
    ));

    return (
        <Box className='padding-2 border rounded' style={{ borderColor: 'green' }}>
            <Text bold className='text-lg m-2'>{localize('forex.take_profit')}</Text>
            <TextInput
                placeholder={localize('placeholder.profit')}
                value={value}
                onChangeText={handleChange}
                onChange={(e) => handleChange(e.nativeEvent.text)}
                onFocus={(e) => setIsFocused(!isFocused)}
                inputMode='decimal'
                keyboardType='decimal-pad'
                aria-label={localize('placeholder.profit')}
            />
            {(isFocused ) && (
                <Box className="p-2 br-md shadow-2">
                    {suggestedTakeProfit}
                </Box>
            )}
            { !!value.length && !isNaN(Number(value)) && (
                <Box className="p-2">
                    <Text>{localize('forex.pips')}: {pips}</Text>
                    <Text>{localize('forex.gain')}: {gain}</Text>
                </Box>
            )}
        </Box>
    );
};