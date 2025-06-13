import React from 'react'
import { Modal, ModalBackdrop, ModalContent, ModalCloseButton, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { useTranslate } from '@/hooks/useTranslate';

interface ModalComponentProps {
  children: React.ReactNode;
  isOpen: boolean;
  showHeader?: boolean;
  headerText?: string;
  onClose: () => void;
  footer: 
    {
      title: string;
      onClick: () => void;
    }[];
  
}

export default function ModalComponent({  isOpen, onClose, showHeader, headerText, footer, children }: ModalComponentProps) {
    const { localize } = useTranslate();
    const defaultFooter = [
        {
            title: localize('common.cancel'),
            onClick: onClose
        },
    ];

  return (
    <Center className='h-[300px]'>
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            avoidKeyboard
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
                        [ ...defaultFooter, ...footer].map((item, index) => (
                            <Button
                                key={index}
                                onPress={item.onClick}
                                variant={index === 0 ? 'outline' : 'solid'}
                                action={index === 0 ? 'secondary' : 'primary'}
                            >
                                <ButtonText>{item.title}</ButtonText>
                            </Button>
                        ))
                    )}
                  </ModalFooter>
                </ModalContent>
              </Modal>
    </Center>
  )
}