import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { HStack, VStack, EditIcon } from '@/components/design-system/ui';
import { Icon, Text, Button } from '@/components/atoms';
import { useUser } from '@/providers/UserProvider';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import {ForexRulesTable} from '@/components/organisms';
import { ForexRule } from "@/types";

  
export default function UserInfoSection() {
    const { user, update } = useUser();
    const { localize } = useTranslate();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [isEditingRules, setIsEditingRules] = useState(false);

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
        setIsEditingRules(false);
    
    }, [user]);

  const handleSaveRules = useCallback(async () => {
    try {
      const updatedUser = {
        ...user,
        rules: {
          forex: {
            take_profit: takeProfitRules.map(rule => ({ pips: rule.pips })),
            stop_loss: stopLossRules.map(rule => ({ pips: rule.pips })),
          },
        },
      };
      
      update(updatedUser);
      setIsEditingRules(false);
    } catch (error) {
      console.error('Failed to update rules:', error);
      Alert.alert(localize('error'), localize('rules_update_failed'));
    }
  }, [takeProfitRules, stopLossRules, user, update]);

    const buttonCommands = (
        <HStack space="sm" style={styles.buttonContainer}>
          <Button title={localize('common.save')} onPress={handleSaveRules} />
          <Button color={theme.danger} title={localize('common.cancel')} onPress={handleCancel} />
        </HStack>
      )

    return (
        <View style={[styles.section, { backgroundColor: theme.background, shadowColor: theme.textBorderColor }]}>
      <HStack style={styles.sectionHeader}>
       <Text bold size="lg" style={{ color: theme.text }}>
          {localize('trading_rules')}
        </Text>
        <TouchableOpacity
          onPress={() => setIsEditingRules(!isEditingRules)}
          style={styles.editButton}
        >
          <Icon name={'edit'} library={'gluestack'} as={EditIcon} size={20}  />
        </TouchableOpacity>
      </HStack>

      {isEditingRules && (
        <VStack space="md" style={styles.form}>
          <ForexRulesTable
            takeProfitRules={takeProfitRules}
            stopLossRules={stopLossRules}
            onTakeProfitChange={setTakeProfitRules}
            onStopLossChange={setStopLossRules}
            />
              {isEditingRules && buttonCommands}
        </VStack>
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
  