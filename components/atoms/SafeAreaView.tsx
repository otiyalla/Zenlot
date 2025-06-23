import React, { ComponentProps, useEffect } from "react";
import {  StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from 'react-native-safe-area-context';

type SafeAreaViewProps = ComponentProps<typeof SafeAreaView>

export function SafeAreaViewComponent(props: SafeAreaViewProps) {
  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"].background,
    },
  });

  useEffect(() => {
    styles.container.backgroundColor = Colors[colorScheme ?? "light"].background;
  }, [colorScheme]);

  return (
    <SafeAreaView
      {...props}
      style={[styles.container, props.style]}
    >
      {props.children}
    </SafeAreaView>
  );
}
