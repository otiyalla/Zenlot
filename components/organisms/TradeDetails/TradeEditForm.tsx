import React, { useState, useCallback, useMemo } from 'react';
import {
  HStack, VStack, Text,
  Badge, BadgeText, Divider, Box
} from '@/components/design-system/ui';
import { 
  extractPlainTextFromLexical, formatDate, 
  getExecutionType, sanitized, MIN_LOT_SIZE, getRatio,
  formatNumberByLocale, getPipDifference, getCurrencyValue
} from '@/constants';
import {  TradeEntryState } from '@/types';
import { useTranslate } from '@/hooks/useTranslate';
import { useUser } from '@/providers/UserProvider';
import { useTrade } from '@/providers/TradeProvider';
import { TextInput } from '@/components/atoms';
import { TextEditor } from '@organisms/Editor';

export type TradeEditFormProps = {
  toggleNote: boolean;
  errors?: string[];
};

export const TradeEditHeader: React.FC<{}> = ({}) => {
  const { trade, setTrade } = useTrade();
  const { localize } = useTranslate();
  if (!trade) return null;

  const {
    symbol, execution, status, entry, stopLoss, takeProfit
  } = trade as TradeEntryState;
  const newexecution = getExecutionType(Number(entry), stopLoss.value, takeProfit.value);

  if (newexecution !== execution) { 
    setTrade((prev) => ({ ...prev, execution: newexecution }));
  }

  return (
      <HStack space="md" className="items-center flex-1 justify-between">
        <HStack space="md" className="items-center">
          <Text bold size="xl">{symbol}</Text>
          <Badge variant="solid" action={newexecution === 'buy' ? 'success' : 'error'} className="rounded-full">
            <BadgeText>{localize(`forex.${newexecution}`).toUpperCase()}</BadgeText>
          </Badge>
          <Badge variant="outline" className="rounded-full">
            <BadgeText>{localize(`common.${status}`).toUpperCase()}</BadgeText>
          </Badge>
        </HStack>
      </HStack>
  );
}

