import React from 'react';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslate } from '@/hooks/useTranslate';
import { TradeRatioProps } from '@/types';


const TradeRatio: React.FC<TradeRatioProps> = ({ risk, reward }) => {
    const { localize } = useTranslate();
    
    return (
       <VStack space='xs' style={{  justifyContent: 'space-evenly' }}>
            <Text>{localize('forex.tp')} & {localize('forex.sl')} {localize('forex.ratio')}</Text>
            <Text>{ reward } : 1</Text>
            <Text>{localize('forex.risk')}: {risk}</Text>
            <Text>{localize('forex.reward')}: {reward}</Text>
        </VStack>
    );
};

export default TradeRatio;