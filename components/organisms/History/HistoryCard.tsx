import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  Box, HStack, VStack,  Badge, BadgeText,
  Divider, Pressable, ChevronRightIcon
} from '@/components/design-system/ui';
import { Colors } from '@/constants/Colors';
import { Text, Icon } from '@/components/atoms';
import { LOSS_STATUSES, WIN_STATUSES, getRatio, formatDate, getCurrencyValue, formatNumberByLocale } from '@/constants';
import { useTranslate } from '@/hooks/useTranslate';
import { TradeEntryState } from '@/types';
import { useUser } from '@/providers/UserProvider';

type HistoryCardProps = {
  trade: TradeEntryState;
  onViewDetails: (tradeId: number) => void;
  onDuplicate: (tradeId: number) => void;
  onEdit: (tradeId: number) => void;
  onDelete: (tradeId: number) => void;
};
     
export const HistoryCard: React.FC<HistoryCardProps> = ({
  trade,
  onViewDetails,
  onDuplicate,
  onEdit,
  onDelete,
}) => {
  const colorSchema = useColorScheme() as 'dark' | 'light';
  const theme = Colors[colorSchema];
  const { localize } = useTranslate();
  const { user } = useUser();
  const language = user?.language || 'en';
  const {reward} = getRatio(trade.stopLoss.pips, trade.takeProfit.pips);
  const sideColor = trade.execution === 'buy' ? theme.success : theme.danger;
  const {symbol, entry, takeProfit, stopLoss, lot, closedExchangeRate, exchangeRate} = trade;
  const profitValue = getCurrencyValue(symbol, entry, takeProfit.value, lot, (closedExchangeRate ?? exchangeRate));
  const lossValue = getCurrencyValue(symbol, entry, stopLoss.value, lot, (closedExchangeRate ?? exchangeRate));
  const profit = formatNumberByLocale(profitValue, language);
  const loss = formatNumberByLocale(lossValue, language);
  const pnlValue = WIN_STATUSES.includes(trade.status) ? profit : 
    LOSS_STATUSES.includes(trade.status) ? `-${loss}` : 0;
  const pips = WIN_STATUSES.includes(trade.status) ? trade.takeProfit.pips : LOSS_STATUSES.includes(trade.status) ? -trade.stopLoss.pips : trade.pips;
  const pnlColor = WIN_STATUSES.includes(trade.status) ? theme.success : LOSS_STATUSES.includes(trade.status) ? theme.danger : theme.placeholder;
  const getFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase();
  };
  const reward_risk = getFirstLetter(localize('forex.reward')) + ":" + getFirstLetter(localize('forex.risk'));
  const pnl = getFirstLetter(localize('forex.profit')) + "/" + getFirstLetter(localize('forex.loss'));
 


  return (
    <Pressable
      onPress={() => onViewDetails(trade.id)}
      role="button"
      accessibilityLabel={`Open ${trade.symbol} trade details`}
    >
      <Box
        className='px-4 py-3 my-2 rounded-r-[10]'
        style={{
          backgroundColor: theme.background,
          borderRadius: 8,
          borderLeftWidth: 6,
          borderLeftColor: sideColor,
          shadowColor: theme.text,
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          ...(Platform.OS === 'web' ? { boxShadow: '0 6px 18px rgba(0,0,0,0.15)' } : {}),
        }}
      >
        <HStack className = "mb-2" style={{ alignItems: "center", justifyContent:"space-between"}}>
          <HStack style={{alignItems: "center"}} space="md">
            <Text bold size="lg">{trade.symbol}</Text>
            <Badge variant="solid" action={trade.execution === 'buy' ? 'success' : 'error'} className="rounded-full">
              <BadgeText>{localize(`forex.${trade.execution}`).toUpperCase()}</BadgeText>
            </Badge>
            <Badge variant="solid" className="rounded-full">
              <BadgeText>{localize(`common.${trade.status}`).toUpperCase()}</BadgeText>
            </Badge>
          </HStack>
        </HStack>

        <HStack style={{alignItems: "center", justifyContent: "space-between"}} >
          <HStack space="lg" style={{alignItems: "baseline"}}>
            <VStack>
              <Text size="xs">{reward_risk}</Text>
              <Text bold size="md">{reward} : 1</Text>
            </VStack>
            <VStack>
              <Text size="xs" >{pnl}</Text>
              <Text bold size="md" style={{ color: pnlColor }}>
                {pips >= 0 ? '+' : ''}{pnlValue}
              </Text>
            </VStack>
            <VStack>
              <Text size="xs" >{localize('forex.pips')}</Text>
              <Text bold size="md" style={{ color: pnlColor }}>
                {pips >= 0 ? '+' : ''}{pips}
              </Text>
            </VStack>
          </HStack>

          <HStack style={{alignItems: "center"}} space="xs">
            <Text  size="xs">
              {formatDate(trade.createdAt, language)}
            </Text>
            <Icon as={ChevronRightIcon} name="chevorn-right" library='gluestack' size={18}  />
          </HStack>
        </HStack>

        {trade.plainText ? (
          <>
            <Divider className="my-3" />
            <Text size="sm" numberOfLines={2} >
              {trade.plainText}
            </Text>
          </>
        ) : null}
      </Box>
    </Pressable>
  );
}
