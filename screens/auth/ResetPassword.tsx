import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {SpinningLogo as Logo, TextInput, Text, Button, SafeAreaView } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { FormControl, FormControlError, FormControlErrorText, FormControlErrorIcon, AlertCircleIcon } from '@/components/design-system/ui';
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
            
            const success = await resetPassword(email);
            setEmail('');
            setError('');
            Alert.alert(success);
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
            <Text bold size={'3xl'} style={styles.title}>{localize('password.reset')}</Text>
            <FormControl
                size='md'
                isRequired={true}
                isInvalid={!!error}
            >
                <TextInput
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