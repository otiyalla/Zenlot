import React, { useState, useCallback } from 'react';
import { Text } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { useTrade } from '@/providers/TradeProvider';
import { ModalTemplate  as Modal} from '@templates/ModalTemplate';
import { TradeEditForm, TradeEditHeader } from '@/components/organisms';

export interface ModalEditPageProps {
    isOpen: boolean
    onCancel?: () => void
    onConfirm?: (trade: any) => void
    tradeError?: string
}

export const ModalEditPage: React.FC<ModalEditPageProps> =  ({ isOpen, tradeError, onCancel, onConfirm }) => {
    const { trade: currentTrade, setTrade } = useTrade();
    const [show, setShow] = useState<boolean>(false);
    const {localize} = useTranslate();

    const handleShow = useCallback(() => {
        setShow(prev => !prev);
    }, []);

    const handleCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        }
        setShow(false);
    }, [onCancel]);
  
    const handleConfirm = useCallback(() => {
        if (onConfirm) {
            onConfirm(currentTrade);
        }
        setShow(false);
    }, [onConfirm]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            header={<TradeEditHeader />}
            aria-label={localize('forex.edit_title')}
            size='full'
            contentHeight={ show ? '80%' : '50%'}
            testID='modal-edit-trade'
            showFooter={true}
            actions={
                [
                    {
                        title: show ? localize('hide_note') :  localize('show_note'),
                        onPress: handleShow,
                    },
                    {
                        title: localize('common.confirm'),
                        onPress: handleConfirm,
                    }
                ]
            }
        >
            {!!tradeError && (
                <Text error bold >{tradeError}</Text>
            )}
            <TradeEditForm toggleNote={show}/>
        </Modal>
    );
};


