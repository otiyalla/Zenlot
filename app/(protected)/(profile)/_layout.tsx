
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslate } from '@/hooks/useTranslate';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View } from 'react-native';

export default function RootLayout() {
    const { localize } = useTranslate()
    const colorScheme = useColorScheme() as 'light' | 'dark';
    const theme = Colors[colorScheme];
  return (
      
        <SafeAreaProvider>
                <Stack 
                    screenOptions={{
                        headerShown: false,
                        headerTintColor: theme.text,
                        headerTitleStyle: { color: theme.text },
                        headerBackground: () => (
                        <View style={{ flex: 1, backgroundColor: theme.background }} />
                        ),
                    }}
                >
                  <Stack.Screen name='appearance' options={{
                        animation: 'fade',
                        title: localize('user.appearance_language'),
                        headerShown: false
                    }}
                    />
                    <Stack.Screen name='passwordchange' options={{
                        animation: 'fade',
                        title: localize('password.change'),
                        headerShown: false,
                    }}
                    />
                    <Stack.Screen name='tradingrules' options={{
                        animation: 'fade',
                        title: localize('trading_rules'),
                        headerShown: false
                    }}
                    />
                </Stack>
        </SafeAreaProvider>
        
  );
}
