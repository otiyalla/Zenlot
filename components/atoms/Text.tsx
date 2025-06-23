import React from "react";
import { Text, ITextProps } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface IText extends ITextProps {
  inverse?: boolean
}

export function TextComponent(props: IText) {
  const colorScheme = useColorScheme();
  const theme = props.inverse ? (colorScheme === 'light' ? 'dark' : 'light') : colorScheme;
  const style = {
    color: Colors[theme ?? 'light'].text,
    ...(Array.isArray(props.style)
      ? Object.assign({}, ...props.style)
      : props.style)
  };
  return (
    <Text
        {...props}
        style={style}
    />
  );
}
