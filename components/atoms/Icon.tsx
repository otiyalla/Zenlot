import { type ComponentProps } from 'react';
import { Icon } from '@/components/ui';
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
type Props = ComponentProps<typeof Icon> ;

export function IconComponent({ ...rest }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Icon color={theme.text} fill={theme.background} {...rest} />
  );
}