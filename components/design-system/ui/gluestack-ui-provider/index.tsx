
import React, { useEffect } from 'react';
import { config } from './config';
import { View, ViewProps, Appearance } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';
import { useColorScheme } from 'nativewind';
import { useColorScheme as useRNColorScheme } from '@/hooks/useColorScheme';

export type ModeType = 'light' | 'dark' | 'system' ;

export function GluestackUIProvider({
  mode,
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const userColorScheme  = useRNColorScheme();
  
  // Validate and sanitize mode
  const validMode = mode && ['light', 'dark', 'system'].includes(mode) 
    ? mode 
    : (userColorScheme as ModeType) || useColorScheme();
  //const { colorScheme, setColorScheme } = useColorScheme();
  /*
  useEffect(() => {
    setColorScheme(userColorScheme as 'light' | 'dark');
  }, [userColorScheme])
  */
  return (
    <View
      style={[
        config[userColorScheme!],
        { flex: 1, height: '100%', width: '100%' },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}


