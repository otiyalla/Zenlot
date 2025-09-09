import {Dispatch, SetStateAction, useState} from 'react';
import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlErrorIcon,
    AlertCircleIcon
} from '@/components/ui'
import { FontAwesome, FontAwesome6, AntDesign } from '@expo/vector-icons';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from 'expo-router';
import Logo from '@/components/atoms/Logo';import { TextInputComponent } from '@/components/atoms/TextInput';
import { TextComponent as Text } from '@/components/atoms/Text';
import { SafeAreaViewComponent as SafeAreaView } from '@/components/atoms/SafeAreaView';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import PasswordInput from '@/components/molecules/PasswordInput';
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

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.logoContainer}>
                    <Logo/>              
                </View>
                <Text style={styles.title} aria-label={localize('signin')} bold size={'3xl'} >{localize('signin')}</Text>
                <FormControl 
                    size='md'
                    isRequired={true}
                    isInvalid={!!error}
                >
                    <TextInputComponent
                        value={email}
                        onChangeText={onEmailChange}
                        placeholder={localize('email')}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoCorrect={false}
                        aria-label={localize('email')}
                    />
                    <PasswordInput
                        password={password}
                        onChange={onPasswordChange} 
                        placeholder={localize('password')}        
                    />
                        
                    {!!error && 
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText accessibilityLabel={error} >{error}</FormControlErrorText>
                        </FormControlError>
                    }
                    <TouchableOpacity style={styles.forgotButton}>
                        <Link href="/(auth)/resetpassword" style={{ textDecorationLine: 'none'}}>
                            <Text aria-label={localize('reset_password')} style={{color: themeColor.buttons }} size='md'>{localize('reset_password')}</Text>
                        </Link>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.signInButton, {backgroundColor: themeColor.buttons}]} onPress={handleSignIn}>
                        <Text aria-label={localize('signin')} bold size='2xl'>{localize('signin')}</Text>
                    </TouchableOpacity>
                    <View style={styles.orContainer}>
                        <View style={[styles.line, { backgroundColor: themeColor.text }]} />
                        <Text aria-label={localize('signin_with')} style={styles.orText}>&nbsp;{localize('signin_with')}&nbsp;</Text>
                        <View style={[styles.line, { backgroundColor: themeColor.text }]} />
                    </View>
                    <View style={styles.socialContainer}>
                        <TouchableOpacity onPress={handleGoogleSignIn} accessibilityLabel='google icon' style={[styles.socialButton, { backgroundColor: themeColor.googleBackground, borderColor: themeColor.logoBorder }]}>
                            <AntDesign accessibilityLabel='google' name="google" size={24} color={themeColor.google} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleFacebookSignIn} accessibilityLabel='facebook icon' style={[styles.socialButton, { backgroundColor: themeColor.socialFacebook }]}>
                            <FontAwesome accessibilityLabel='facebook' name="facebook" size={24} color={themeColor.facebook}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleTwitterSignIn} accessibilityLabel='x icon' style={[styles.socialButton, { backgroundColor: themeColor.socialTwitter }]}>
                            <FontAwesome6 accessibilityLabel='x previously twitter' name="x" size={24} color={themeColor.x} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleTelegramSignIn} accessibilityLabel='telegram icon' style={[styles.socialButton, { backgroundColor: themeColor.socialTelegram }]}>
                            <FontAwesome accessibilityLabel='telegram' name="telegram" size={24} color={themeColor.telegram} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAppleSignIn} accessibilityLabel='apple icon' style={[styles.socialButton, { backgroundColor: themeColor.socialApple }]}>
                            <FontAwesome accessibilityLabel='apple' name="apple" size={24} color={themeColor.apple} />
                        </TouchableOpacity>
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
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 24,
    },
    title: {
        marginBottom: 20,
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
    signInButton: {
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
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