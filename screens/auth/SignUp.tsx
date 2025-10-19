import React, { useState, Dispatch, SetStateAction } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {SpinningLogo as Logo, TextInput, Text, SafeAreaView, Select, Button} from '@/components/atoms';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlHelper,
  FormControlHelperText,
  AlertCircleIcon,

} from '@/components/design-system/ui'
import { useTranslate } from '@/hooks/useTranslate';
import { PasswordField } from '@/components/molecules';
import {ForexRulesTable} from '@/components/organisms';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, languageOptions, currencyOptions, parseErrors, getSystemTimeZone } from '@/constants';
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
    const [language, setLanguage] = useState<string>('');
    const [accountCurrency, setAccountCurrency] = useState<string>('');
    const [takeProfitRules, setTakeProfitRules] = useState<ForexRule[]>([]);
    const [stopLossRules, setStopLossRules] = useState<ForexRule[]>([]);
    const themeColor = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
    const { signup } = useAuth();
    const [errorsFields, setErrorsFields] = useState<string[]>([]);
        
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
        setLanguage('');
        setAccountCurrency('');
        setTakeProfitRules([]);
        setStopLossRules([]);
        setErrorsFields([]);
    }

    const handleSignUp = async () => {
            const isMatch = password === confirmPassword;
            
            if (!isMatch) {
                setError(localize('password.mismatch'));
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
                        timezone: getSystemTimeZone(),
                        rules: {
                            forex: {
                                take_profit: takeProfitRules.map(rule => ({ pips: rule.pips })).sort((a, b) => a.pips - b.pips),
                                stop_loss: stopLossRules.map(rule => ({ pips: rule.pips })).sort((a, b) => a.pips - b.pips)
                            }
                        }
                    }
                    const validated = signupValidation.safeParse(signup_info);
                    if (!validated.success) {
                      console.log('validation error', validated.error.message);
                      const {errorFields, errorMessage} = parseErrors(JSON.parse(validated.error.message));
                      setErrorsFields(errorFields);
                      setError(localize('form_incomplete'));
                      return;
                    }
                    signup(signup_info);
                    console.log('User sign up info:', signup_info);
                    resetForm();

                } catch (error) {
                    console.error('Sign up error:', error);
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
                        <FormControlErrorIcon as={AlertCircleIcon} fill={themeColor.invesetext}  />
                        <FormControlErrorText accessibilityLabel={error} >{error}</FormControlErrorText>
                    </FormControlError>
                }
                <TextInput
                    placeholder={localize('fname')}
                    aria-label={localize('fname')}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    error={errorsFields.includes('fname')}
                />
                <TextInput
                    placeholder={localize('lname')}
                    aria-label={localize('lname')}
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    error={errorsFields.includes('lname')}
                />
                <TextInput
                    placeholder={localize('email')}
                    aria-label={localize('email')}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errorsFields.includes('email')}
                />
                <PasswordField
                    value={password}
                    onChangeText={onPasswordChange} 
                    placeholder={localize('password.password')}
                    error={errorsFields.includes('password')}
                />
                <FormControlHelper accessibilityLabel={localize('password.rule')}>
                    <FormControlHelperText accessibilityLabel={localize('password.rule')} style={styles.helperText}>
                        {localize('password.rule')}
                    </FormControlHelperText>
                </FormControlHelper>
                <PasswordField
                    value={confirmPassword}
                    onChangeText={setConfirmPassword} 
                    placeholder={localize('password.confirm')}
                    error={confirmPassword !== password}
                />
                <Select
                    options={languageOptions}
                    selectedValue={language}
                    onValueChange={setLanguage}
                    placeholder={localize('language.select_language')}
                    error={errorsFields.includes('language')}

                />
                <Select
                    options={currencyOptions}
                    selectedValue={accountCurrency}
                    onValueChange={setAccountCurrency}
                    placeholder={localize('currency.select_account_currency')}
                    error={errorsFields.includes('accountCurrency')}
                />
            </FormControl>
        
            <View style={styles.rulesContainer}>
                <ForexRulesTable
                    takeProfitRules={takeProfitRules}
                    stopLossRules={stopLossRules}
                    onTakeProfitChange={setTakeProfitRules}
                    onStopLossChange={setStopLossRules}
                />
            </View>
            <Button
                title={localize('signup')}
                onPress={handleSignUp}
                variant='primary'
                size='lg'
                accessibilityLabel={localize('signup')}
                testID='sign-up-button'
            />
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
        padding: 20,
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