export const TradeEditForm: React.FC<TradeEditFormProps> = ({ toggleNote, errors }) => {
  const { trade, setTrade } = useTrade();
  const { localize } = useTranslate();
  const { user } = useUser();
  const { language, accountCurrency } = user ?? { language: 'en' };
  if (!trade) return null;

  const {
    symbol, execution, entry: entryPrice, lot, pips, exchangeRate,
    stopLoss, takeProfit, createdAt, tags, editorState, plainText,
  } = trade as TradeEntryState;  
  const [entry, setEntry] = useState<string>(entryPrice ? entryPrice.toString() : '');
  const [lotSize, setLotSize] = useState<string>(lot.toString());
  const [tp, setTP] = useState<string>(takeProfit?.value ? takeProfit.value.toString() : '');
  const [sl, setSL] = useState<string>(stopLoss?.value ? stopLoss.value.toString() : '');
  const gainCurrency = useMemo(() => getCurrencyValue(symbol, entryPrice, Number(tp), lot, exchangeRate), [symbol, entryPrice, tp, lot, exchangeRate]);
  const lossCurrency = useMemo(() => getCurrencyValue(symbol, entryPrice, Number(sl), lot, exchangeRate), [symbol, entryPrice, sl, lot, exchangeRate]);
  const gain = useMemo(() => formatNumberByLocale(gainCurrency, language, accountCurrency), [gainCurrency, language, accountCurrency]);
  const loss = useMemo(() => formatNumberByLocale(lossCurrency, language, accountCurrency), [lossCurrency, language, accountCurrency]);
  const gainpips = useMemo(() => getPipDifference(entryPrice, Number(tp), pips), [entryPrice, tp, pips]);
  const losspips = useMemo(() => getPipDifference(entryPrice, Number(sl), pips), [entryPrice, sl, pips]);
  const { reward } = getRatio(stopLoss.pips, takeProfit.pips);
    
  const [isFocused, setIsFocused] = useState(false);
  const notes = (plainText?.trim()?.length ? plainText : extractPlainTextFromLexical(editorState)) || '';

  const openedLabel = createdAt ? formatDate(new Date(createdAt), language) : '';

  const handleEntryChange = useCallback((text: string) => {
    const value = sanitized(text);
    setEntry(value);
    const price = parseFloat(value);
    if (!isNaN(price)) {
      setTrade((prev) => ({ ...prev, entry: price }));
    }
  }, [setTrade]);

  const handleLotSize = useCallback((text: string) => {
    const value = sanitized(text);
    setLotSize(value);
    const lotNumber = parseFloat(value);
    if (!isNaN(lotNumber) && lotNumber >= Number(MIN_LOT_SIZE)) {
      setTrade((prev) => ({ ...prev, lot: lotNumber }));
    }
  }, [setTrade]);

  const handleTP = useCallback((text: string) => {
    const value = sanitized(text);
    setTP(value);
    const tpValue = parseFloat(value);
    if (!isNaN(tpValue)) {
      const newGainPips = getPipDifference(entryPrice, tpValue, pips);
      const takeProfit = {
        value: tpValue,
        pips: newGainPips
      };
      setTrade((prev) => ({ ...prev, takeProfit }));
    }
  }, [entryPrice, pips, setTrade]);

  const handleSL = useCallback((text: string) => {
    const value = sanitized(text);
    setSL(value);
    const slValue = parseFloat(value);
    if (!isNaN(slValue)) {
      const lossPips = getPipDifference(entryPrice, slValue, pips);
      const stopLoss = {
        value: slValue,
        pips: lossPips
      };
      setTrade((prev) => ({ ...prev, stopLoss }));
    }
  }, [entryPrice, pips, setTrade]);


  const handleEditorChange = useCallback((plainText: string, editorState: string) => {
    setTrade(prev => ({
      ...prev,
      plainText,
      editorState,
    }));
  }, [setTrade]);
  

  return (
    <VStack space="md">
      <Box className={`border border-outline-200 border-l-4 p-2 rounded-lg ${
        execution === 'buy' ? 'border-l-success-600' : 'border-l-error-600'
      }`}>
          <HStack className="justify-between">
            <VStack>
              <Text size="xs" className="text-typography-500">{localize('forex.entry')}</Text>
              <TextInput
              value={entry}
              keyboardType="decimal-pad"
              inputMode="decimal"
              testID="entry-price-input"
              aria-label={localize('placeholder.entry')}
              onChangeText={handleEntryChange}
              error={errors?.includes('entry')}
              />
            </VStack>
            <VStack>
              <Text size="xs" className="text-typography-500">{localize('forex.lot') || 'Lot'}</Text>
              <TextInput
                value={lotSize}
                keyboardType="decimal-pad"
                inputMode="decimal"
                testID="lot-size-input"
                aria-label={localize('placeholder.lot')}
                onChangeText={handleLotSize}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </VStack>
            <VStack>
              <Text size="xs" className="text-typography-500">{localize('forex.reward')} {localize('forex.ratio')}</Text>
              <Text bold size="lg">
              {reward} : 1
              </Text>
            </VStack>
          </HStack>
      </Box>

      <HStack space="md">
        <Box className="flex-1 p-2 border border-outline-200 rounded-lg">
          <Text size="xs" className="text-typography-500">{localize('forex.sl')}</Text>
          <TextInput
            value={sl}
            onChangeText={handleSL}
            keyboardType="decimal-pad"
            inputMode="decimal"
            testID="stop-loss-input"
            aria-label={localize('forex.sl')}
            error={errors?.includes('stopLoss')}
          />
          <VStack className="border-t border-outline-500 mt-2 pt-2">
            <Text size='sm'>{localize('forex.pips')}: {losspips}</Text>
            <Text size='sm'>{localize('forex.loss')}: {loss}</Text>
          </VStack>
        </Box>
        <Box className="flex-1 p-2 border border-outline-200 rounded-lg">
          <Text size="xs" className="text-typography-500">{localize('forex.tp')}</Text>
          <TextInput
            value={tp}
            onChangeText={handleTP}
            keyboardType="decimal-pad"
            inputMode="decimal"
            testID="take-profit-input"
            aria-label={localize('forex.tp')}
            error={errors?.includes('takeProfit')}
          />
          <VStack className="border-t border-outline-500 mt-2 pt-2">
            <Text size='sm'>{localize('forex.pips')}: {gainpips}</Text>
            <Text size='sm'>{localize('forex.gain')}: {gain}</Text>
          </VStack>
        </Box>
      </HStack>

      <HStack space="md">
        {exchangeRate != null && (
          <Box className="flex-1 p-2 border border-outline-200 rounded-lg">
            <Text size="xs" className="text-typography-500">{localize('rate')}</Text>
            <Text bold size="lg">{exchangeRate}</Text>
          </Box>
        )}
        <Box className="flex-1 p-2 border border-outline-200 rounded-lg">
          <Text size="xs" className="text-typography-500">{localize('common.opened')}</Text>
          <Text bold size="lg">{openedLabel}</Text>
        </Box>
      </HStack>

      {toggleNote && (
        <>
          <Divider />
          <VStack space="xs">
            <Text size="xs" className="text-typography-500">{localize('journal.title')}</Text>
            <TextEditor 
              plainText={plainText}
              editorState={editorState}
              onChange={handleEditorChange}
            />
            
          </VStack>
        </>
      ) }

      {/* Tags */}
      {Array.isArray(tags) && tags.length > 0 ? (
        <>
          <Divider />
          <VStack space="xs">
            <Text size="xs" className="text-typography-500">Tags</Text>
            <HStack space="sm" className="flex-wrap">
              {tags.map((t, i) => (
                <Badge key={`${t}-${i}`} variant="solid" className="rounded-full px-2 py-0.5">
                  <BadgeText>#{t}</BadgeText>
                </Badge>
              ))}
            </HStack>
          </VStack>
        </>
      ) : null}
    </VStack>
  );
}
