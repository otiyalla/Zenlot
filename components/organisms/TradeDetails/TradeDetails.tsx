import React from 'react';
import {
  Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, ButtonText, HStack, VStack, Text,
  Badge, BadgeText, Divider, Box
} from '@/components/design-system/ui';
import { extractPlainTextFromLexical } from '@/constants';
import { ExitProps, TradeEntryState } from '@/types';
import { useTranslate } from '@/hooks/useTranslate';

export type TradeDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  trade: any;
};

export const TradeDetails: React.FC<TradeDetailsProps> = ({ isOpen, onClose, trade }) => {
  const { localize } = useTranslate();
  if (!trade) return null;

  const {
    symbol, execution, status, entry, lot, pips, exchangeRate,
    stopLoss, takeProfit, createdAt, tags, editorState, plainText,
  } = trade;

  const notes = (plainText?.trim()?.length ? plainText : extractPlainTextFromLexical(editorState)) || '';

  const openedAt = createdAt;
  const openedLabel = openedAt ? new Date(openedAt).toLocaleString() : '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <HStack space="md" className="items-center flex-1 justify-between">
            <HStack space="md" className="items-center">
              <Text bold size="xl">{symbol}</Text>
              <Badge variant="solid" action={execution === 'buy' ? 'success' : 'error'} className="rounded-full">
                <BadgeText>{execution.toUpperCase()}</BadgeText>
              </Badge>
              <Badge variant="outline" className="rounded-full">
                <BadgeText>{(status ?? 'open').toString().toUpperCase()}</BadgeText>
              </Badge>
            </HStack>
            <ModalCloseButton />
          </HStack>
        </ModalHeader>

        <ModalBody>
          <VStack space="md">
            {/* Execution block */}
            <Box className={`border border-outline-200 border-l-4 p-3 rounded-lg ${
              execution === 'buy' ? 'border-l-success-600' : 'border-l-error-600'
            }`}>
              <HStack className="justify-between">
                <VStack>
                  <Text size="xs" className="text-typography-500">{localize('forex.entry')}</Text>
                  <Text bold size="lg">{entry}</Text>
                </VStack>
                <VStack>
                  <Text size="xs" className="text-typography-500">{localize('forex.lot') || 'Lot'}</Text>
                  <Text bold size="lg">{lot}</Text>
                </VStack>
                <VStack>
                  <Text size="xs" className="text-typography-500">Pips</Text>
                  <Text bold size="lg" className={pips >= 0 ? 'text-success-600' : 'text-error-600'}>
                    {pips >= 0 ? '+' : ''}{pips}
                  </Text>
                </VStack>
              </HStack>
            </Box>

            {/* SL / TP */}
            <HStack space="md">
              <Box className="flex-1 p-3 border border-outline-200 rounded-lg">
                <Text size="xs" className="text-typography-500">{localize('forex.sl')}</Text>
                <Text bold size="lg">{stopLoss?.value}</Text>
              </Box>
              <Box className="flex-1 p-3 border border-outline-200 rounded-lg">
                <Text size="xs" className="text-typography-500">{localize('forex.tp')}</Text>
                <Text bold size="lg">{takeProfit?.value}</Text>
              </Box>
            </HStack>

            {/* Optional rate & timestamps */}
            <HStack space="md">
              {exchangeRate != null && (
                <Box className="flex-1 p-3 border border-outline-200 rounded-lg">
                  <Text size="xs" className="text-typography-500">{localize('rate') || 'Rate'}</Text>
                  <Text bold size="lg">{exchangeRate}</Text>
                </Box>
              )}
              <Box className="flex-1 p-3 border border-outline-200 rounded-lg">
                <Text size="xs" className="text-typography-500">Opened</Text>
                <Text bold size="lg">{openedLabel}</Text>
              </Box>
            </HStack>

            {/* Journal notes */}
            {notes ? (
              <>
                <Divider />
                <VStack space="xs">
                  <Text size="xs" className="text-typography-500">Journal notes</Text>
                  <Text size="md">{notes}</Text>
                </VStack>
              </>
            ) : null}

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
        </ModalBody>

        <ModalFooter>
          <Button onPress={onClose}>
            <ButtonText>Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
