
import React from 'react';
import {View, Text} from 'react-native';
import { SafeAreaViewComponent as SafeAreaView } from '@/components/atoms/SafeAreaView';

//TODO: History - Trading history, Jornel. success and performance metrics

export default function History() {
  return (
    <SafeAreaView>
      <View>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>History</Text>
        <Text style={{ marginTop: 8 }}>This is the history screen where you can view your trading history and performance metrics.</Text>
      </View>
    </SafeAreaView>
  );
}
