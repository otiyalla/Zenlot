import React, { useState, useCallback, useEffect } from 'react';
import { Platform, View, StyleSheet, ScrollView } from 'react-native';
import { TradeEntryState, TradeStatus } from '@/types';
import { getRatio, getCurrencyValue, getPipDifference, formatNumberByLocale, formatDate, parseErrors } from '@/constants/utils';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Text, Icon, Menu } from '@/components/atoms';
import { HStack , VStack, TrashIcon, CopyIcon, EditIcon, Badge, BadgeText } from '@/components/design-system/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { useTrade } from '@/providers/TradeProvider';
import { useUser } from '@/providers/UserProvider';
import {ModalEditPage as ModalEdit} from '@/components/pages/ModalEditPage';
import { updateTradeValidation } from '@/validations';
import { z } from 'zod';

export type TradeCardProps = {
    trade: TradeEntryState;
    onPress?: (trade: TradeEntryState) => void;
};

export const TradeCard: React.FC<TradeCardProps> = ({ trade, onPress }) => {
    const { symbol, entry, execution, status, pips, exchangeRate, lot, stopLoss, takeProfit, createdAt } = trade;
    const { risk, reward } = getRatio(stopLoss.pips, takeProfit.pips);
    const { user } = useUser();
    const { language, accountCurrency, togglePipValue } = user;
    const trade_loss = getCurrencyValue(symbol, entry, stopLoss.value, lot, exchangeRate);
    const loss = formatNumberByLocale(trade_loss, language, accountCurrency);
    const trade_gain = getCurrencyValue(symbol, entry, takeProfit.value, lot, exchangeRate);
    const gain = formatNumberByLocale(trade_gain, language, accountCurrency);
    const lossPipDifference = getPipDifference(entry, stopLoss.value, pips);
    const gainPipDifference = getPipDifference(entry, takeProfit.value, pips);
    const formattedDate = formatDate(new Date(createdAt), language);
    const colorSchema = useColorScheme();
    const theme = Colors[colorSchema ?? 'light'];
    const { localize } = useTranslate();
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const { setTrade, duplicateTrade, editTrade, deleteTrade, resetTrade, currentRate } = useTrade();
    const [tradeError, setTradeError] = useState<string>("");
    const [errorsFields, setErrorsFields] = useState<string[]>([]);
    const statusMenuOptions = [
        {
            label: "common.open",
            key: "open",
        },
        {
            label: "common.close",
            key: "closed",
        },
        {
            label: "common.closed_in_profit",
            key: "closed_in_profit",
        },
        {
            label: "common.closed_in_loss",
            key: "closed_in_loss",
        },
        {
            label: "common.reached_tp",
            key: "reached_tp",
        },
        {
            label: "common.reached_sl",
            key: "reached_sl",
        }
    ];

    const onEdit = () => {
        setTrade(trade);
        setIsEditOpen(true);
    }

    const menuOptions = [
        {
            label: 'duplicate_trade',
            key: 'duplicate',
            icon: <Icon name={'copy'} library='gluestack' as={CopyIcon} size={20}/>,
        },
        {
            label: 'edit_trade',
            key: 'edit',
            icon: <Icon name={'edit'} library='gluestack' as={EditIcon} size={20} />,
        },
        {
            label: 'delete_trade',
            key: 'delete',
            icon: <Icon name={'trash'} library='gluestack' as={TrashIcon} size={20}  color={theme.error} />,
        },
    ];

    const getCurrentExchangeRate = async () => {
        const symbol = trade.symbol;
        const currency = symbol.substring(symbol.length-3, symbol.length);
        let exchangeRate = 1;
        if (currency === accountCurrency.toUpperCase()) return exchangeRate;
        const newsymbol: string = `${currency}${accountCurrency.toUpperCase()}`;
        const quote = await currentRate(newsymbol);
        if (quote?.ask) exchangeRate = quote.ask;
        return exchangeRate;
    }

    const getCurrentPrice = async () => {
        const symbol = trade.symbol;
        let exchangeRate = 0;
        const quote = await currentRate(symbol);
        if (quote?.bid) exchangeRate = quote.bid;
        return exchangeRate;
    }

    const onStatusChnage = async (status: TradeStatus) => {
        const closedAt = new Date();
        let closedPrice = await getCurrentPrice();
        let closedReason = '';
        const closedExchangeRate = await getCurrentExchangeRate();
       
        switch (status){
            case 'closed':  
            case 'close':  
                closedReason = 'Not yet implemented';
                break
            case 'reached_tp':
            case 'closed_in_profit':
                closedPrice = trade.takeProfit.value;
                if (status === 'closed_in_profit') closedReason = ''
                break
            case 'reached_sl':
            case 'closed_in_loss':
                closedPrice = trade.stopLoss.value;
                if (status === 'closed_in_loss') closedReason = ''
                break
        }
        
        return {closedAt, closedExchangeRate, closedPrice, closedReason}

    }

    const handleStatusChange = async (newStatus: string) => {
        const status = newStatus as TradeStatus;
        if (status === trade.status) return;
        let addtionalProps = await onStatusChnage(status);
        editTrade(trade.id, { ...trade, status, ...addtionalProps })
    }

    const handleMenuSelection = (selection: string) => {
        switch(selection){
            case 'duplicate':
                duplicateTrade(trade.id);
                break;
            case 'edit':
                onEdit();
                break;
            case 'delete':
                deleteTrade(trade.id);
                break;
        }
    }



     const onCancel = useCallback(() => {
        setIsEditOpen(false);
        setTradeError('');
        setErrorsFields([]);
        resetTrade();
    }, [isEditOpen, resetTrade]);

    const onConfirm = useCallback((currentTrade: TradeEntryState) => {
        try {
            const validated = updateTradeValidation.parse(currentTrade);
            editTrade(currentTrade.id, validated);
            onCancel();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const { issues } = error;
                const pretty = z.prettifyError(error);
                console.log("edit error message: ", pretty);
                const {errorFields, errorMessage} = parseErrors(JSON.parse(error.message));
                setErrorsFields(errorFields);
                const message = errorMessage[errorFields[0]];
                setTradeError(message);
            } else {
                setTradeError('Edit submission failed');
                console.error('trade entry error:', error);
            }
        }
    }, [editTrade, onCancel]);

    const menu = ( 
        <Menu
            menuOptions={menuOptions}
            onMenuSelection={handleMenuSelection}
        />
    )

    const statusItem = (
        <Badge
            variant='outline'
            size= 'sm'
            className='rounded-[5]'
        >
            <BadgeText 
                accessibilityLabel={(localize(`common.${status}`)).toUpperCase()}
                className='font-medium'
            >
                {(localize(`common.${status ?? 'open'}`)).toUpperCase()}
            </BadgeText>
        </Badge>
    )

    return (
        <>
            {isEditOpen ? <ModalEdit isOpen={isEditOpen} tradeError={tradeError} onCancel={onCancel} onConfirm={onConfirm}/> :
            <View
                style={[
                    {backgroundColor: theme.background, shadowColor: theme.text},
                    styles.card,
                    execution === 'buy' ? { ...styles.buy, borderLeftColor: theme.success} : { ...styles.sell, borderLeftColor: theme.danger},
                    status === 'closed' && styles.closed,
                ]}
                //onPress={() => onPress && onPress(trade)}
                //activeOpacity={0.8}
            >
                <View style={styles.header}>
                    <Text
                        bold
                        size={'lg'}
                        accessibilityLabel={`${localize('symbol')}: ${symbol}`}
                    >
                        {symbol}
                    </Text>
                    <HStack space='2xl'>
                        <Text
                            size='md'
                            style={[styles.side, { color: theme.lightText }]}
                            accessibilityLabel={`Execution: ${execution.toUpperCase()}`}
                        >
                            {execution.toUpperCase()}
                        </Text>
                        {menu}
                    </HStack>
                </View>
                <ScrollView horizontal 
                showsHorizontalScrollIndicator={false}
                centerContent 
                contentContainerStyle={styles.details}
                >
                    <VStack>
                        <HStack>
                            <Text
                                size='md'
                                style={[styles.label, { color: theme.lightText }]}
                                accessibilityLabel={localize("forex.entry")}
                            >
                                {localize("forex.entry")}:
                            </Text>
                            <Text
                                bold
                                size={'md'}
                                style={styles.value}
                                accessibilityLabel={`${localize("forex.entry")}: ${entry}`}
                            >
                                {entry}
                            </Text>
                        </HStack>
                        <HStack>
                            <Text
                                size='md'
                                style={[styles.label, { color: theme.lightText }]}
                                accessibilityLabel={localize("forex.ratio")}
                            >
                                {localize("forex.ratio")}:
                            </Text>
                            <Text
                                size='md'
                                accessibilityLabel={`Ratio: ${reward} to 1`}
                            >
                                { reward } : 1
                            </Text>
                        </HStack>
                    </VStack>
                    <VStack>
                        <HStack>
                            <Text
                                size='md'
                                style={[styles.label, { color: theme.lightText }]}
                                accessibilityLabel={localize("forex.sl")}
                            >
                                {localize("forex.sl")}:
                            </Text>
                            <Text
                                bold
                                size={'md'}
                                style={styles.value}
                                accessibilityLabel={`Stop Loss Value: ${stopLoss.value}`}
                            >
                                {stopLoss.value}
                            </Text>
                        </HStack>
                        <HStack>
                            <Text
                                size='md'
                                style={[styles.label, { color: theme.lightText }]}
                                accessibilityLabel={localize("forex.sl")}
                            >
                                {localize("forex.sl")}:
                            </Text>
                            <Text
                                bold
                                size={'md'}
                                style={styles.value}
                                accessibilityLabel={`Stop Loss Amount: ${togglePipValue ? lossPipDifference : loss}`}
                            >
                                {togglePipValue ? lossPipDifference : loss}
                            </Text>
                        </HStack>
                    </VStack>
                    <VStack>
                        <HStack>
                            <Text
                                size='md'
                                style={[styles.label, { color: theme.lightText }]}
                                accessibilityLabel={localize("forex.tp")}
                            >
                                {localize("forex.tp")}:
                            </Text>
                            <Text
                                bold
                                size={'md'}
                                style={styles.value}
                                accessibilityLabel={`Take Profit Value: ${takeProfit.value}`}
                            >
                                {takeProfit.value}
                            </Text>
                        </HStack>
                        <HStack>
                            <Text
                                size='md'
                                style={[styles.label, { color: theme.lightText }]}
                                accessibilityLabel={localize("forex.tp")}
                            >
                                {localize("forex.tp")}:
                            </Text>
                            <Text
                                bold
                                size={'md'}
                                style={styles.value}
                                accessibilityLabel={`Take Profit Amount: ${togglePipValue ? gainPipDifference : gain}`}
                            >
                                { togglePipValue ? gainPipDifference : gain}
                            </Text>
                        </HStack>
                    </VStack>
                </ScrollView>
                <View style={styles.footer}>
                    <Menu
                        menuOptions={statusMenuOptions}
                        onMenuSelection={handleStatusChange}
                        menuOpenNode={statusItem}
                    />
                    <Text
                        size='sm'
                        style={{ color: theme.lightText }}
                        accessibilityLabel={`Timestamp: ${new Date(createdAt).toLocaleString()}`}
                    >
                        {formattedDate}
                    </Text>
                </View>
            </View>}
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 15,
        elevation: 2,
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        ...(Platform.OS === 'web'
            ? {
                boxShadow: '0.5px 0.5px 0.9px',
            }
            : {}),
    },
    buy: {
        borderLeftWidth: 10,
    },
    sell: {
        borderLeftWidth: 10,
    },
    closed: {
        opacity: 0.6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    side: {
        fontWeight: '600',
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        justifyContent: 'space-between',
    },
    label: {
        marginRight: 4,
    },
    value: {
        fontWeight: '500',
        marginRight: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});