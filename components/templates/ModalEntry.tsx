import React, { Dispatch, useState, SetStateAction } from 'react';
import { ScrollView } from 'react-native';
import { TextComponent as Text } from '@/components/atoms/Text';
import ModalComponent from '@/components/atoms/Modal';
import { type ExitProps } from '@/types/forex';
import { useTranslate } from '@/hooks/useTranslate';
import { useUser } from '@/providers/UserProvider';
import TradeEntry from '@/components/orgnisms/TradeEntry'
import { useTrade } from '@/providers/TradeProvider';
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import TextEditor from '../TextEditor';
import { tradeValidation } from '@/validations';
import { z } from 'zod';

interface TradeEntryProps {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const ModalEntry: React.FC<TradeEntryProps> = ({ isOpen, setIsOpen }) => {
    const {trade, resetTrade, submitTrade } = useTrade();
    const [show, setShow] = useState<boolean>(false);
    const {localize} = useTranslate();
    const colorSchema = useColorScheme();    
    const theme =  Colors[colorSchema ?? 'light'];
    const [tradeError, setTradeError] = useState<string>("");
  
    const handleConfirm = () => {
        
        try {
            const validated = tradeValidation.parse(trade);
            submitTrade(validated);
            handleCancel();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const { issues } = error;
                const message = 'Invalid ' + issues[0].path.join(', ');
                setTradeError(message);
            } else {
                setTradeError('Invalid trade s');
            }
            console.error('trade entry error:', error);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setShow(false);
        setTradeError('');
        resetTrade();
    };

    const handleShow = () => {
        setShow(!show);
    };

    return (
        <ScrollView>
            <ModalComponent
                isOpen={isOpen}
                onClose={handleCancel}
                showHeader={true}
                headerText={localize('forex.title')}
                aria-label={localize('forex.title')}
                useRNModal
                size={ show ? 'full' : 'lg'}
                footer={
                    [

                        {
                            title: show ? 'Hide note' :  'Show note',
                            onClick: handleShow,
                        },
                        {
                            title: localize('common.confirm'),
                            onClick: handleConfirm,
                        }
                    ]
                }
            >
                {!!tradeError && (
                    <Text error bold >{tradeError}</Text>
                )}
                <TradeEntry/>
                {show && (
                    <TextEditor/>
                )}
            </ModalComponent>
                            
        </ScrollView>
    );
};

export default ModalEntry;