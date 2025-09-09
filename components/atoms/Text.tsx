import React from "react";
import { Text, ITextProps } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface IText extends ITextProps {
  inverse?: boolean
  error?: boolean
}

export function TextComponent(props: IText) {
  const colorScheme = useColorScheme();
  const theme = props.inverse ? (colorScheme === 'light' ? 'dark' : 'light') : colorScheme;
  const style = {
    color: props.error ? Colors[theme ?? 'light'].error : Colors[theme ?? 'light'].text,
    ...(Array.isArray(props.style)
      ? Object.assign({}, ...props.style.flat().filter(Boolean))
      : props.style)
  };
  return (
    <Text
        {...props}
        style={style}
    />
  );
}
