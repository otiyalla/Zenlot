import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { TextComponent as Text } from '@/components/atoms/Text';
import { TextInputComponent as TextInput } from '@/components/atoms/TextInput'
import { VStack, HStack, TrashIcon, AddIcon } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconComponent as Icon } from '@/components/atoms/Icon';
import { ButtonComponent as Button } from '@/components/atoms/Button';
import { ForexRule, ForexRulesTableProps } from "@/types";

const MAX_RULES = 5; 

const ForexRulesTable: React.FC<ForexRulesTableProps> = ({
  takeProfitRules,
  stopLossRules,
  onTakeProfitChange,
  onStopLossChange,
}) => {
  const { localize } = useTranslate();
  const [newPips, setNewPips] = useState('');
  const [activeType, setActiveType] = useState<'take_profit' | 'stop_loss'>('take_profit');
  const colorScheme = useColorScheme();
  const themeColor = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const styles = StyleSheet.create({
    input: {
      margin: 5,
      padding: 10,
      borderRadius: 10,
      borderColor: Colors[colorScheme ?? "light"].textBorderColor,
      borderWidth: 2,
      paddingHorizontal: 10,
      color: Colors[colorScheme ?? "light"].text,
      backgroundColor: Colors[colorScheme ?? "light"].background,
  
    },
  });

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
      {rules.map((rule) => (
        <View
          key={rule.id}
          className="flex-row justify-between items-center p-3 rounded-lg border border-gray-200"
          style={{
            backgroundColor: themeColor.background,
            borderColor: themeColor.textBorderColor,
          }}
        >
          <View className="flex-row items-center space-x-2">
            <View
              className={`w-2 h-2 mr-3 rounded-full`}
              style={{
                backgroundColor: type === 'take_profit' ? themeColor.success : themeColor.error,
              }}
            />
            <Text className="font-medium">
            {rule.pips} {localize('forex.pips')}
            </Text>
          </View>
          <TouchableOpacity onPress={() => removeRule(rule.id, type)}>
            <Icon as={TrashIcon} size="sm" color={themeColor.error} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View className="space-y-4 w-full">
      <Text className="text-lg font-bold">
        {localize('forex.rules')}
      </Text>
      
      <HStack space="sm">
        <Button title={localize('forex.take_profit')} onPress={() => setActiveType('take_profit')} color={activeType === 'take_profit' ? themeColor.success : themeColor.borderColor} />
        <Button title={localize('forex.stop_loss')} onPress={() => setActiveType('stop_loss')} color={activeType === 'stop_loss' ? themeColor.error : themeColor.borderColor} />
      </HStack>

      <View className="space-y-2 w-full">
        <Text bold className="text-base">
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
            className="p-2 bg-blue-500 rounded-lg"
            >
                <Icon as={AddIcon} size="sm" color="white" />
          </TouchableOpacity>
        )}
        </View>
      </View>
      
      {(takeProfitRules.length > 0 || stopLossRules.length > 0) && (
        <VStack space='md' className="w-full"
            style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: themeColor.textBorderColor,
                padding: 15,
                margin: 5,
            }}
            >
            {takeProfitRules.length > 0 && (
                <View>
                    <Text
                    style={{
                        color: themeColor.success,
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginBottom: 10,
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        textShadowColor: themeColor.success,

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
                        color: themeColor.danger,
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginBottom: 10,
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        textShadowColor: themeColor.danger,
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

export default ForexRulesTable; 