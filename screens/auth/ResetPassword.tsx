import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInputComponent } from '@/components/atoms/TextInput';
import { TextComponent as Text } from '@/components/atoms/Text';
import { SafeAreaViewComponent as SafeAreaView } from '@/components/atoms/SafeAreaView';
import { ButtonComponent as Button } from '@/components/atoms/Button';
import Logo from '@/components/atoms/Logo';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { FormControl, FormControlError, FormControlErrorText, FormControlErrorIcon, AlertCircleIcon } from '@/components/ui';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

const ResetPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { localize } = useTranslate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = (regex: RegExp, value: string) => regex.test(value);
    const themeColor = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
    const { resetPassword } = useAuth();
    const handleResetPassword = async () => {
        const isValidEmail = isValid(emailRegex, email);
        if (!email || !isValidEmail){
            setError(localize('invalid_email'));
            return;
        }
        setLoading(true);
        try {
            //TODO: Implement password reset logic 
            // Replace with your password reset logic (API call)
            // await api.resetPassword(email);
            //Alert.alert('Success', 'Password reset instructions sent to your email.');
            console.log('password reset sent:', email);
            const success = await resetPassword(email);
            console.log("reset done: ", success);
            setEmail('');
            setError('');
        } catch (error) {
            console.error('Error', 'Failed to send reset instructions. ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Logo/>              
            </View>
            <Text bold size={'3xl'} style={styles.title}>{localize('reset_password')}</Text>
            <FormControl
                size='md'
                isRequired={true}
                isInvalid={!!error}
            >
                <TextInputComponent
                    placeholder={localize('email')}
                    aria-label={localize('email')}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                />
            {!!error &&
                <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText accessibilityLabel={error} >{error}</FormControlErrorText>
                </FormControlError>
            }
            </FormControl>
            <Button
                title={loading ? 'Sending...' : 'Send Reset Link'}
                onPress={handleResetPassword}
                disabled={loading}
            />
            <TouchableOpacity style={styles.signin} onPress={() => router.replace('/(auth)')}>
                    <Text aria-label={localize('signin')} style={{color: themeColor.buttons }} size='lg'>
                        {localize('signin')}
                    </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 30,
    },
    title: {
        marginBottom: 24,
        textAlign: 'center',
    },
    logoContainer: {
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signin: {
        alignSelf: 'center',
        marginVertical: 24
    },
});

export default ResetPassword;