import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text} from '@/components/atoms';
import { PageTemplate, ModalTemplate} from '@/components/templates';
import { TradingAnalysis, TradeEntryForm, ActiveTrades } from '@/components/organisms';
import { useTranslate } from '@/hooks/useTranslate';
import { useNetwork } from '@/hooks/useNetwork';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { tradeValidation } from '@/validations';
import { useTrade } from '@/providers/TradeProvider';
import { parseErrors } from '@/constants/utils';
import { z } from 'zod';

export interface HomePageProps {
  onNavigateToProfile?: () => void;
  onNavigateToHistory?: () => void;
  testID?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToProfile,
  onNavigateToHistory,
  testID,
}) => {
  const { localize } = useTranslate();
  const { isOnline } = useNetwork();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const {trade, resetTrade, submitTrade, refreshTrades } = useTrade();

  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tradeError, setTradeError] = useState<string>("");
  const [errorsFields, setErrorsFields] = useState<string[]>([]);

  const handleOpenTradeModal = () => {
    setIsTradeModalOpen(true);
  };

  const handleCloseTradeModal = () => {
    setIsTradeModalOpen(false);
    //setShow(false);
    setTradeError('');
    setErrorsFields([]);
    resetTrade();
  };

  const handleConfirm = () => {
    try {
        const validated = tradeValidation.parse(trade);
        submitTrade(validated);
        handleCloseTradeModal();
    } catch (error) {
        if (error instanceof z.ZodError) {
          const prettifyError = z.prettifyError(error);
          console.log("create trade error: ", prettifyError);
          const {errorFields, errorMessage} = parseErrors(JSON.parse(error.message));
          setErrorsFields(errorFields);
          const message = errorMessage[errorFields[0]];
          setTradeError(message);
        } else {
          setTradeError('Invalid trade');
          console.error('trade entry error:', error);
        }
    }
    };

  const onRefresh = useCallback(async () => {
      setRefreshing(true);
      try {
        refreshTrades();
      } catch (error) {
        console.error('Failed to refresh trades:', error);
      } finally {
        setRefreshing(false);
      }
  }, [refreshTrades]);

  const modalActions = [
    {
      title: localize('common.confirm'),
      onPress: handleConfirm,
      variant: 'primary' as const,
    },
  ];

  return (
    <PageTemplate
    title="Zenlot"
    testID={testID}
    refreshing={refreshing}
    onRefresh={onRefresh}
    >
        {/* Network Status */}
        {!isOnline && (
          <View style={[styles.networkStatus, { backgroundColor: theme.error }]}>
            <Text color="inverse" align="center">
              {localize('no_internet_connection')}
            </Text>
          </View>
        )}

        {/* Trading Analysis */}
        <TradingAnalysis/>

        {/* Quick Trade Entry */}
        <View style={styles.tradeSection}>
          <Button
            title={localize('tap_to_enter_trade')}
            onPress={handleOpenTradeModal}
            testID="new-trade-button"
            />
        </View>

        {/* Active Trades */}
        <View style={styles.activeTradesSection}>
          <ActiveTrades/>
        </View>

        {/* Trade Entry Modal */}
        <ModalTemplate
          isOpen={isTradeModalOpen}
          onClose={handleCloseTradeModal}
          title={localize('forex.title')}
          actions={modalActions}
          size="full"
          testID="trade-modal"
          showFooter={true}
          >
            <TradeEntryForm />
        </ModalTemplate>
      </PageTemplate>
  );
};

const styles = StyleSheet.create({
  networkStatus: {
    padding: 3,
    borderRadius: 8,
    marginBottom: 5,
  },
  tradeSection: {
    marginBottom: 24,
  },
  activeTradesSection: {
    flex: 1,
  },
});
