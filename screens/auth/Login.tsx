import {Dispatch, SetStateAction, useState} from 'react';
import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlErrorIcon,
    AlertCircleIcon
} from '@/components/design-system/ui'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from 'expo-router';
import {SpinningLogo as Logo, TextInput, Text, Button, Icon, SafeAreaView } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { PasswordField } from '@/components/molecules';
import { signinValidation } from '@/validations';

export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const themeColor = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
   
    const { localize } = useTranslate();

    const handleSignIn = async () => {
        try {   
            const validated = signinValidation.parse({ email, password });
            if (validated) {
                setError('');
                await login({ email, password });
                console.log('User isAuthenticated:', isAuthenticated);
            } else {
                setError(localize('login_invalid'));
            }
        } catch (error) {
            setError(localize('login_invalid'));
            console.error('Sign In error:', error);
        }
    }

    const onEmailChange = (text: string) => {
        const trimmedText = text.trim();
        setEmail(trimmedText);
        setError(''); 
    };

    const onPasswordChange: Dispatch<SetStateAction<string>> = (text) => {
        setPassword(text);
        setError(''); 
    };

//TODO: Implement social sign-in logic
    const handleGoogleSignIn = () => {
        // Implement Google Sign-In logic here
        console.log('Google Sign-In pressed');
        // Example: Call your Google Sign-In API
    };
    const handleFacebookSignIn = () => {
        // Implement Facebook Sign-In logic here
        console.log('Facebook Sign-In pressed');
        // Example: Call your Facebook Sign-In API
    };
    const handleTwitterSignIn = () => {
        // Implement Twitter Sign-In logic here
        console.log('Twitter Sign-In pressed');
        // Example: Call your Twitter Sign-In API
    };
    const handleTelegramSignIn = () => {
        // Implement Telegram Sign-In logic here
        console.log('Telegram Sign-In pressed');
        // Example: Call your Telegram Sign-In API
    };
    const handleAppleSignIn = () => {
        // Implement Apple Sign-In logic here
        console.log('Apple Sign-In pressed');
        // Example: Call your Apple Sign-In API
    };

   const SOCIALS_LOGINS = [
        { 
            library: 'fontawesome6',
            onPress: handleGoogleSignIn,
            style: [styles.socialButton, { backgroundColor: themeColor.googleBackground, borderColor: themeColor.logoBorder  }],
            accessibilityLabel: 'google icon',
            name: 'google',
            size: 24,
            color: themeColor.google
        },
        { 
            library: 'fontawesome6',
            onPress: handleFacebookSignIn,
            style: [styles.socialButton, { backgroundColor: themeColor.socialFacebook }],
            accessibilityLabel: 'facebook icon',
            name: 'facebook',
            size: 24,
            color: themeColor.facebook
        },
        { 
            library: 'fontawesome6',
            onPress: handleTwitterSignIn,
            style: [styles.socialButton, { backgroundColor: themeColor.socialTwitter }],
            accessibilityLabel: 'x icon previously twitter',
            name: 'x',
            size: 24,
            color: themeColor.x
        },
        { 
            library: 'fontawesome6',
            onPress: handleTelegramSignIn,
            style: [styles.socialButton, { backgroundColor: themeColor.socialTelegram }],
            accessibilityLabel: 'telegram icon',
            name: 'telegram',
            size: 24,
            color: themeColor.telegram
        },
        {
            library: 'fontawesome6',
            onPress: handleAppleSignIn,
            style: [styles.socialButton, { backgroundColor: themeColor.socialApple }],
            accessibilityLabel: 'apple icon',
            name: 'apple',
            size: 24,
            color: themeColor.apple
        }
    ]

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.logoContainer}>
                    <Logo/>              
                </View>
                <Text style={styles.title} aria-label={localize('signin')} bold size={'lg'} >{localize('slogan')}</Text>
                <FormControl 
                    size='md'
                    isRequired={true}
                    isInvalid={!!error}
                >
                    <TextInput
                        value={email}
                        onChangeText={onEmailChange}
                        placeholder={localize('email')}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoCorrect={false}
                        aria-label={localize('email')}
                    />
                    <PasswordField
                        value={password}
                        onChangeText={onPasswordChange} 
                        placeholder={localize('password.password')}        
                    />
                        
                    {!!error && 
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} fill={themeColor.invesetext} />
                            <FormControlErrorText accessibilityLabel={error} >{error}</FormControlErrorText>
                        </FormControlError>
                    }
                    <TouchableOpacity style={styles.forgotButton}>
                        <Link href="/(auth)/resetpassword" style={{ textDecorationLine: 'none'}}>
                            <Text aria-label={localize('password.reset')} style={{color: themeColor.buttons }} size='md'>{localize('password.reset')}</Text>
                        </Link>
                    </TouchableOpacity>
                    <Button
                        onPress={handleSignIn}
                        title={localize('signin')}
                        variant='primary'
                        size='lg'
                        accessibilityLabel={localize('signin')}
                        testID='sign-in-button'
                    />
                    <View style={styles.orContainer}>
                        <View style={[styles.line, { backgroundColor: themeColor.text }]} />
                        <Text aria-label={localize('signin_with')} style={styles.orText}>&nbsp;{localize('signin_with')}&nbsp;</Text>
                        <View style={[styles.line, { backgroundColor: themeColor.text }]} />
                    </View>
                    <View style={styles.socialContainer}>
                        {
                            SOCIALS_LOGINS.map((social, index) =>(
                                <TouchableOpacity key={`${social.name}-${index}`} onPress={social.onPress} accessibilityLabel={social.accessibilityLabel} style={social.style}>
                                    <Icon library={social.library as 'fontawesome6'} accessibilityLabel={social.accessibilityLabel} name={social.name} size={social.size} color={social.color} />
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                    <View style={styles.signupContainer}>
                        <Text aria-label={localize('no_account')} size='md'>
                            {localize('no_account')}&nbsp;
                        </Text>
                        <TouchableOpacity accessibilityLabel={localize('signup')}>
                            <Link href="/(auth)/signup">
                                <Text bold size='md' style={{color: themeColor.buttons}}>{localize('signup')}</Text>
                            </Link>
                        </TouchableOpacity>
                    </View>
                </FormControl>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        marginBottom: 20,
        alignSelf: 'center',
    },
    logoContainer: {
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    line: {
        flex: 1,
        height: 1,
    },
    orText: {
        marginHorizontal: 12,
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32,
    },
    socialButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
});