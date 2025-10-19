import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { PageTemplate } from '@/components/templates';
import { CollapsibleSection } from '@/components/molecules';
import { Text, Button } from '@/components/atoms';
import { useTranslate } from '@/hooks/useTranslate';
import { useUser } from '@/providers/UserProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { formatDate, localizeTimeZoneName } from '@/constants';

export interface ProfilePageProps {
  onEditProfile: () => void;
  onAppearance: () => void;
  onPasswordChange: () => void;
  onRules: () => void;
  onLogout: () => void;
  testID?: string;
}
//TODO: Refactor styles to use theme colors
export const ProfilePage: React.FC<ProfilePageProps> = ({
  onEditProfile,
  onAppearance,
  onPasswordChange,
  onRules,
  onLogout,
  testID,
}) => {
  const { localize } = useTranslate();
  const { user } = useUser();
  const createdAt  = user.createdAt ?? new Date();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  /*
  //personal settings
    fname
    lname
    email
    account currency
    timezone
    created at

  // trading rules and preference
    Set pips, stop lose and others.
    Toggle b/w pip and price
    Add tags for the kind of trade, if emotional or others - TODO

  */

    const handleLogout = () => {
      if (!onLogout) return;
      if (Platform.OS === "web"){
        onLogout();
      }else{
        Alert.alert(
          localize('logout'),
          localize('logout_confirmation'),
          [
            {
              text: localize('logout'),
              style: 'destructive',
              onPress: () => {
                onLogout();
              },
            },
            { text: localize('common.cancel'), style: 'cancel' },
          ]
        );
      }
  };
  
  return (
    <PageTemplate
      title={localize('profile')}
      testID={testID}
    >
      <ScrollView style={styles.container}>
        <CollapsibleSection
          title={localize('user.personal_information')}
          defaultOpen={true}
        >
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('user.name')}
              </Text>
              <Text weight="semibold">
                {`${user.fname} ${user.lname}`}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('email')}
              </Text>
              <Text weight="semibold">
                {user.email}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('account_currency')}
              </Text>
              <Text weight="semibold">
                {localize(`currency.${user.accountCurrency}`)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('user.timezone')}
              </Text>
              <Text weight="semibold">
                {localizeTimeZoneName(user.timezone, user.language)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('user.member_since')}
              </Text>
              <Text weight="semibold">
                {formatDate(createdAt, user.language)}
              </Text>
            </View>
          </View>
        </CollapsibleSection>

        <CollapsibleSection
          title={localize('user.appearance_language')}
        >
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('user.appearance')}
              </Text>
              <Text weight="semibold">
                {localize(`appearance.${user.theme}`)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('language.language')}
              </Text>
              <Text weight="semibold">
                {localize(`language.${user.language}`)}
              </Text>
            </View>
            
            <Button icon={'edit'} size='sm' variant='outline' title={localize('common.edit')} onPress={onAppearance}/>
          </View>
        </CollapsibleSection>

        <CollapsibleSection
          title={localize('user.security')}
        >
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('user.authentication_method')}
              </Text>
              <Text weight="semibold">
                {localize(`password.password`)}
              </Text>
            </View>

            <Button icon={'edit'} size='sm' variant='outline' title={localize('password.change')} onPress={onPasswordChange}/>
          </View>
        </CollapsibleSection>
        
        <CollapsibleSection
          title={localize('trading_rules')}
        >
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('show_gain_in_loss')}
              </Text>
              <Text weight="semibold">
                {localize(`${user.togglePipValue ? 'forex.pips' : 'base_currency' }`)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('default.tp')}
              </Text>
              <Text weight="semibold">
                {`${user.rules.forex.take_profit.map(p => p.pips).join(', ')} ${localize('forex.pips')}`}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('default.sl')}
              </Text>
              <Text weight="semibold">
                {`${user.rules.forex.stop_loss.map(p => p.pips).join(', ')} ${localize('forex.pips')}`}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('default.lot')}
              </Text>
              <Text weight="semibold">
                {user.rules.forex?.lot_size || 'N/A'}
              </Text>
            </View>

            <Button icon={'edit'} size='sm' variant='outline' title={localize('modify_trading_rules')} onPress={onRules}/>
          </View>
        </CollapsibleSection>

        <CollapsibleSection
          title={localize('account_actions')}
        >
          <View style={styles.infoCard}>
            <Button
              title={localize('user.edit_profile')}
              variant="outline"
              onPress={onEditProfile}
            />
            
            <Button
              title={localize('logout')}
              onPress={handleLogout}
              variant="outline"
              borderColor={theme.danger}
              color={theme.danger}
            />
          </View>
        </CollapsibleSection>
        
        <CollapsibleSection
          title={localize('app_information')}
          defaultOpen={true}
        >
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('app_version')}
              </Text>
              <Text weight="semibold">
                1.0.0
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="caption" color="secondary">
                {localize('last_update')}
              </Text>
              <Text weight="semibold">
                {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        </CollapsibleSection>
      </ScrollView>
    </PageTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

