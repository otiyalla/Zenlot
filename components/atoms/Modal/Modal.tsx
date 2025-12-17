import React from 'react'
import { Modal as GSModal, ModalBackdrop, ModalContent, ModalCloseButton, ModalHeader, ModalBody, ModalFooter } from "@/components/design-system/ui";
import { 
    Center, Heading,
    Icon, CloseIcon,
    Button, ButtonText
} from "@/components/design-system/ui";
import { useTranslate } from '@/hooks/useTranslate';
import { DimensionValue } from 'react-native';

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  showHeader?: boolean;
  headerText?: string;
  headerNode?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "full";
  contentHeight?: DimensionValue;
  testID?: string;
  onClose: () => void;
  footer: 
    {
      title: string;
      onClick: () => void;
    }[];
  
}

export const Modal: React.FC<ModalProps> = ({ testID, size, contentHeight, isOpen, onClose, showHeader, headerText, headerNode, footer, children }) => {
    const { localize } = useTranslate();
    const defaultFooter = [
        {
            title: localize('common.cancel'),
            onClick: onClose
        },
    ];

    const header = headerNode ? headerNode : headerText ? (
        <Heading size="md" className="text-typography-950">
            {headerText}
        </Heading>
    ) : null;

    const height = !!contentHeight ? contentHeight : 'auto';

  return (
    <Center className='h-[300px]'>
        <GSModal
            isOpen={isOpen}
            onClose={onClose}
            size={size ?? "lg"}
            avoidKeyboard
            useRNModal={true}
            aria-label={headerText || localize('common.modal')}
            testID={testID} 
        >
            <ModalBackdrop />
            <ModalContent testID={`${testID}-content`} style={{ height }}>
                <ModalHeader>
                    {showHeader && header}
                    <ModalCloseButton >
                        <Icon as={CloseIcon} size="md"
                        className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"/>
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
                <ModalFooter>
                {(
                    [ ...footer, ...defaultFooter].map((item, index, a) => (
                        <Button
                            key={index}
                            onPress={item.onClick}
                            variant={index === (a.length - 1) ? 'solid' : 'outline'}
                            action={index === (a.length - 1) ? 'negative' : 'primary'}
                        >
                            <ButtonText>{item.title}</ButtonText>
                        </Button>
                    ))
                )}
                </ModalFooter>
            </ModalContent>
        </GSModal>
    </Center>
  )
}