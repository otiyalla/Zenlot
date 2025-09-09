import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Alert } from 'react-native';
import { TextComponent as Text } from '@/components/atoms/Text';
import { ButtonComponent as Button } from '@/components/atoms/Button';
import { useUser } from '@/providers/UserProvider';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { HStack, VStack, EditIcon, AlertCircleIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui';
import { IconComponent as Icon } from '@/components/atoms/Icon';
import { PasswordInput } from '@/components/molecules';
import { userPasswordValidation } from '@/validations';

export default function UserPasswordSection() {
    const { user, updatePassword } = useUser();
    const { localize } = useTranslate();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [error, setError] = useState('');

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });


    const handleCancel = useCallback(() => {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsEditingPassword(false);
        setError('');
    }, [user]);

    const handleSavePassword = useCallback(async () => {

        console.log("the current: ", passwordData)
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setError(localize('passwords_dont_match'));
        }
    
        if (passwordData.newPassword.length < 8) {
            return setError(localize('password_too_short'));
        }
    
        try {
            //passwords are 123456789AA, 0987654321AA -- 0987654321QQ, 1234567890QQ
            const validated = userPasswordValidation.parse(passwordData);
            console.log('Password updated: ', validated);
            const updated = await updatePassword(passwordData);
            console.log('---- the update --- ', updated)
            if (!updated) return setError(localize('wrong_exisiting_password'));
            setIsEditingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setError("");
            Alert.alert(localize('success'), localize('password_updated'));
        
        } catch (error) {
          console.error('Failed to update password:', error);
          setError(localize('password_update_failed'));
        }
    }, [passwordData]); 


    const buttonCommands = (
        <HStack space="sm" style={styles.buttonContainer}>
          <Button title={localize('common.save')} onPress={handleSavePassword} />
          <Button color={theme.danger} title={localize('common.cancel')} onPress={handleCancel} />
        </HStack>
    )

    return (
        <View style={[styles.section, { backgroundColor: theme.background, shadowColor: theme.text, boxShadow: theme.text }]}>
            <HStack style={styles.sectionHeader}>
                <Text bold size="lg" style={{ color: theme.text }}>
                    {localize('change_password')}
                </Text>
                <TouchableOpacity
                    onPress={() => setIsEditingPassword(!isEditingPassword)}
                    style={styles.editButton}
                >
                    <Icon as={EditIcon} size="sm" />
                </TouchableOpacity>
            </HStack>
    
            {isEditingPassword && (
            <FormControl
                size='md'
                isRequired={true}
                isInvalid={!!error}
            >
                <VStack space="md" style={styles.form}>
                    {!!error && 
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText accessibilityLabel={error} >{error}</FormControlErrorText>
                        </FormControlError>
                    }
                    <PasswordInput
                        placeholder={localize('current_password')}
                        password={passwordData.currentPassword}
                        onChange={(value) => {
                            const newValue = typeof value === 'string' ? value : value(passwordData.currentPassword);
                            setPasswordData(prev => ({ ...prev, currentPassword: newValue }));
                        }}
                        />
                    <PasswordInput
                        placeholder={localize('new_password')}
                        password={passwordData.newPassword}
                        onChange={(value) => {
                            const newValue = typeof value === 'string' ? value : value(passwordData.newPassword);
                            setPasswordData(prev => ({ ...prev, newPassword: newValue }));
                        }}
                        />
                    <PasswordInput
                        placeholder={localize('confirm_new_password')}
                        password={passwordData.confirmPassword}
                        onChange={(value) => {
                            const newValue = typeof value === 'string' ? value : value(passwordData.confirmPassword);
                            setPasswordData(prev => ({ ...prev, confirmPassword: newValue }));
                        }}
                        />
        
                    {isEditingPassword && buttonCommands}
                </VStack>
            </FormControl>
            )}
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
    buttonContainer: {
      marginTop: 20,
      flex: 1,
      paddingVertical: 8,
    }
});
  