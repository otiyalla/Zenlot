import React from 'react';
import { View, useColorScheme, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background

  return <View style={[styles.background, { backgroundColor }]} />;
};


const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
 