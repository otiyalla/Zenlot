import React, { ComponentProps, useEffect, useState } from "react";
import {  StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {  useColorScheme as useWebColorScheme } from "@/hooks/useColorScheme.web";
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


  return (
    <SafeAreaView
      {...props}
      style={[styles.container, props.style]}
    >
      {props.children}
    </SafeAreaView>
  );
}
