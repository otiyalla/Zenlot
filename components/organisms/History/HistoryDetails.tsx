import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import {
  Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, VStack, HStack, Badge, BadgeText,
  Divider, TrashIcon, EditIcon, ShareIcon
} from '@/components/design-system/ui';
import { Text, Icon, Button } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { useUser } from '@/providers/UserProvider';

import { TradeEntryState } from '@/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, LOSS_STATUSES, WIN_STATUSES, formatDate, getCurrencyValue } from '@/constants';


interface HistoryDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  trade: TradeEntryState;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onShare?: (id: number) => void;
}

export const HistoryDetails: React.FC<HistoryDetailsProps> = ({
  isOpen,
  onClose,
  trade,
  onEdit,
  onDelete,
  onShare,
}) => {
  if (!trade) return null;
  const { localize } = useTranslate();
  const colorSchema = useColorScheme() as 'dark' | 'light';
  const user = useUser().user;
  const { language } = user ?? {language: 'en'};
  const theme = Colors[colorSchema];
  const pnlColor = WIN_STATUSES.includes(trade.status) ? theme.success : LOSS_STATUSES.includes(trade.status) ? theme.danger : theme.placeholder;
  
  const pnlPips = WIN_STATUSES.includes(trade.status) ? `+${trade.takeProfit.pips}` : LOSS_STATUSES.includes(trade.status) ? `-${trade.stopLoss.pips }`: 0;
  const exit = WIN_STATUSES.includes(trade.status) ? trade.takeProfit.value : LOSS_STATUSES.includes(trade.status) ? trade.stopLoss.value : 0;
  const profit = getCurrencyValue(trade.symbol, trade.entry, trade.closedPrice ?? exit, trade.lot, trade.closedExchangeRate ?? trade.exechangeRate);
  const loss = getCurrencyValue(trade.symbol, trade.entry, trade.closedPrice ?? exit, trade.lot, trade.closedExchangeRate ?? trade.exechangeRate);
  const pnl = WIN_STATUSES.includes(trade.status) ? `+${profit}` : LOSS_STATUSES.includes(trade.status) ? `-${loss}` : 0;
  const rrLabel = trade.reward && localize('forex.reward').charAt(0).toUpperCase() + ':' + localize('forex.ratio').charAt(0).toUpperCase();
  const pnlLabel = pnl && localize('forex.profit').charAt(0).toUpperCase() + '/' + localize('forex.loss').charAt(0).toUpperCase();

  
  const sideOptions = [
    { onPress: onShare, icon: <Icon library='gluestack' name='share' as={ShareIcon} /> },
    { onPress: onEdit, icon: <Icon library='gluestack' name='edit' as={EditIcon} /> },
    { onPress: onDelete, icon: <Icon library='gluestack' name='trash' as={TrashIcon} /> }
  ];

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={Platform.OS === 'ios' ? [80] : undefined}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <VStack space="md" className="w-full px-3 py-2">
          <HStack style={{justifyContent:"space-between", alignItems:"center"}}>
            <HStack space="md" style={{alignItems:"center"}}>
              <Text bold size="xl">{trade.symbol}</Text>
              <Badge variant="solid" action={trade.execution === 'buy' ? 'success' : 'error'} className="rounded-full">
                <BadgeText>{localize(`forex.${trade.execution}`).toUpperCase()}</BadgeText>
              </Badge>
              <Badge variant="outline" className="rounded-full">
                <BadgeText>{localize(`common.${trade.status}`).toUpperCase()}</BadgeText>
              </Badge>
            </HStack>
            <HStack testID='side-action-buttons' space="sm">
                {sideOptions.map(({onPress, icon}, index) => (
                  onPress && (
                    <TouchableOpacity key={`${index}-side-action-button`} onPress={() => onPress(trade.id)}>
                      {icon}
                    </TouchableOpacity>
                  )))
                }
            </HStack>
          </HStack>
          <Divider />
          <HStack style={{justifyContent:"space-between"}}>
            <VStack>
              <Text size="xs">{localize('forex.entry')}</Text>
              <Text bold>{trade.entry}</Text>
            </VStack>
            <VStack>
              <Text size="xs">{localize('forex.stop_loss')}</Text>
              <Text bold>{trade.stopLoss.value}</Text>
            </VStack>
            <VStack>
              <Text size="xs">{localize('forex.take_profit')}</Text>
              <Text bold>{trade.takeProfit.value}</Text>
            </VStack>
            <VStack>
              <Text size="xs">{localize('forex.lot')}</Text>
              <Text bold>{trade.lot}</Text>
            </VStack>
          </HStack>

          <HStack style={{justifyContent:"space-between"}}>
            <VStack>
              <Text size="xs">{rrLabel}</Text>
              <Text bold>{trade.reward} : 1</Text>
            </VStack>
            <VStack>
              {!!pnl && (
                <>
                  <Text size="xs">{pnlLabel}</Text>
                  <Text bold style={{ color: pnlColor }}>
                    {pnl}
                  </Text>
                </>)
              }
            </VStack>
            <VStack>
              {
                !!pnl && (<>
                  <Text size="xs">{localize('forex.pips')}</Text>
                  <Text bold style={{ color: pnlColor }}>
                    {pnlPips}
                  </Text>
                </>)
              }
            </VStack>
            {trade.exchangeRate != null && (
              <VStack>
                <Text size="xs">{localize('rate')}</Text>
                <Text bold>{trade.exchangeRate}</Text>
              </VStack>
            )}
          </HStack>

          {!!trade.plainText && (
            <>
              <Divider />
              <VStack space="xs">
                <Text size="xs">{localize('journal.name')}</Text>
                <Text>{trade.plainText}</Text>
              </VStack>
            </>
          )}

          <Divider />

          <HStack style={{justifyContent:"space-between"}}>
            <VStack>
              <Text size="xs">{localize('common.opened')}</Text>
              <Text size="xs" bold>{formatDate(new Date(trade.createdAt), language, true)}</Text>
            </VStack>
            {trade.updatedAt && (
              <VStack>
                <Text size="xs">{localize('last_update')}</Text>
                <Text size="xs" bold>{formatDate(new Date(trade.updatedAt), language, true)}</Text>
              </VStack>
            )}
          </HStack>
          <Button
            size='sm'
            title={localize('common.close')}
            variant="outline-danger" 
            onPress={onClose}
           />
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}
