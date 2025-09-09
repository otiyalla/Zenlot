import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { HStack, VStack, EditIcon, AlertCircleIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText  } from '@/components/ui';
import { IconComponent as Icon } from '@/components/atoms/Icon';
import { TextComponent as Text } from '@/components/atoms/Text';
import { TextInputComponent as TextInput } from '@/components/atoms/TextInput';
import { useUser } from '@/providers/UserProvider';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, languageOptions, currencyOptions } from '@/constants';
import Selection from '@/components/atoms/Selection';
import { ButtonComponent as Button } from '@/components/atoms/Button';
import { userInfoValidation } from '@/validations';

export default function UserInfoSection() {
    const { user, update } = useUser();
    const { localize } = useTranslate();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fname: user?.fname || '',
        lname: user?.lname || '',
        email: user?.email || '',
        language: user?.language || 'en',
        accountCurrency: user?.accountCurrency || 'cad',
    });

    useEffect(() => {
        if(!user) return
        setFormData({
            fname: user?.fname || '',
            lname: user?.lname || '',
            email: user?.email || '',
            language: user?.language,
            accountCurrency: user?.accountCurrency,
        });

    }, [user])


    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setFormData({
        fname: user?.fname || '',
        lname: user?.lname || '',
        email: user?.email || '',
        language: user?.language,
        accountCurrency: user?.accountCurrency,
        });
        setError('');
    }, [user]);



    //TODO: Review where there is an error in personal info update. Make the border red when there is an error on that field
    const handleSaveProfile = useCallback(async () => {
    try {
        const updatedUser = {
        ...user,
        ...formData,
        };

        const validated = userInfoValidation.parse(updatedUser)
        
        update(validated);
        setIsEditing(false);
    } catch (error) {
        console.error('Failed to update profile:', error);
        //Alert.alert(localize('update_error'), localize('user.profile_update_failed'));
        setError(localize('user.profile_update_failed'));
    }
    }, [formData, user, update]);
    

    const buttonCommands = (
        <HStack space="sm" style={styles.buttonContainer}>
          <Button title={localize('common.save')} onPress={handleSaveProfile} />
          <Button color={theme.danger} title={localize('common.cancel')} onPress={handleCancel} />
        </HStack>
      )

    return (
        <View style={[styles.section, { backgroundColor: theme.background, shadowColor: theme.text, boxShadow: theme.text }]}>
        <HStack style={styles.sectionHeader}>
        <Text bold size="lg" style={{ color: theme.text }}>
            {localize('user.personal_information')}
            </Text>
            <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
            >
            <Icon as={EditIcon} size="sm"  />
            </TouchableOpacity>
        </HStack>

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
                <View>
                <Text style={[styles.label, { color: theme.text }]}>
                    {localize('user.first_name')}
                </Text>
                <TextInput
                    value={formData.fname}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, fname: text }))}
                    editable={isEditing}
                    placeholder={localize('user.enter_first_name')}
                    style={{ 
                    backgroundColor: isEditing ? theme.background : theme.background,
                    borderColor: theme.textBorderColor 
                    }}
                />
                </View>

                <View>
                <Text style={[styles.label, { color: theme.text }]}>
                    {localize('user.last_name')}
                </Text>
                <TextInput
                    value={formData.lname}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, lname: text }))}
                    editable={isEditing}
                    placeholder={localize('user.enter_last_name')}
                    style={{ 
                    backgroundColor: isEditing ? theme.background : theme.background,
                    borderColor: !!error ? theme.danger : theme.textBorderColor 
                    }}
                />
                </View>

                <View>
                <Text style={[styles.label, { color: theme.text }]}>
                    {localize('email')}
                </Text>
                <TextInput
                    value={formData.email}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                    editable={isEditing}
                    placeholder={localize('user.enter_email')}
                    keyboardType="email-address"
                    style={{ 
                    backgroundColor: isEditing ? theme.background : theme.background,
                    borderColor: theme.textBorderColor 
                    }}
                />
                </View>

                <View>
                <Text style={[styles.label, { color: theme.text }]}>
                    {localize('language.language')}
                </Text>
                <Selection
                    disable={!isEditing}
                    options={languageOptions}
                    selectedValue={localize(`language.${formData.language}`)}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, language: value as 'en' | 'fr' }))}
                />
                </View>

                <View>
                <Text style={[styles.label, { color: theme.text }]}>
                    {localize('account_currency')}
                </Text>
                <Selection
                    disable={!isEditing}
                    options={currencyOptions}
                    selectedValue={localize(`currency.${formData.accountCurrency}`)}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, accountCurrency: value }))}
                />
                </View>

                {isEditing && ( buttonCommands )}
            </VStack>
        </FormControl>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
      borderRadius: 12,
      padding: 20,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionHeader: {
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    editButton: {
      padding: 8,
      borderRadius: 8,
    },
    form: {
      marginTop: 10,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    buttonContainer: {
      marginTop: 20,
      flex: 1,
      paddingVertical: 8,
    }
  });
  