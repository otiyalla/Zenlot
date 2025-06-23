import React, { useState, Dispatch, SetStateAction } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Selection from '@/components/atoms/Selection';
import { TextInputComponent } from '@/components/atoms/TextInput';
import { TextComponent as Text} from '@/components/atoms/Text';
import { SafeAreaViewComponent as SafeAreaView} from '@/components/atoms/SafeAreaView';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlHelper,
  FormControlHelperText,
  AlertCircleIcon,

} from '@/components/ui'
import { useTranslate } from '@/hooks/useTranslate';
import Logo from '@/components/atoms/Logo';
import PasswordInput from '@/components/molecules/PasswordInput';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';


const languageOptions = [
{ label: 'English', value: 'en' },
{ label: 'French', value: 'fr' },
];

const SignUp: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { localize, SUPPORTED_LANGUAGES } = useTranslate();
    const [language, setLanguage] = useState(localize('select_language'));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 
    const isValid = (regex: RegExp, value: string) => regex.test(value);
    const themeColor = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
    const { signup } = useAuth();
    const checkLanguage = (lang: string) => SUPPORTED_LANGUAGES.some(language => language === lang);
        
    const onPasswordChange: Dispatch<SetStateAction<string>> = (value) => {
        setPassword(value);
        setError('');
    };

    const handleSignUp = async () => {
        // Handle sign up logic here
            const isValidEmail = isValid(emailRegex, email);
            const isValidPassword = isValid(passwordRegex, password);
            const isMatch = password === confirmPassword;
            const isValidLanguage = checkLanguage(language);
            
            if (!isValidEmail || !isValidPassword || !isValidLanguage || !firstName.length || !lastName.length) {
                setError(localize('form_incomplete'));
                return
            }else if (!isMatch) {
                setError(localize('password_invalid'));
                return
            }else {
                try {
                    const signup_info = {
                        fname: firstName,
                        lname: lastName,
                        email,
                        password,
                        language
                    }
                    await signup(signup_info);
                    console.log('User sign up info:', signup_info);
                    setEmail('');
                    setPassword('');
                    setFirstName('')
                    setLastName('');
                    setConfirmPassword('')
                    setError('');

                } catch (error) {
                    console.error('Sign In error:', error);
                }
            }
    };
    return (
    <SafeAreaView>
        <ScrollView contentContainerStyle={styles.container}>
            <Logo/>
            <Text style={styles.title} aria-label={localize('signup')} bold size={'3xl'} >{localize('signup')}</Text>
            <FormControl
                size='md'
                isRequired={true}
                isInvalid={!!error}
            > 
            {!!error && 
                <FormControlError style={styles.formError} >
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText accessibilityLabel={error} >{error}</FormControlErrorText>
                </FormControlError>
            }
            <TextInputComponent
                placeholder={localize('fname')}
                aria-label={localize('fname')}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
            />
            <TextInputComponent
                placeholder={localize('lname')}
                aria-label={localize('lname')}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
            />
            <TextInputComponent
                placeholder={localize('email')}
                aria-label={localize('email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <PasswordInput
                password={password}
                onChange={onPasswordChange} 
                placeholder={localize('password')}        
            />
            <FormControlHelper accessibilityLabel={localize('password_rule')}>
                <FormControlHelperText accessibilityLabel={localize('password_rule')} style={styles.helperText}>
                    {localize('password_rule')}
                </FormControlHelperText>
            </FormControlHelper>
            <PasswordInput
                password={confirmPassword}
                onChange={setConfirmPassword} 
                placeholder={localize('confirm_password')}        
            />
            <View style={styles.pickerContainer}>
                <Selection
                    options={languageOptions}
                    selectedValue={language}
                    onValueChange={setLanguage}
                />
            </View>
        </FormControl>
            <TouchableOpacity accessibilityLabel={localize('signup')} style={[styles.button, {backgroundColor: themeColor.buttons}]} onPress={handleSignUp}>
                <Text bold size={'2xl'} aria-label={localize('signup')} >{localize('signup')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signin} onPress={() => router.replace('/(auth)')}>
                <Text aria-label={localize('signin')} style={{color: themeColor.link }} size='lg'>
                    {localize('signin')}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        marginBottom: 24,
        alignSelf: 'center',
    },
    helperText: {
        paddingLeft: 10,
    },
    formError: {
        paddingLeft: 5,
    },
    pickerContainer: {
        marginBottom: 24,
        marginTop: 10,
        paddingLeft: 5,
        paddingRight: 5
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    button: {
        padding: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    signin: {
        alignSelf: 'center',
        marginVertical: 24
    },
});

export default SignUp;