import React, { useState, Dispatch, SetStateAction } from 'react';
import { TextInputComponent } from '@/components/atoms/TextInput';
import { TextComponent as Text } from '@/components/atoms/Text';
import { HStack } from '@/components/ui'
import { TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface PasswordInputProps {
    label?: string;
    placeholder: string;
    password: string;
    onChange: Dispatch<SetStateAction<string>>
}

const PasswordInput: React.FC<PasswordInputProps> = ({ onChange, password, placeholder, label, ...props }) => {
    const { localize } = useTranslate();
    const themeColor = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    return (
        <>
        { !!label && <Text>{label}</Text>}
        <HStack space='xs' >
            <TextInputComponent
                value={password}
                onChangeText={onChange}
                placeholder={placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={{ flex: 1, paddingRight: 50 }} 
                aria-label={placeholder}
            />
            <TouchableOpacity
                style={{ position: 'absolute', right: 20, top: 12, zIndex: 1 }}
                onPress={toggleShowPassword}
                accessibilityLabel={showPassword ? localize('hide_password') : localize('show_password')}
            >
                {showPassword ? (
                    <FontAwesome6 accessibilityLabel={localize('hide_password')} name="eye-slash" size={24} color={themeColor.text} />
                    ) : (
                    <FontAwesome6 accessibilityLabel={localize('show_password')}  name="eye" size={24} color={themeColor.text} />
                )}
            </TouchableOpacity>
        </HStack>
        </>
    );
};

export default PasswordInput;