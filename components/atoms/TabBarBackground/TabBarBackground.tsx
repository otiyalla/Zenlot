import React from 'react';
import { View, useColorScheme, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export const TabBarBackground = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background
  //TODO: review this for when user is changing it from the device. Review for light, dark and system
  return <View style={[ { backgroundColor, zIndex: -1, flex: 1}]} />;
};

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}