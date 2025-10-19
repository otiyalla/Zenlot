import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Alert } from 'react-native';
import { Text, Button, Icon} from '@/components/atoms';
import { useUser } from '@/providers/UserProvider';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { HStack, VStack, EditIcon, AlertCircleIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/design-system/ui';
import { PasswordField } from '@/components/molecules';
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

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setError(localize('password.mismatch'));
        }
    
        if (passwordData.newPassword.length < 8) {
            return setError(localize('password.too_short'));
        }
    
        try {
            const validated = userPasswordValidation.parse(passwordData);
            const updated = await updatePassword(passwordData);
            if (!updated) return setError(localize('password.current_error'));
            setIsEditingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setError("");
            Alert.alert(localize('success'), localize('password.updated'));
        
        } catch (error) {
          console.error('Failed to update password:', error);
          setError(localize('password.update_failed'));
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
                    <Icon name={'edit'} library={'gluestack'} as={EditIcon} size={20} />
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
                    <PasswordField
                        placeholder={localize('password.current')}
                        value={passwordData.currentPassword}
                        onChangeText={(value: string) => {
                            setPasswordData(prev => ({ ...prev, currentPassword: value }));
                        }}
                        />
                    <PasswordField
                        placeholder={localize('password.new')}
                        value={passwordData.newPassword}
                        onChangeText={(value: string) => {
                            setPasswordData(prev => ({ ...prev, newPassword: value }));
                        }}
                        />
                    <PasswordField
                        placeholder={localize('password.confirm_new')}
                        value={passwordData.confirmPassword}
                        onChangeText={(value: string) => {
                            setPasswordData(prev => ({ ...prev, confirmPassword: value }));
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
  