import React from 'react'
import { Modal as GSModal, ModalBackdrop, ModalContent, ModalCloseButton, ModalHeader, ModalBody, ModalFooter } from "@/components/design-system/ui";
import { Center } from "@/components/design-system/ui";
import { Heading } from "@/components/design-system/ui";
import { Icon, CloseIcon } from "@/components/design-system/ui";
import { Button, ButtonText } from "@/components/design-system/ui";
import { useTranslate } from '@/hooks/useTranslate';

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  showHeader?: boolean;
  headerText?: string;
  size?: "xs" | "sm" | "md" | "lg" | "full";
  testID?: string;
  onClose: () => void;
  footer: 
    {
      title: string;
      onClick: () => void;
    }[];
  
}

export const Modal: React.FC<ModalProps> = ({ testID, size, isOpen, onClose, showHeader, headerText, footer, children }) => {
    const { localize } = useTranslate();
    const defaultFooter = [
        {
            title: localize('common.cancel'),
            onClick: onClose
        },
    ];

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
            <ModalContent>
                <ModalHeader>
                    {showHeader && (
                        <Heading size="md" className="text-typography-950">
                            {headerText}
                            </Heading>
                        )
                    }
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