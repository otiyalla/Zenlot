import React, { useState, useEffect } from 'react';
import { Platform, TouchableOpacity, ScrollView } from 'react-native';
import {
  Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, VStack, HStack, Badge, BadgeText,
  Divider,
} from '@/components/design-system/ui';
import { Text, Button, TextInput } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { useUser } from '@/providers/UserProvider';
import { TradeEntryState } from '@/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, LOSS_STATUSES, WIN_STATUSES, formatDate, getCurrencyValue, getRatio, getPipDifference } from '@/constants';
import { TextEditor } from '../Editor';


interface HistoryEditProps {
  isOpen: boolean;
  onClose: () => void;
  trade: TradeEntryState;
  onSave: (updatedTrade: Partial<TradeEntryState>) => void;
}

export const HistoryEdit: React.FC<HistoryEditProps> = ({
  isOpen,
  onClose,
  trade,
  onSave,
}) => {
  if (!trade) return null;
  
  const { localize } = useTranslate();
  const colorSchema = useColorScheme() as 'dark' | 'light';
  const user = useUser().user;
  const { language } = user ?? {language: 'en'};
  const theme = Colors[colorSchema];

  // Editable field state
  const [entryStr, setEntryStr] = useState<string>(trade.entry.toString());
  const [stopLossValueStr, setStopLossValueStr] = useState<string>(trade.stopLoss.value.toString());
  const [takeProfitValueStr, setTakeProfitValueStr] = useState<string>(trade.takeProfit.value.toString());
  const [lotStr, setLotStr] = useState<string>(trade.lot.toString());
  const [closedPriceStr, setClosedPriceStr] = useState<string>(trade.closedPrice ? trade.closedPrice.toString() : '');
  const [plainText, setPlainText] = useState<string | null>(trade.plainText || null);
  const [editorState, setEditorState] = useState<string | null>(trade.editorState || null);

  // Calculated fields
  const [stopLossPips, setStopLossPips] = useState<number>(trade.stopLoss.pips);
  const [takeProfitPips, setTakeProfitPips] = useState<number>(trade.takeProfit.pips);
  const [reward, setReward] = useState<number>(trade.reward || 0);
  const [risk, setRisk] = useState<number>(trade.risk || 0);

  // Validation errors
  const [entryError, setEntryError] = useState<string>('');
  const [lotError, setLotError] = useState<string>('');

  // Auto-calculate pips when entry or stop loss/take profit values change
  useEffect(() => {
    const entry = parseFloat(entryStr);
    const stopLossValue = parseFloat(stopLossValueStr);
    const takeProfitValue = parseFloat(takeProfitValueStr);
    const closePriceValue = parseFloat(closedPriceStr);
    setClosedPriceStr(exit.toString());
    if (entry > 0 && stopLossValue > 0) {
      const slPips = getPipDifference(entry, stopLossValue, trade.pips);
      setStopLossPips(slPips);
    }

    if (entry > 0 && takeProfitValue > 0) {
      const tpPips = getPipDifference(entry, takeProfitValue, trade.pips);
      setTakeProfitPips(tpPips);
    }

    if (entry > 0 && closePriceValue > 0 && (trade.takeProfit.value !== Number(takeProfitValueStr) || trade.stopLoss.value !== Number(stopLossValueStr))) {
      const exit = WIN_STATUSES.includes(trade.status) ? Number(takeProfitValueStr) : LOSS_STATUSES.includes(trade.status) ? Number(stopLossValueStr) : 0;
      setClosedPriceStr(exit.toString());
    }

  }, [entryStr, stopLossValueStr, takeProfitValueStr, trade.pips]);

  // Auto-calculate reward when pips change
  useEffect(() => {
    if (stopLossPips > 0 && takeProfitPips > 0) {
      const { reward: calculatedReward, risk: calculatedRisk } = getRatio(stopLossPips, takeProfitPips);
      setReward(calculatedReward);
      setRisk(calculatedRisk);
    }
  }, [stopLossPips, takeProfitPips]);

  // Validation logic
  const validateFields = () => {
    let isValid = true;
    const entry = parseFloat(entryStr);
    const lot = parseFloat(lotStr);

    if (isNaN(entry) || entry <= 0) {
      setEntryError(localize('placeholder.entry'));
      isValid = false;
    } else {
      setEntryError('');
    }

    if (isNaN(lot) || lot <= 0) {
      setLotError(localize('placeholder.lot'));
      isValid = false;
    } else {
      setLotError('');
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateFields()) {
      return;
    }

    const updatedTrade: Partial<TradeEntryState> = {
      entry: parseFloat(entryStr),
      lot: parseFloat(lotStr),
      stopLoss: {
        value: parseFloat(stopLossValueStr),
        pips: stopLossPips,
      },
      takeProfit: {
        value: parseFloat(takeProfitValueStr),
        pips: takeProfitPips,
      },
      reward,
      risk,
      rr: stopLossPips > 0 ? reward / (stopLossPips % takeProfitPips || 1) : 0,
      closedPrice: closedPriceStr.length ? parseFloat(closedPriceStr) : undefined,
      plainText: plainText || undefined,
      editorState: editorState || undefined,
    };

    onSave(updatedTrade);
  };

  const handleEditorChange = (newPlainText: string, newEditorState: string) => {
    setPlainText(newPlainText);
    setEditorState(newEditorState);
  };

  const pnlColor = WIN_STATUSES.includes(trade.status) ? theme.success : LOSS_STATUSES.includes(trade.status) ? theme.danger : theme.placeholder;
  const pnlPips = WIN_STATUSES.includes(trade.status) ? `+${takeProfitPips}` : LOSS_STATUSES.includes(trade.status) ? `-${stopLossPips}`: 0;
  const exit = WIN_STATUSES.includes(trade.status) ? Number(takeProfitValueStr) : LOSS_STATUSES.includes(trade.status) ? Number(stopLossValueStr) : 0;
  const profit = getCurrencyValue(trade.symbol, Number(entryStr), exit ?? trade.closedPrice , Number(lotStr), trade.closedExchangeRate ?? trade.exechangeRate);
  const loss = getCurrencyValue(trade.symbol, Number(entryStr), exit ?? trade.closedPrice, Number(lotStr), trade.closedExchangeRate ?? trade.exechangeRate);
  const pnl = WIN_STATUSES.includes(trade.status) ? `+${profit}` : LOSS_STATUSES.includes(trade.status) ? `-${loss}` : '';
  const rrLabel = reward && localize('forex.reward').charAt(0).toUpperCase() + ':' + localize('forex.ratio').charAt(0).toUpperCase();
  const pnlLabel = pnl && localize('forex.profit').charAt(0).toUpperCase() + '/' + localize('forex.loss').charAt(0).toUpperCase();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={Platform.OS === 'ios' ? [80] : undefined}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <VStack space="md" className="w-full px-3 py-2" >
           <HStack space="md" style={{alignItems:"center"}}>
              <Text bold size="xl">{trade.symbol}</Text>
              <Badge variant="solid" action={trade.execution === 'buy' ? 'success' : 'error'} className="rounded-full">
                <BadgeText>{localize(`forex.${trade.execution}`).toUpperCase()}</BadgeText>
              </Badge>
              <Badge variant="outline" className="rounded-full">
                <BadgeText>{localize(`common.${trade.status}`).toUpperCase()}</BadgeText>
              </Badge>
            </HStack>
          <Divider />

        <ScrollView style={{maxHeight: 'auto', marginBottom: 60}} showsVerticalScrollIndicator={false}>

        
            {/* Editable Fields */}
            <VStack space="sm">
              {/* Entry Price Field */}
              <VStack space="xs">
                <Text size="xs" weight="semibold">{localize('forex.entry')}</Text>
                <TextInput
                  value={entryStr}
                  onChangeText={setEntryStr}
                  placeholder={localize('placeholder.entry')}
                  keyboardType="decimal-pad"
                  inputMode="decimal"
                  error={!!entryError}
                  helperText={entryError}
                />
              </VStack>

              {/* Stop Loss Value Field */}
              <VStack space="xs">
                <Text size="xs" weight="semibold">{localize('forex.stop_loss')}</Text>
                <TextInput
                  value={stopLossValueStr}
                  onChangeText={setStopLossValueStr}
                  placeholder={localize('placeholder.loss')}
                  keyboardType="decimal-pad"
                  inputMode="decimal"
                />
                <Text size="xs">{localize('forex.pips')}: {stopLossPips.toFixed(2)}</Text>
              </VStack>

              {/* Take Profit Value Field */}
              <VStack space="xs">
                <Text size="xs" weight="semibold">{localize('forex.take_profit')}</Text>
                <TextInput
                  value={takeProfitValueStr}
                  onChangeText={setTakeProfitValueStr}
                  placeholder={localize('placeholder.profit')}
                  keyboardType="decimal-pad"
                  inputMode="decimal"
                />
                <Text size="xs">{localize('forex.pips')}: {takeProfitPips.toFixed(2)}</Text>
              </VStack>

              {/* Lot Size Field */}
              <VStack space="xs">
                <Text size="xs" weight="semibold">{localize('forex.lot')}</Text>
                <TextInput
                  value={lotStr}
                  onChangeText={setLotStr}
                  placeholder={localize('placeholder.lot')}
                  keyboardType="decimal-pad"
                  inputMode="decimal"
                  error={!!lotError}
                  helperText={lotError}
                />
              </VStack>
            </VStack>

            <Divider className='my-3'/>

            {/* Reward Ratio Display */}
            <HStack style={{justifyContent:"space-between"}}>
              <VStack>
                <Text size="xs">{rrLabel}</Text>
                <Text bold>{reward.toFixed(2)} : 1</Text>
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

            <Divider className='my-3'/>
            <VStack space="xs">
              <Text size="xs">{localize('journal')}</Text>
              <TextEditor 
                plainText={plainText}
                editorState={editorState}
                onChange={handleEditorChange}
              />
            </VStack>

            <Divider className='my-2' />

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

            <HStack space="sm" style={{ marginTop: 12 }}>
              <Button
                size='sm'
                title={localize('common.cancel')}
                variant="outline" 
                onPress={onClose}
              />
              <Button
                size='sm'
                title={localize('common.save')}
                variant="primary"
                onPress={handleSave}
                disabled={!!entryError || !!lotError}
              />
            </HStack>
        </ScrollView>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}
