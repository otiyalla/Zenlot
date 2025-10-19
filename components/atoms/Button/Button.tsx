import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../Text';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Icon } from '../Icon';

export interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  testID?: string;
  accessibilityLabel?: string;
  icon?: string
}

const allowedVariants = ['primary', 'secondary', 'outline', 'danger', 'success'] as const;
const allowedSizes = ['sm', 'md', 'lg'] as const;

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  testID,
  accessibilityLabel,
  backgroundColor,
  borderColor,
  color,
  icon
}) => {
  const safeVariant = allowedVariants.includes(variant as any) ? variant : 'primary';
  const safeSize = allowedSizes.includes(size as any) ? size : 'md';
  const theme = useColorScheme() as 'light' | 'dark';
  const styles = StyleSheet.create({
    base: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
    },
    // Variants
    primary: {
      backgroundColor: backgroundColor ? backgroundColor : Colors[theme].buttons,
      borderColor: borderColor ? borderColor : Colors[theme].buttons,
    },
    secondary: {
      backgroundColor: backgroundColor ? backgroundColor : Colors[theme].link,
      borderColor: borderColor ? borderColor : Colors[theme].link,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: borderColor ? borderColor : Colors[theme].buttons,
    },
    success: {
      borderWidth: 1,
      backgroundColor: backgroundColor ? backgroundColor : Colors[theme].success,
      borderColor: borderColor ? borderColor : Colors[theme].text,
    },
    danger: {
      borderWidth: 1,
      backgroundColor: backgroundColor ? backgroundColor : Colors[theme].buttonCancel,
      borderColor: borderColor ? borderColor : Colors[theme].danger,
    },
    // Sizes
    sm: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      minHeight: 32,
    },
    md: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      minHeight: 44,
    },
    lg: {
      paddingHorizontal: 20,
      paddingVertical: 14,
      minHeight: 52,
    },
    // Text styles
    text: {
      fontWeight: '600',
      textAlign: 'center',
    },
    primaryText: {
      color: color ? color : Colors[theme].text,
    },
    secondaryText: {
      color: color ? color : Colors[theme].buttonText,
    },
    outlineText: {
      color: color ? color : Colors[theme].buttons,
    },
    successText: {
      color: color ? color : Colors[theme].buttonText,
    },
    dangerText: {
      color: color ? color : Colors[theme].text,
    },
    // Size text
    smText: {
      fontSize: 14,
    },
    mdText: {
      fontSize: 16,
    },
    lgText: {
      fontSize: 18,
    },
    // States
    disabled: {
      opacity: 0.5,
    },
    disabledText: {
      opacity: 0.7,
    },
    // Layout
    fullWidth: {
      width: '100%',
    },
    // Icon styles
    icon: {
      paddingLeft: 20
    },
    primaryIcon: {
      color: color ? color : Colors[theme].text,
    },
    secondaryIcon: {
      color: color ? color : Colors[theme].buttonText,
    },
    outlineIcon: {
      color: color ? color : Colors[theme].buttons,
    },
    successIcon: {
      color: color ? color : Colors[theme].buttonText,
    },
    dangerIcon: {
      color: color ? color : Colors[theme].text,
    },
    // Size text
    smIcon: {
      fontSize: 14,
    },
    mdIcon: {
      fontSize: 16,
    },
    lgIcon: {
      fontSize: 18,
    },
  });

  const buttonStyle = [
    styles.base,
    styles[safeVariant],
    styles[safeSize],
    fullWidth ? styles.fullWidth : undefined,
    disabled ? styles.disabled : undefined,
  ].filter(Boolean);

  const textStyle = [
    styles.text,
    styles[`${safeVariant}Text`],
    styles[`${safeSize}Text`],
    disabled ? styles.disabledText : undefined,
  ].filter(Boolean);

  const iconStyle = [
    styles.icon,
    styles[`${safeVariant}Icon`],
    styles[`${safeSize}Icon`],
  ].filter(Boolean)

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      accessible={true}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{title}</Text> 
      {icon && <Icon style={iconStyle} name={icon}/>}
    </TouchableOpacity>
  );
};


