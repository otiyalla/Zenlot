import React, { useState, useCallback } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { HStack, VStack, Switch, Divider } from '@/components/design-system/ui';
import { Text, Button, SafeAreaView } from '@/components/atoms';
import { useUser } from '@/providers/UserProvider';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import {ForexRulesTable} from '@/components/organisms';
import { ForexRule } from "@/types";
import { router } from 'expo-router';
  
export default function UserInfoSection() {
    const { user, update } = useUser();
    const { localize } = useTranslate();
    const colorScheme = useColorScheme() as 'light' | 'dark';
    const theme = Colors[colorScheme];

    const { togglePipValue } = user;
    const [ togglePips, setTogglePips ] = useState(togglePipValue || false);
    
    const [takeProfitRules, setTakeProfitRules] = useState<ForexRule[]>(
        user?.rules?.forex?.take_profit?.map((rule, index) => ({
          id: index.toString(),
          pips: rule.pips,
          type: 'take_profit' as const,
        })) || []
      );
      const [stopLossRules, setStopLossRules] = useState<ForexRule[]>(
        user?.rules?.forex?.stop_loss?.map((rule, index) => ({
          id: index.toString(),
          pips: rule.pips,
          type: 'stop_loss' as const,
        })) || []
      );

    const handleCancel = useCallback(() => {
        router.back();
    }, [user]);

  const handleSaveRules = useCallback(async () => {
    try {
      const updatedUser = {
        ...user,
        togglePipValue: togglePips,
        rules: {
          forex: {
            take_profit: takeProfitRules.map(rule => ({ pips: rule.pips })),
            stop_loss: stopLossRules.map(rule => ({ pips: rule.pips })),
          },
        },
      };
      
      update(updatedUser);
      handleCancel();
      
    } catch (error) {
      console.error('Failed to update rules:', error);
      Alert.alert(localize('error'), localize('rules_update_failed'));
    }
  }, [togglePips, takeProfitRules, stopLossRules, user, update]);

    const buttonCommands = (
        <HStack space="sm" style={styles.buttonContainer}>
          <Button variant='success' title={localize('common.save')} onPress={handleSaveRules} />
          <Button variant='danger' title={localize('common.cancel')} onPress={handleCancel} />
        </HStack>
      )

    return (
        <SafeAreaView style={[styles.section, { backgroundColor: theme.background, shadowColor: theme.textBorderColor }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
          <Text variant='title' size='3xl' weight='semibold'>
            {localize('trading_rules')}
        </Text>
        <Text color="secondary">
            {localize('modify_trading_rules')}
        </Text>
        <Divider style={{marginTop: 20}}/>

        <VStack space="md" style={styles.form}>
            <Text weight='medium' >
                {localize('show_gain_in_loss_desc')}
            </Text>
            <HStack style={{
                justifyContent: 'space-evenly'}}>
                <Text  variant='subtitle' size="sm">{localize('base_currency')}</Text>
                <Switch
                    defaultValue={togglePips}
                    trackColor={{ false: theme.secondary, true: theme.primary }}
                    onValueChange={(value: boolean) => setTogglePips(value)}
                    thumbColor={theme.invesetext}
                    ios_backgroundColor={theme.secondary}
                />
                <Text variant='subtitle' size="sm">{localize('forex.pips')}</Text>
            </HStack>
        </VStack>

        <Divider style={{marginTop: 10}}/>
        <VStack space="md" style={styles.form}>
            <ForexRulesTable
                takeProfitRules={takeProfitRules}
                stopLossRules={stopLossRules}
                onTakeProfitChange={setTakeProfitRules}
                onStopLossChange={setStopLossRules}
            />
        </VStack>
        {buttonCommands}
        </ScrollView>
    </SafeAreaView>
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
      paddingVertical: 8,
    }
  });
  