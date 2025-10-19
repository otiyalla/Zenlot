import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput, Icon } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';

export interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  testID?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChangeText,
  label,
  placeholder = 'Enter password',
  error = false,
  helperText,
  disabled = false,
  testID,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { localize } = useTranslate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        label={label}
        placeholder={placeholder}
        secureTextEntry={!showPassword}
        error={error}
        helperText={helperText}
        disabled={disabled}
        testID={testID}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={(!!label && error) ? styles.eyeErrorButton : (!!label) ? styles.eyeLableButton : styles.eyeButton}
        onPress={togglePasswordVisibility}
        accessibilityLabel={showPassword ? localize('password.hide') : localize('password.show')}
        accessible={true}
        >
          <Icon
            name={showPassword ? 'eye-slash' : 'eye'}
            size={20}
            color="#666666"
            library="fontawesome6"
          />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
    zIndex: 1,
  },
  eyeErrorButton:{
    position: 'absolute',
    right: 12,
    top: '35%',
    padding: 4,
    zIndex: 1,
  },
  eyeLableButton:  {
    position: 'absolute',
    right: 12,
    top: '45%',
    padding: 4,
    zIndex: 1,
  },
});

