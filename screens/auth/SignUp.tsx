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
import ForexRulesTable from '@/components/molecules/ForexRulesTable';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, languageOptions, currencyOptions } from '@/constants';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { signupValidation } from '@/validations';
import { ForexRule } from "@/types";


const SignUp: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { localize } = useTranslate();
    const [language, setLanguage] = useState<string>(localize('language.select_language'));
    const [accountCurrency, setAccountCurrency] = useState<string>(localize('currency.select_account_currency'));
    const [takeProfitRules, setTakeProfitRules] = useState<ForexRule[]>([]);
    const [stopLossRules, setStopLossRules] = useState<ForexRule[]>([]);
    const themeColor = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
    const { signup } = useAuth();
        
    const onPasswordChange: Dispatch<SetStateAction<string>> = (value) => {
        setPassword(value);
        setError('');
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setConfirmPassword('');
        setError('');
    }

    const handleSignUp = async () => {
            const isMatch = password === confirmPassword;
            
            if (!isMatch) {
                setError(localize('password_invalid'));
                return
            }else {
                try {
                    const signup_info = {
                        fname: firstName,
                        lname: lastName,
                        email,
                        password,
                        language,
                        accountCurrency,
                        rules: {
                            forex: {
                                take_profit: takeProfitRules.map(rule => ({ pips: rule.pips })),
                                stop_loss: stopLossRules.map(rule => ({ pips: rule.pips }))
                            }
                        }
                    }
                    const validated = signupValidation.safeParse(signup_info);
                    if (!validated.success) {
                        console.error(validated.error.message);
                        setError(localize('form_incomplete'));
                        return;
                    }
                    signup(signup_info);
                    console.log('User sign up info:', signup_info);
                    resetForm();

                } catch (error) {
                    console.error('Sign In error:', error);
                }
            }
    };
    return (
    <SafeAreaView>
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoContainer}>
                <Logo/>              
            </View>
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
            <View style={styles.pickerContainer}>
                <Selection
                    options={currencyOptions}
                    selectedValue={accountCurrency}
                    onValueChange={setAccountCurrency}
                />
            </View>
        </FormControl>
        
        <View style={styles.rulesContainer}>
            <ForexRulesTable
                takeProfitRules={takeProfitRules}
                stopLossRules={stopLossRules}
                onTakeProfitChange={setTakeProfitRules}
                onStopLossChange={setStopLossRules}
            />
        </View>
        
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
    logoContainer: {
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helperText: {
        paddingLeft: 10,
    },
    formError: {
        paddingLeft: 5,
    },
    pickerContainer: {
        marginBottom: 7,
        marginTop: 10,
        paddingLeft: 5,
        paddingRight: 5
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    button: {
        marginTop: 20,
        padding: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    signin: {
        alignSelf: 'center',
        marginVertical: 24
    },
    rulesContainer: {
        marginTop: 20,
        marginBottom: 10,
    },
});

export default SignUp;