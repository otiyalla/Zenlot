import React from 'react';
import { View, StyleSheet, ScrollView, DimensionValue } from 'react-native';
import { Modal } from '@/components/atoms';

export interface ModalAction {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  testID?: string;
}

export interface ModalTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  contentHeight?: DimensionValue;
  actions?: ModalAction[];
  size?: 'sm' | 'md' | 'lg' | 'full';
  showHeader?: boolean;
  showFooter?: boolean;
  scrollable?: boolean;
  testID?: string;
}

export const ModalTemplate: React.FC<ModalTemplateProps> = ({
  isOpen,
  onClose,
  title,
  children,
  header,
  contentHeight,
  actions = [],
  size = 'md',
  showHeader = true,
  showFooter,
  scrollable = true,
  testID,
}) => {

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView style={styles.scrollContent}>
          {children}
        </ScrollView>
      );
    }
    return <View style={styles.content}>{children}</View>;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentHeight={contentHeight}
      showHeader={showHeader}
      headerNode={header}
      headerText={title}
      size={size}
      testID={testID}
      footer={showFooter ? actions.map(({ title, onPress }) => ({ title, onClick: onPress })) : []}
    >
      {renderContent()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    flex: 1
  },
});

