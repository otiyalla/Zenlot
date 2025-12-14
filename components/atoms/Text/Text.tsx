import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export interface TextProps extends RNTextProps {
  variant?: 'body' | 'caption' | 'heading' | 'title' | 'subtitle';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'inverse';
  align?: 'left' | 'center' | 'right';
  inverse?: boolean;
  bold?: boolean;
  error?: boolean;
}

const getThemeColor = (
  color: TextProps['color'],
  theme: 'light' | 'dark'
) => {
  // You can customize these mappings based on your Colors constant
  const themeColors = {
    light: {
      primary: Colors.light.text,
      secondary: Colors.light.secondary,
      error: Colors.light.error,
      success: Colors.light.success,
      inverse: Colors.dark.text || '#FFFFFF',
    },
    dark: {
      primary: Colors.dark.text,
      secondary: Colors.dark.secondary,
      error: Colors.dark.error,
      success: Colors.dark.success,
      inverse: Colors.light.text || '#000000',
    },
  };
  return themeColors[theme][color || 'primary'];
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  size = 'md',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  inverse = false,
  bold = false,
  error = false,
  style,
  children,
  ...props
}) => {
  const theme = useColorScheme() as 'light' | 'dark';
  const themedColor = getThemeColor(inverse ? 'inverse' : error ? 'error' : color, theme);

  const textStyle = [
    styles.base,
    styles[variant],
    styles[size],
    styles[weight],
    styles[align],
    bold && styles.bold,
    { color: themedColor }, // override color based on theme
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
  body: {
    lineHeight: 20,
  },
  caption: {
    lineHeight: 16,
  },
  heading: {
    lineHeight: 24,
  },
  title: {
    lineHeight: 32,
  },
  subtitle: {
    lineHeight: 28,
  },
  xs: {
    fontSize: 12,
  },
  sm: {
    fontSize: 14,
  },
  md: {
    fontSize: 16,
  },
  lg: {
    fontSize: 18,
  },
  xl: {
    fontSize: 20,
  },
  '2xl': {
    fontSize: 24,
    lineHeight: 24,
  },
  '3xl': {
    fontSize: 28,
    lineHeight: 28,
  },
  normal: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});
