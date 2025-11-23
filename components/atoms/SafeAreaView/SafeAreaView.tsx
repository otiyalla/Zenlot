import React, { ComponentProps } from "react";
import {  StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider as RNSafeAreaView } from 'react-native-safe-area-context';

export type SafeAreaViewProps = ComponentProps<typeof RNSafeAreaView>

export const SafeAreaView: React.FC<SafeAreaViewProps> = (props) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });


  return (
    <RNSafeAreaView
      {...props}
      style={[styles.container, props.style]}
    >
      {props.children}
    </RNSafeAreaView>
  );
}
