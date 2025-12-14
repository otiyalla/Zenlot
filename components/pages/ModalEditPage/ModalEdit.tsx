import React, { useState, useCallback } from 'react';
import { Text } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { TradeEntryForm } from '@organisms/TradeEntryForm'
import { useTrade } from '@/providers/TradeProvider';
import { TextEditor } from '@organisms/Editor';
import { ModalTemplate  as Modal} from '@templates/ModalTemplate';

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

    const handleEditorChange = useCallback((plainText: string, editorState: string) => {
        setTrade(prev => ({
            ...prev,
            plainText,
            editorState,
        }));
    }, [setTrade]);


    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={localize('forex.edit_title')}
            aria-label={localize('forex.edit_title')}
            size={ show ? 'full' : 'lg'}
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
            <TradeEntryForm/>
            {show && (
                <TextEditor 
                    plainText={currentTrade?.plainText}
                    editorState={currentTrade?.editorState}
                    onChange={handleEditorChange}
                />
            )}
        </Modal>
    );
};


