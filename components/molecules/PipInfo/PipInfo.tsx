import React, { useEffect, useState } from 'react';
import { TextInput, Text } from '@/components/atoms';
import { VStack, HStack } from '@/components/design-system/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { useTrade } from '@/providers/TradeProvider';
import { MIN_LOT_SIZE } from '@/constants/utils';
import { TradeEntryState } from '@/types';

export const PipInfo: React.FC<{}> = () => {
    const { trade, setTrade } = useTrade();
    const { pips: savedPips, lot } = trade;
    const [pips, setPips] = useState<string>(savedPips.toString());
    const [lotSize, setLotSize] = useState<string>(lot.toString());
    const sanitized = (text: string) => {
        const sanitized = text.replace(/[^0-9.]/g, ''); // Only allow digits and one dot
        const normalized = sanitized.replace(/(\..*?)\..*/g, '$1'); // Only one dot allowed
        return normalized;
    };
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
            setTrade((prev: TradeEntryState) => {
                return { ...prev, lot: Number(lot)}
            });
        }
    };

    const handlePips = (text: string) => {
        const pips = sanitized(text);
        setPips(pips);
        setTrade((prev: TradeEntryState) => {
            return { ...prev, pips: Number(pips)}
        });
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
                    accessibilityLabel={localize('placeholder.lot')}
                    autoCorrect={false}
                    autoComplete='off'
                />
            </VStack>
        </HStack>
    );
};
