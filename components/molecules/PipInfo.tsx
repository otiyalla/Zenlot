import React, { useState, Dispatch, SetStateAction } from 'react';
import { TextInputComponent } from '@/components/atoms/TextInput';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useTranslate } from '@/hooks/useTranslate';

interface PipInfoProps {
    handlePipChange: Dispatch<SetStateAction<number>>
    handleLotChange: Dispatch<SetStateAction<number>>
    language?: 'en' | 'fr';
}

const PipInfo: React.FC<PipInfoProps> = ({language, handleLotChange, handlePipChange}) => {
    const [pips, setPips] = useState<string>("0.0001");
    const [lotSize, setLotSize] = useState<string>('0.01');
    const MIN_LOT_SIZE = '0.01';
    const sanitized = (text: string) => {
        const sanitized = text.replace(/[^0-9.]/g, ''); // Only allow digits and one dot
        const normalized = sanitized.replace(/(\..*?)\..*/g, '$1'); // Only one dot allowed
        return normalized;
    };
    const { localize } = useTranslate(language);

    const handleLotSize = (text: string) => {
        const lot = sanitized(text);
        setLotSize(lot);
        if (lot >= MIN_LOT_SIZE) handleLotChange(Number(lot));
    };

    const handlePips = (text: string) => {
        const pips = sanitized(text);
        setPips(pips);
        handlePipChange(Number(pips));
    }

    return (
        <HStack space='md'className='border rounded-[10]' style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, margin: 5, justifyContent: 'space-between' }}>
            <VStack className='w-1/2'>
                <Text className='pl-[10]'>{localize('forex.pip_value')}</Text>
                <TextInputComponent
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
                <TextInputComponent
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

export default PipInfo;