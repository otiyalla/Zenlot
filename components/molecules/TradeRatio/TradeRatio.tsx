import React, { useEffect } from 'react';
import { Text } from '@/components/atoms';
import { VStack, HStack } from '@/components/design-system/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { TradeRatioProps } from '@/types';
import { useTrade } from '@/providers/TradeProvider';

export const TradeRatio: React.FC<TradeRatioProps> = ({ risk, reward }) => {
    const { localize } = useTranslate();
    const { setTrade } = useTrade();

    useEffect(() => {
        setTrade((prev) => ({ ...prev, rr: reward / risk, reward, risk  }));
    }, [risk, reward]);
    
    return (
       <HStack space='xs' style={{  justifyContent: 'space-between' }}>
            <VStack>
                <Text>{localize('forex.tp')} & {localize('forex.sl')} {localize('forex.ratio')}</Text>
                <Text>{ reward } : 1</Text>
            </VStack>
            <VStack>
                <Text>{localize('forex.risk')}: {risk}</Text>
                <Text>{localize('forex.reward')}: {reward}</Text>
            </VStack>
        </HStack>
    );
};