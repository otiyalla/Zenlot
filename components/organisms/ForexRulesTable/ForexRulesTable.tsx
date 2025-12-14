import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { VStack, HStack, TrashIcon } from '@/components/design-system/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Button, Text, TextInput, Icon } from '@/components/atoms';
import { ForexRule, ForexRulesTableProps } from "@/types";

const MAX_RULES = 5; 

export const ForexRulesTable: React.FC<ForexRulesTableProps> = ({
  takeProfitRules,
  stopLossRules,
  onTakeProfitChange,
  onStopLossChange,
}) => {
  const { localize } = useTranslate();
  const [newPips, setNewPips] = useState('');
  const [activeType, setActiveType] = useState<'take_profit' | 'stop_loss'>('take_profit');
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const addRule = () => {
    const pipsValue = parseFloat(newPips);
    if (isNaN(pipsValue) || pipsValue <= 0) return;

    const newRule: ForexRule = {
      id: Date.now().toString(),
      pips: pipsValue,
      type: activeType,
    };

    if (activeType === 'take_profit') {
      onTakeProfitChange([...takeProfitRules, newRule]);
    } else {
      onStopLossChange([...stopLossRules, newRule]);
    }

    setNewPips('');
  };

  const removeRule = (id: string, type: 'take_profit' | 'stop_loss') => {
    if (type === 'take_profit') {
      onTakeProfitChange(takeProfitRules.filter(rule => rule.id !== id));
    } else {
      onStopLossChange(stopLossRules.filter(rule => rule.id !== id));
    }
  };

  const showAddButton = activeType === 'take_profit' ? takeProfitRules.length < MAX_RULES : stopLossRules.length < MAX_RULES;

  const renderRulesList = (rules: ForexRule[], type: 'take_profit' | 'stop_loss') => (
    <View className="space-y-2 w-full">
      {rules.sort((a, b) => a.pips - b.pips).map((rule) => (
        <View
          key={rule.id}
          className="mt-2 flex-row justify-between items-center p-3 rounded-lg border border-gray-200"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.textBorderColor,
          }}
        >
          <View className="flex-row items-center space-x-2">
            <View
              className={`w-2 h-2 mr-3 rounded-full`}
              style={{
                backgroundColor: type === 'take_profit' ? theme.success : theme.error,
              }}
            />
            <Text className="font-medium">
            {rule.pips} {localize('forex.pips')}
            </Text>
          </View>
          <TouchableOpacity onPress={() => removeRule(rule.id, type)}>
            <Icon library='gluestack' as={TrashIcon} name={'trash'} size={24} color={theme.error} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View>
      <Text size={'sm'} >
        {localize('forex.rules')}
      </Text>
      <HStack space="sm" className="w-full justify-around m-2">
        <Button title={localize('forex.take_profit')} onPress={() => setActiveType('take_profit')} backgroundColor={activeType === 'take_profit' ? theme.success : theme.borderColor} />
        <Button title={localize('forex.stop_loss')} onPress={() => setActiveType('stop_loss')} backgroundColor={activeType === 'stop_loss' ? theme.error : theme.borderColor} />
      </HStack>

      <View className="space-y-2 w-full">
        <Text weight='semibold' className="text-base">
          {activeType === 'take_profit' ? localize('forex.add_take_profit') : localize('forex.add_stop_loss')}
        </Text>
        
        <View className="flex-row space-x-2 items-center">
          <View className="flex-1">
            <TextInput
                placeholder={localize('forex.enter_pips')}
                value={newPips}
                onChangeText={setNewPips}
                keyboardType="numeric" 
            />
          </View>
          {showAddButton && (
            <TouchableOpacity 
            onPress={addRule}
            className="p-3 ml-2 bg-blue-500 rounded-lg"
            >
                {/* <Icon as={AddIcon} size="md" color="white" /> */}
                <Icon library='fontawesome6' name='add' size={20} color="white" />
          </TouchableOpacity>
        )}
        </View>
      </View>
      
      {(takeProfitRules.length > 0 || stopLossRules.length > 0) && (
        <VStack space='md' className="w-full"
            style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: theme.textBorderColor,
                padding: 15,
                margin: 5,
            }}
            >
            {takeProfitRules.length > 0 && (
                <View>
                    <Text
                    style={{
                        color: theme.success,
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginBottom: 10,
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        textShadowColor: theme.success,

                    }}
                    >
                        {localize('forex.take_profit_rules')} ({takeProfitRules.length})
                    </Text>
                    {renderRulesList(takeProfitRules, 'take_profit')}
                </View>
            )}

            {stopLossRules.length > 0 && (
                <View>
                    <Text 
                    style={{
                        color: theme.danger,
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginBottom: 10,
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        textShadowColor: theme.danger,
                    }}
                    >
                        {localize('forex.stop_loss_rules')} ({stopLossRules.length})
                    </Text>
                    {renderRulesList(stopLossRules, 'stop_loss')}
                </View>
            )}
        </VStack> )}
    </View>
  );
};