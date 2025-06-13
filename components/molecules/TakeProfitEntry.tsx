import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { TextInputComponent } from '@/components/atoms/TextInput';
import { getPipDifference, getSuggestedTakeProfit, getCurrencyValue } from '@/constants/utils';
import { type ExitProps } from '@/types/forex';
import { useTranslate } from '@/hooks/useTranslate';

interface TakeProfitEntryProps {
    TP_RULES: {pips: number}[];
    entry: number;
    pipValue: number;
    execution: 'buy' | 'sell';
    lotSize: number;
    exchangeRate: number;
    onChange: React.Dispatch<React.SetStateAction<ExitProps>>;
    lang?: 'en' | 'fr';
}

const TakeProfitEntry = ({ lang, entry, pipValue, lotSize, exchangeRate, execution, TP_RULES, onChange }: TakeProfitEntryProps) => {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const takeProfit = getSuggestedTakeProfit(execution, entry, pipValue, TP_RULES);
    const pips = getPipDifference(entry, Number(value), pipValue);
    const currencyValue = getCurrencyValue(entry, Number(value), pipValue, lotSize, exchangeRate);
    const { localize } = useTranslate(lang);
    
    const handleChange = (text: string) => {
        setValue(text); 
        onChange(text ? {
            value: Number(text),
            pips: getPipDifference(entry, Number(text), pipValue)
        } : { value: 0, pips: 0 });
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
            <Text bold className='text-lg m-2'>{localize('forex.profit')}</Text>
            <TextInputComponent
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
                    <Text>{localize('forex.gain')}: {currencyValue}</Text>
                </Box>
            )}
        </Box>
    );
};

export default TakeProfitEntry;