import React, { useState, useCallback, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { HStack, VStack, EditIcon, AlertCircleIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText  } from '@/components/design-system/ui';
import { Icon, Text, TextInput, Button, Select, SafeAreaView } from '@/components/atoms';
import { useUser } from '@/providers/UserProvider';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, parseErrors, currencyOptions } from '@/constants';
import { userInfoValidation } from '@/validations';
import { router } from 'expo-router';
import { ZodError } from 'zod';

export default function UserInfoSection() {
    const { user, update } = useUser();
    const { localize } = useTranslate();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [error, setError] = useState('');
    const [errorsFields, setErrorsFields] = useState<string[]>([]);    

    const [formData, setFormData] = useState({
        fname: user?.fname || '',
        lname: user?.lname || '',
        email: user?.email || '',
        accountCurrency: user?.accountCurrency || 'cad',
    });

    useEffect(() => {
        if(!user) return
        setFormData({
            fname: user?.fname || '',
            lname: user?.lname || '',
            email: user?.email || '',
            accountCurrency: user?.accountCurrency,
        });

    }, [user])


    const handleCancel = useCallback(() => {
        setFormData({
        fname: user?.fname || '',
        lname: user?.lname || '',
        email: user?.email || '',
        accountCurrency: user?.accountCurrency,
        });
        setError('');
        setErrorsFields([]);
        router.back();
    }, [user]);



    //TODO: Review where there is an error in personal info update. Make the border red when there is an error on that field
    const handleSaveProfile = useCallback(async () => {
    try {
        const updatedUser = {
        ...user,
        ...formData,
        };

        userInfoValidation.parse(updatedUser)
        update(updatedUser);
        handleCancel();
    } catch (error) {
        console.error('Failed to update profile:', error);
        if (error instanceof ZodError) {
            const {errorFields, errorMessage} = parseErrors(JSON.parse(error.message));
            setErrorsFields(errorFields);
        }
        setError(localize('user.profile_update_failed'));
    }
    }, [formData, user, update]);
    

    const buttonCommands = (
        <HStack space="sm" style={styles.buttonContainer}>
          <Button variant='success' title={localize('common.save')} onPress={handleSaveProfile} />
          <Button variant='danger' title={localize('common.cancel')} onPress={handleCancel} />
        </HStack>
      )

    return (
        <SafeAreaView style={styles.section}>
        <Text variant='title' size='3xl' weight='semibold'>
            {localize('user.personal_information')}
        </Text>
        

        <FormControl
            size='md'
            isRequired={true}
            isInvalid={!!error}
        >
             {!!error && 
                <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText accessibilityLabel={error} >{error}</FormControlErrorText>
                </FormControlError>
            }
            <VStack space="md" style={styles.form}>
                
                <Text weight='semibold'>
                    {localize('user.first_name')}
                </Text>
                <TextInput
                    value={formData.fname}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, fname: text }))}
                    placeholder={localize('user.enter_first_name')}
                    error={errorsFields.includes('fname')}
                />
                
                <Text weight='semibold'>
                    {localize('user.last_name')}
                </Text>
                <TextInput
                    value={formData.lname}
                    error={errorsFields.includes('lname')}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, lname: text }))}
                    placeholder={localize('user.enter_last_name')}  
                />
                
                <Text weight='semibold'>
                    {localize('email')}
                </Text>
                <TextInput
                    value={formData.email}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                    error={errorsFields.includes('email')}
                    placeholder={localize('user.enter_email')}
                    keyboardType="email-address"
                />
                
                <Text weight='semibold'>
                    {localize('account_currency')}
                </Text>
                <Select
                    options={currencyOptions}
                    error={errorsFields.includes('accountCurrency')}
                    selectedValue={localize(`currency.${formData.accountCurrency}`)}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, accountCurrency: value }))}
                />
            </VStack>
            {buttonCommands }
        </FormControl>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    section: {
      padding: 20,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    form: {
      marginTop: 10,
    },
    buttonContainer: {
      marginTop: 20,
      flex: 1,
      paddingVertical: 8,
    }
  });
  