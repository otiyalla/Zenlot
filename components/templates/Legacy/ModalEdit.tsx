import React, { Dispatch, useState, SetStateAction, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { Text, Modal } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { TradeEntryForm } from '@/components/organisms'
import { useTrade } from '@/providers/TradeProvider';
import { TextEditor } from '@/components/organisms/Editor';
import { updateTradeValidation } from '@/validations';
import { z } from 'zod';

interface TradeEntryProps {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const ModalEdit: React.FC<TradeEntryProps> =  ({ isOpen, setIsOpen }) => {
    const {trade: currentTrade, resetTrade, editTrade } = useTrade();
    const [show, setShow] = useState<boolean>(false);
    const {localize} = useTranslate();
    const [tradeError, setTradeError] = useState<string>("");

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        setShow(false);
        setTradeError('');
        resetTrade();
    }, [setIsOpen, resetTrade]);
  
    const handleConfirm = useCallback(() => {
        try {
            const validated = updateTradeValidation.parse(currentTrade);
            //const validated = createTradeValidation.parse(currentTrade);
            // Replace 'id' with the correct identifier property, e.g., 'tradeId'
            editTrade(validated.id, validated);
            handleCancel();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const { issues } = error;
                const message = 'Invalid ' + issues[0].path.join(', ');
                setTradeError(message);
            } else {
                setTradeError('Edit submission failed');
            }
            console.error('trade entry error:', error);
        }
    }, [currentTrade, editTrade, handleCancel]);

    const handleShow = useCallback(() => {
        setShow(prev => !prev);
    }, []);

    return (
        <ScrollView>
            <Modal
                isOpen={isOpen}
                onClose={handleCancel}
                showHeader={true}
                headerText={localize('forex.edit_title')}
                aria-label={localize('forex.edit_title')}
                size={ show ? 'full' : 'lg'}
                footer={
                    [
                        {
                            title: show ? localize('hide_note') :  localize('show_note'),
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


export default ModalEdit;