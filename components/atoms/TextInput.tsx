import React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export function TextInputComponent(props: TextInputProps) {
  const colorScheme = useColorScheme();
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
  const propstyle = props.style;
  return (
    <TextInput
      {...props}
      style={[styles.input, propstyle]}
      placeholderTextColor={Colors[colorScheme ?? "light"].placeholderTextColor}
    />
  );
}
