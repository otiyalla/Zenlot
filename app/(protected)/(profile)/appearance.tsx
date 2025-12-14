import React, { useMemo, useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { SafeAreaView, Select, Text, Icon, Button } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { useUser } from '@/providers/UserProvider';
import { Colors, languageOptions, LanguageOptionType } from '@/constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useColorScheme as useRNColorSchema } from 'react-native';

import {
  Box,
  VStack,
  HStack,
  Divider,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  RadioGroup,
  RadioIcon,
  CircleIcon,
  Radio,
  RadioIndicator,
  RadioLabel,
} from '@/components/design-system/ui';
import { router } from 'expo-router';

type AppearanceMode = 'system' | 'light' | 'dark';

const APPEARANCE_OPTIONS: { label: string; value: AppearanceMode; icon?: any }[] = [
  { label: 'appearance.system', value: 'system', icon: () => <Icon name="mobile-screen" size={18} /> },
  { label: 'appearance.light', value: 'light', icon: () => <Icon name="sun" size={18} /> },
  { label: 'appearance.dark', value: 'dark', icon: () =>  <Icon name="moon" size={18} /> },
];


export default function Appearance() {
  const { localize } = useTranslate();
  const { user, update } = useUser();
  const scheme = useColorScheme() as 'light' | 'dark';
  const theme = Colors[scheme];
  const systemSchema = useRNColorSchema() as 'light' | 'dark';
  const systemTheme = Colors[systemSchema];

  const [language, setLanguage] = useState<LanguageOptionType>(user?.language);
  const [appearance, setAppearance] = useState<AppearanceMode>((user?.theme as AppearanceMode) || 'system');
  const [saving, setSaving] = useState(false);

  const PreviewTheme = useMemo(() => {
    if (appearance === 'system') return systemTheme;
    else return Colors[appearance];
  }, [appearance, theme, systemTheme]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await update({ ...user, language, theme: appearance });
      router.back();
    } catch (error) {
      console.log('Error updating user settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLanguage(user?.language as LanguageOptionType);
    setAppearance((user?.theme as AppearanceMode) || 'system');
    router.back();
  }

  return (
    <SafeAreaView>
      <Box style={styles.screen}>
        <VStack space="lg">
          
          <VStack space="xs">
            <Text variant="title" size="2xl" weight="semibold">
              {localize('user.appearance_language')}
            </Text>
            <Text color="secondary">
              {localize('user.appearance_language_desc')}
            </Text>
          </VStack>
          
          <Box style={{ ...styles.card, borderColor: theme.borderColor, backgroundColor: theme.secondary ?? theme.background }}>
            <VStack space="md">
              <HStack style={{alignItems: "center", justifyContent: "space-between"}} >
                <Text variant="heading" size="xl" weight="semibold">
                  {localize('language.language')}
                </Text>
                <Icon name="language" size={18} style={{opacity: 0.5}} />
              </HStack>

              <Divider />

              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>
                    <Text weight="medium">{localize('language.select_language')}</Text>
                  </FormControlLabelText>
                </FormControlLabel>

                <Select
                  options={languageOptions}
                  selectedValue={localize(`language.${language}`)}
                  onValueChange={(v) => setLanguage(v as LanguageOptionType)}
                />
              </FormControl>
            </VStack>
          </Box>

          <Box style={{ ...styles.card, borderColor: theme.borderColor, backgroundColor: theme.secondary ?? theme.background }}>
            <VStack space="md">
              <HStack style={{alignItems: "center", justifyContent: "space-between"}} >
              <Text variant="heading" size="xl" weight="semibold">
                {localize('user.appearance')}
              </Text>
              <Icon name="circle-half-stroke" size={18} style={{opacity: 0.5}} />
              </HStack>
              <Divider />

              <VStack space="md">
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>
                      <Text weight="medium">{localize('user.select_theme')}</Text>
                    </FormControlLabelText>
                  </FormControlLabel>

                  <RadioGroup
                    value={appearance}
                    onChange={(val: string) => setAppearance(val as AppearanceMode)}
                    accessibilityLabel={localize('user.select_theme')}
                  >
                    <HStack space="sm" 
                      style={{ 
                        flexDirection: 'column', 
                        justifyContent: 'space-between' 
                      }}>
                      {APPEARANCE_OPTIONS.map((opt) => (
                        <Radio
                          key={opt.value}
                          value={opt.value}
                          size="md"
                          className="px-3 py-2 rounded-lg border"
                        >
                          <HStack style={{alignItems:"center"}} space="md">
                            <RadioIndicator>
                              <RadioIcon as={CircleIcon}/>
                            </RadioIndicator>
                            <RadioLabel>{localize(opt.label)}</RadioLabel>
                            {opt.icon ? <opt.icon /> : null}
                          </HStack>
                        </Radio>
                      ))}
                    </HStack>
                  </RadioGroup>
                </FormControl>

                {/* Live preview */}
                <VStack
                  space="xs"
                  style={{
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.borderColor,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    style={{
                      backgroundColor: PreviewTheme.background,
                      padding: 16,
                    }}
                  >
                    <Text weight="semibold" size="lg" style={{ color: PreviewTheme.text }}>
                      {localize('user.preview_title')}
                    </Text>
                    <Text color="secondary" style={{ color: PreviewTheme.secondary, marginTop: 4 }}>
                      {localize('user.preview_desc')}
                    </Text>
                  </Box>
                </VStack>
              </VStack>
              
            </VStack>
          </Box>
          <HStack style={{justifyContent:"flex-start"}} space="md">
                <Button 
                  testID='appearance-save-button'
                  title={localize('common.save') }
                  onPress={handleSave}
                  disabled={saving || (language === user?.language && appearance === user?.theme)}
                  variant="success"
                />
                <Button
                  testID='appearance-cancel-button'
                  variant="danger"
                  title={localize('common.cancel')}
                  onPress={handleCancel}
                  backgroundColor={theme.danger}
                  color={theme.invesetext}
                />
              </HStack>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: Platform.OS === 'web' ? 20 : 0,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },

  buttonRow: {
    marginTop: 16,
    paddingVertical: 4,
  },
});
