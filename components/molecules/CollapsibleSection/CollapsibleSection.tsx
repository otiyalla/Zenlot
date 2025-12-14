import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Icon } from '@/components/atoms';
import { Colors } from '@/constants';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  iconPosition?: 'left' | 'right';
  headerStyle?: any;
  contentStyle?: any;
  onToggle?: (isOpen: boolean) => void;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  iconPosition = 'right',
  headerStyle,
  contentStyle,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const theme = Colors[useColorScheme() ?? 'light'];

  const toggleSection = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(newIsOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { borderBottomColor: theme.text } ,headerStyle]}
        onPress={toggleSection}
        activeOpacity={0.7}
        accessibilityLabel={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
      >
        {iconPosition === 'left' && (
          <Icon
            name="chevron-right"
            size={18}
            color="#666666"
            library="fontawesome6"
            style={[
              styles.icon,
              isOpen && styles.iconRotated,
            ]}
          />
        )}
        
        <Text weight="semibold" style={styles.title}>
          {title}
        </Text>
        
        {iconPosition === 'right' && (
          <Icon
            name="chevron-right"
            size={18}
            color="#666666"
            library="material"
            style={[
              styles.icon,
              isOpen && styles.iconRotated,
            ]}
          />
        )}
      </TouchableOpacity>
      
      {isOpen && (
        <View style={contentStyle}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    //borderBottomColor: '#E9ECEF',
  },
  title: {
    flex: 1,
    marginLeft: 8,
  },
  icon: {
    transform: [{ rotate: '0deg' }],
  },
  iconRotated: {
    transform: [{ rotate: '90deg' }],
  }
});
