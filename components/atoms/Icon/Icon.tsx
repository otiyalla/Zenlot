import React from 'react';
import { FontAwesome6, MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { ColorValue, StyleProp, TextStyle } from 'react-native';
import { Icon as GSIcon } from '@/components/design-system/ui';
import { IIconComponentType } from '@gluestack-ui/icon/lib/createIcon';
import { SvgProps } from 'react-native-svg';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export type IconLibrary = 'fontawesome6' | 'material' | 'ionicons' | 'gluestack' | 'antdesign';

export interface IconProps {
  name: string;
  library?: IconLibrary;
  size?: number;
  color?: string;
  weight?: 'regular' | 'bold' | 'light' | 'duotone' | 'thin' | 'medium';
  style?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  as?: IIconComponentType<SvgProps | {fill?: ColorValue, stroke?: ColorValue}>; // For compatibility with other icon components
}

export const Icon: React.FC<IconProps> = ({
  name,
  library = 'fontawesome6',
  size = 24,
  color,
  style,
  accessibilityLabel,
  as,
}) => {
  const theme = Colors[useColorScheme() as 'light' | 'dark'];
  const gsSizeMap: { [key: number]: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' } = {
    12: '2xs',
    16: 'xs',
    20: 'sm',
    24: 'md',
    32: 'lg',
    40: 'xl',
  };

  const iconProps = {
    name: name as any,
    size,
    color: color ?? theme.text,
    style,
    accessibilityLabel,
    as: as as any,
  };

  switch (library) {
    case 'material':
      return <MaterialIcons {...iconProps} />;
    case 'ionicons':
      return <Ionicons {...iconProps} />;
    case 'antdesign':
      return <AntDesign {...iconProps} />;
    case 'gluestack': {
      // Map numeric size to GSIcon variant
      const gsIconProps = {
        ...iconProps,
        size: gsSizeMap[size] || 'md', // default to 'md' if not mapped
        fill: theme.invesetext as string,
      };
      return <GSIcon {...gsIconProps}  />;
    }
    case 'fontawesome6':
    default:
      return <FontAwesome6 {...iconProps} />;
  }
};
