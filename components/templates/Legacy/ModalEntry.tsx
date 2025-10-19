import React, { Dispatch, useState, SetStateAction } from 'react';
import { ScrollView } from 'react-native';
import { Text, Modal } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { TradeEntryForm } from '@/components/organisms'
import { useTrade } from '@/providers/TradeProvider';
import { TextEditor } from '@organisms/Editor';
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
            <Modal
                isOpen={isOpen}
                onClose={handleCancel}
                showHeader={true}
                headerText={localize('forex.title')}
                aria-label={localize('forex.title')}
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
                <TradeEntryForm/>
                {show && (
                    <TextEditor/>
                )}
            </Modal>
                            
        </ScrollView>
    );
};

export default ModalEntry;