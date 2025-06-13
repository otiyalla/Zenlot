import React, { useState } from 'react';
import { View, Button } from 'react-native';
import {StopLossEntry, TakeProfitEntry, TradeRatio, PipInfo, ExecutionType} from '@/components/molecules';
import ModalComponent  from '@/components/atoms/Modal';
import Search  from '@/components/atoms/Search';
import { TextInputComponent } from '@/components/atoms/TextInput';
import { getExecutionType, getRatio } from '@/constants/utils';
import { VStack, HStack, Text } from '@/components/ui';
import { type ExitProps } from '@/types/forex';
import { useTranslate } from '@/hooks/useTranslate';
//TODO: Clean up this component, it is messy and needs to be refactored, create molecules for the pip info, risk/reward info, etc.
interface TradeEntryProps {
    onSubmit: (trade: { 
        execution: string, 
        entryPrice: number, 
        stopLoss: ExitProps; 
        takeProfit: ExitProps
        lotSize: number;
        pips: number;
    }) => void;
    lang: 'en' | 'fr'
}

const TradeEntry: React.FC<TradeEntryProps> = ({ onSubmit, lang }) => {
    const [entryPrice, setEntryPrice] = useState<number>(0);
    const [entry, setEntry] = useState<string>('');
    const [stopLoss, setStopLoss] = useState<ExitProps>({ value: 0, pips: 0 });
    const [takeProfit, setTakeProfit] = useState<ExitProps>({ value: 0, pips: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const execution = getExecutionType(Number(entryPrice), stopLoss.value, takeProfit.value);
    const  TP_RULES= [{ pips: 40 }, { pips: 50 }, { pips: 60 }];
    const SL_RULES= [{ pips: 40 }, { pips: 50 }, { pips: 60 }];
    const exchangeRate = 1; // Example exchange rate, adjust as needed
    const [lotSize, setLotSize] = useState<number>(0.01); // Example lot size, adjust as needed
    const [pips, setPips] = useState<number>(0.0001); // Example pip value, adjust as needed
    const { risk, reward } = getRatio(stopLoss.pips, takeProfit.pips);
    const showExecution: boolean = !!(entryPrice && stopLoss.value) || !!(entryPrice && takeProfit.value) || !!(stopLoss.value && takeProfit.value);
    const {localize} = useTranslate(lang);

    const reset = () => {
        setEntryPrice(0);
        setEntry('');
        setStopLoss({value: 0, pips: 0});
        setTakeProfit({value: 0, pips: 0});
    }

    const handleOpen = () => {
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        if ( takeProfit === undefined || stopLoss === undefined || isNaN(stopLoss.value) || isNaN(takeProfit.value) || stopLoss.value <= 0 || takeProfit.value <= 0) {
            alert('Please enter valid Stop Loss and Take Profit values or press cancel.');
            return;
        }
        onSubmit({ execution, entryPrice, lotSize, pips, stopLoss, takeProfit });
        handleCancel();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleEntryPriceChange = (text: string) => {
        setEntry(text);
        const price = parseFloat(text);
        if (!isNaN(price)) {
            setEntryPrice(price);
        } else {
            setEntryPrice(0);
        }
    };

    return (
        <View>
            <Button title="Open Modal" onPress={handleOpen} />

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCancel}
                showHeader={true}
                headerText={localize('forex.title')}
                aria-label={localize('forex.title')}
                footer={
                    [
                        {
                            title: localize('common.confirm'),
                            onClick: handleConfirm,
                        }
                    ]
                }
            >
                <HStack space='sm' style={{ marginBottom: 10, justifyContent: 'space-between' }}>
                    <VStack>
                        <Text>{localize('type')}</Text>
                        {showExecution && (<ExecutionType lang={lang} execution={execution}/>)}
                    </VStack>
                    <VStack space='xs'>
                        <Text>{localize('rate')}: {exchangeRate}</Text>
                        <Text>{localize('currency')}: CAD</Text>
                    </VStack>
                </HStack>
                <Search placeholderText={localize('placeholder.forex')}/>
                <Text className='pl-[10]'>{localize('forex.entry')}</Text>
                <TextInputComponent 
                    placeholder={localize('placeholder.entry')}
                    value={entry}
                    onChangeText={handleEntryPriceChange}
                    keyboardType='decimal-pad'
                    inputMode='decimal'
                    aria-label={localize('placeholder.entry')}
                />
                <PipInfo 
                    lang={lang}
                    handlePipChange={setPips}
                    handleLotChange={setLotSize}
                />
                <HStack space='xs' style={{ margin: 5, justifyContent: 'space-between' }}>
                    <StopLossEntry lang={lang} execution={execution} entry={entryPrice} pipValue={pips} lotSize={lotSize} exchangeRate={exchangeRate} SL_RULES={SL_RULES} onChange={setStopLoss} />
                    {!!reward && (<TradeRatio lang={lang} risk={risk} reward={reward}/>)}
                    <TakeProfitEntry lang={lang} execution={execution} entry={entryPrice} pipValue={pips} lotSize={lotSize} exchangeRate={exchangeRate} TP_RULES={TP_RULES} onChange={setTakeProfit} />
                </HStack>
            </ModalComponent>
        </View>
    );
};

export default TradeEntry;