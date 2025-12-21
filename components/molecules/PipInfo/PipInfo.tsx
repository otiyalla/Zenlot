import React, { useEffect, useState } from 'react';
import { TextInput, Text } from '@/components/atoms';
import { VStack, HStack } from '@/components/design-system/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { useTrade } from '@/providers/TradeProvider';
import { MIN_LOT_SIZE, sanitized } from '@/constants';

export const PipInfo: React.FC<{}> = () => {
    const { trade, setTrade } = useTrade();
    const { pips: savedPips, lot } = trade;
    const [pips, setPips] = useState<string>(savedPips.toString());
    const [lotSize, setLotSize] = useState<string>(lot.toString());
    const { localize } = useTranslate();
 
    useEffect(() => {
        if(savedPips.toString() !== pips && !isNaN(savedPips)){
            setPips(savedPips.toString())
        }
        if(lot.toString() !== lotSize && !isNaN(lot)){
            setLotSize(lot.toString())
        }
    }, [savedPips, lot])

    const handleLotSize = (text: string) => {
        const lot = sanitized(text);
        setLotSize(lot);
        if (lot >= MIN_LOT_SIZE){
            setTrade((prev) => ({ ...prev, lot: Number(lot)}));
        }
    };

    const handlePips = (text: string) => {
        const pips = sanitized(text);
        setPips(pips);
        setTrade((prev) => ({ ...prev, pips: Number(pips)}));
    }

    return (
        <HStack space='md'className='border rounded-[10]' style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, margin: 5, justifyContent: 'space-between' }}>
            <VStack className='w-1/2'>
                <Text className='pl-[10]'>{localize('forex.pip_value')}</Text>
                <TextInput
                    placeholder={localize('placeholder.pips')}
                    value={pips.toString()}
                    onChangeText={handlePips}
                    keyboardType="decimal-pad"
                    inputMode="decimal"
                    testID='pips-size-input'
                    accessibilityLabel={localize('placeholder.pips')}
                    autoCorrect={false}
                    autoComplete='off'
                />
            </VStack>
            <VStack className='w-1/2 pr-3'>
                <Text className='pl-[10]'>{localize('forex.lot')}</Text>
                <TextInput
                    placeholder={localize('placeholder.lot')}
                    value={lotSize}
                    onChangeText={handleLotSize}
                    keyboardType="decimal-pad"
                    inputMode="decimal"
                    testID="lot-size-input"
                    accessibilityLabel={localize('placeholder.lot')}
                    autoCorrect={false}
                    autoComplete='off'
                />
            </VStack>
        </HStack>
    );
};
