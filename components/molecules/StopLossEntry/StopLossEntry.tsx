import React, { useState } from 'react';
import { Box } from '@/components/design-system/ui';
import { Text } from '@/components/atoms';
import { Pressable } from '@/components/design-system/ui';
import { TextInput } from '@/components/atoms';
import { getPipDifference, getSuggestedStopLoss, getCurrencyValue, formatNumberByLocale} from '@/constants';
import { TradeEntryState, ExecutionProps } from '@/types';
import { useTranslate } from '@/hooks/useTranslate';
import { useTrade } from '@/providers/TradeProvider';
import { useUser } from '@/providers/UserProvider';

export const StopLossEntry = ({ execution, exchangeRate}: ExecutionProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const { localize } = useTranslate();
    const { trade, setTrade} = useTrade();
    const slValue = trade.stopLoss.value ? trade.stopLoss.value.toString() : '';
    const [value, setValue] = useState(slValue);
    const { symbol, entry, lot, pips: pipValue } = trade;
    const { user } = useUser();
    const { rules, language, accountCurrency } = user;
    const { stop_loss } = rules.forex;
    const stopLoss = getSuggestedStopLoss(execution, entry, pipValue, stop_loss);
    const pips = getPipDifference(entry, Number(value), pipValue);
    const currencyValue = getCurrencyValue(symbol, entry, Number(value), lot, exchangeRate);
    const loss = formatNumberByLocale(currencyValue, language, accountCurrency);

    const handleChange = (text: string) => {
        setValue(text);
        const stopLoss = text ? {
            value: Number(text),
            pips: getPipDifference(entry, Number(text), pipValue)
        } : { value: 0, pips: 0 };
        setTrade((prev) => ({ ...prev, stopLoss}));
        setIsFocused(false);
    };

    const suggestedStopLoss =  stopLoss.map(({value, pips}, index) => (
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
        <Box className="p-3 border border-outline-200 rounded-lg" style={{ borderColor: 'red' }}>
            <Text bold>{localize('forex.stop_loss')}</Text>
            <TextInput
                placeholder={localize('placeholder.loss')}
                value={value}
                onChangeText={handleChange}
                onChange={(e) => handleChange(e.nativeEvent.text)}
                onFocus={() => setIsFocused(!isFocused)}
                inputMode='decimal'
                keyboardType='decimal-pad'
                aria-label={localize('placeholder.loss')}
                testID='stop-loss-input'
            />
            {(isFocused ) && (
                <Box className="p-2 br-md shadow-2">
                    {suggestedStopLoss}
                </Box>
            )}
            { !!value.length && !isNaN(Number(value)) && (
                <Box className="border-t border-outline-500 mt-2 pt-2">
                    <Text>{localize('forex.pips')}: {pips}</Text>
                    <Text>{localize('forex.loss')}: {loss}</Text>
                </Box>
            )}
        </Box>
    );
};