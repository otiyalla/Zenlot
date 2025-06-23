import React from 'react';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslate } from '@/hooks/useTranslate';

interface TradeRatioProps {
    risk: number;
    reward: number;
    language: 'en' | 'fr';
}

const TradeRatio: React.FC<TradeRatioProps> = ({ language, risk, reward }) => {
    const { localize } = useTranslate(language);
    return (
       <VStack space='xs' style={{  justifyContent: 'space-evenly' }}>
            <Text bold>{localize('forex.ratio')}</Text>
            <Text>{ reward } : 1</Text>
            <Text bold>{localize('forex.risk')}: {risk}</Text>
            <Text bold>{localize('forex.reward')}: {reward}</Text>
        </VStack>
    );
};

export default TradeRatio;