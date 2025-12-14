import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView, Text, Button } from '@/components/atoms';
import { useUser } from '@/providers/UserProvider';
import { useTranslate } from '@/hooks/useTranslate';
import {
  VStack,
  HStack,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  Progress,
  ProgressFilledTrack,
  AlertCircleIcon,
  Divider,
} from '@/components/design-system/ui';
import { PasswordField } from '@/components/molecules';
import { userPasswordValidation } from '@/validations';
import { router } from 'expo-router';

type PasswordState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function UserPasswordSection() {
  const { updatePassword, user } = useUser();
  const { localize } = useTranslate();


  const [passwordData, setPasswordData] = useState<PasswordState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PasswordState, string>>>({});
  const [formError, setFormError] = useState<string>('');

  const strength = useMemo(() => calcStrength(passwordData.newPassword), [passwordData.newPassword]);
  const strengthPct = (strength.score / 4) * 100;

  const handleChange =
    (field: keyof PasswordState) =>
    (value: string) => {
      setPasswordData((prev) => ({ ...prev, [field]: value }));
      setFormError('');
      setErrors((prev) => ({ ...prev, [field]: '' }));
    };
 
    const handleCancel = useCallback(() => {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
        setFormError('');
        router.back();
    }, []);

  const validateFields = useCallback(
    (data: PasswordState) => {
      const newErrors: Partial<Record<keyof PasswordState, string>> = {};

      if (!data.currentPassword?.trim()) {
        newErrors.currentPassword = 'password.current_required';
      }

      if (!data.newPassword?.trim()) {
        newErrors.newPassword = 'password.new_required';
      } else {
        if (data.newPassword.length < 8) {
          newErrors.newPassword = 'password.too_short';
        }
        if (data.newPassword === data.currentPassword) {
          newErrors.newPassword =
            'password.same_as_current';
        }
      }

      if (!data.confirmPassword?.trim()) {
        newErrors.confirmPassword = 'password.confirm_required';
      } else if (data.newPassword !== data.confirmPassword) {
        newErrors.confirmPassword = 'password.mismatch';
      }

      return newErrors;
    },
    [localize]
  );

  const isFormValid = useMemo(() => {
    const e = validateFields(passwordData);
    return Object.values(e).every((v) => !v);
  }, [passwordData, validateFields]);

  const handleSavePassword = useCallback(async () => {
    setFormError('');
    const fieldErrors = validateFields(passwordData);
    if (Object.values(fieldErrors).some(Boolean)) {
      setErrors(fieldErrors);
      return;
    }
    try {
      setSaving(true);
      userPasswordValidation.parse(passwordData);

      const ok = await updatePassword(passwordData);
      if (!ok) {
        setFormError(localize('password.current_error'));
        return;
      }

      handleCancel();
      Alert.alert(localize('success'), localize('password.updated'));
    } catch (err) {
      console.error('Failed to update password:', err);
      setFormError(localize('password.update_failed'));
    } finally {
      setSaving(false);
    }
  }, [passwordData, updatePassword, localize, handleCancel, validateFields]);

  return (
    <SafeAreaView style={styles.section}>
      <VStack space="lg">
        <VStack space="xs">
          <Text variant="title" size="3xl" weight="semibold">
            {localize('password.change')}
          </Text>
          <Text color="secondary">
            {localize('password.change_desc')}
          </Text>
        </VStack>

        <Divider />

        <FormControl isInvalid={!!formError}>
          {formError ? (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText accessibilityLabel={formError}>{formError}</FormControlErrorText>
            </FormControlError>
          ) : null}

          <PasswordField
              placeholder={localize('password.current')}
              label={localize('password.current') }
              error={!!errors.currentPassword}
              value={passwordData.currentPassword}
              onChangeText={handleChange('currentPassword')}
              testID="current-password"
              helperText={errors.currentPassword && localize(`${errors.currentPassword}`)}
            />

            <VStack space="xs" style={{ marginTop: 6 }}>
                <HStack style={{justifyContent:"space-between", alignItems:"center"}}>
                    <Text variant="caption" color="secondary">
                    {localize('password.strength')}: { strength.label.length > 1 ? localize(`password.${strength.label}`) : null}
                    </Text>
                    <Text variant="caption" color="secondary">
                    {strength.hints.join(' • ')}
                    </Text>
                </HStack>
                <Progress value={strengthPct} size="xs">
                    <ProgressFilledTrack/>
                </Progress>
            </VStack>

            <PasswordField
                placeholder={localize('password.new')}
                label={localize('password.new')}
                error={!!errors.newPassword}
                value={passwordData.newPassword}
                onChangeText={handleChange('newPassword')}
                testID="new-password"
                helperText={errors.newPassword && localize(`${errors.newPassword}`)}
            />
          
            <PasswordField
                placeholder={localize('password.confirm_new')}
                label={localize('password.confirm_new')}
                error={!!errors.confirmPassword}
                value={passwordData.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                testID="confirm-password"
                helperText={errors.confirmPassword && localize(`${errors.confirmPassword}`)}
            />
            <HStack space="sm" style={styles.buttonRow}>
                <Button
                variant="success"
                title={localize('common.save')}
                onPress={handleSavePassword}
                disabled={ saving}
                testID="save-password"
                />
                <Button
                variant="danger"
                title={localize('common.cancel')}
                onPress={handleCancel}
                disabled={saving}
                />
            </HStack>
        </FormControl>
      </VStack>
    </SafeAreaView>
  );
}

/** Simple strength scorer: 0..4 with label + hints */
function calcStrength(pw: string) {
  const hints: string[] = [];
  let score = 0;

  if (pw.length >= 8) score++; else hints.push('8+ chars');
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++; else hints.push('Aa');
  if (/\d/.test(pw)) score++; else hints.push('1-9');
  if (/[^A-Za-z0-9]/.test(pw)) score++; else hints.push('@#$');

  const label =
    score >= 4 ? 'strong' : score === 3 ? 'moderate' : score === 2 ? 'weak' : pw ? 'very_weak' : '—';

  return { score, label, hints: hints.slice(0, 2) }; // show up to 2 nudges
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
    paddingTop: 40,
    
  },
  buttonRow: {
    marginTop: 16,
    paddingVertical: 4,
  },
});
