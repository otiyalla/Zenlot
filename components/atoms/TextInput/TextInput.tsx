import React from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleSheet, View, Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export interface TextInputProps extends RNTextInputProps {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
  label?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  variant = 'outlined',
  size = 'md',
  error = false,
  helperText,
  label,
  fullWidth = true,
  style,
  ...props
}) => {
    const theme = useColorScheme() as 'light' | 'dark';
    const styles = StyleSheet.create({
      container: {
        width: '100%',
        justifyContent: 'center',
      },
      
      base: {
        marginVertical: 4,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: Colors[theme].text,
        backgroundColor: Colors[theme].inputBackground,
      },
      
      // Variants
      default: {
        borderColor: 'transparent',
        borderBottomColor: Colors[theme].borderColor,
        borderBottomWidth: 1,
        borderRadius: 0,
      },
      outlined: {
        borderColor: Colors[theme].borderColor,
        backgroundColor: Colors[theme].inputBackground,
      },
      filled: {
        borderColor: 'transparent',
        backgroundColor: Colors[theme].inputBackground,
      },
      
      // Sizes
      sm: {
        paddingVertical: 8,
        fontSize: 14,
      },
      md: {
        paddingVertical: 12,
        fontSize: 16,
      },
      lg: {
        paddingVertical: 16,
        fontSize: 18,
      },
      
      // States
      error: {
        borderColor: Colors[theme].error,
      },
      
      // Layout
      fullWidth: {
        width: '100%',
      },
      
      // Label and helper text
      label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 4,
      },
      errorLabel: {
        color: Colors[theme].error,
      },
      helperText: {
        fontSize: 12,
        color: '#666666',
        marginTop: 4,
      },
      errorText: {
        color: Colors[theme].error,
      },
    });

  
  const inputStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    error && styles.error,
    style,
  ];

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, error && styles.errorLabel]}>
          {label}
        </Text>
      )}
      <RNTextInput
        style={inputStyle}
        placeholderTextColor={Colors[theme].placeholder}
        {...props}
      />
      {helperText && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {helperText}
        </Text>
      )}
    </View>
  );
};
