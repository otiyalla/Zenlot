import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import Loading  from '@/components/atoms/Spinner';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {  AuthProvider } from '@/providers/AuthProvider';
import { UserProvider } from '@/providers/UserProvider';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    <Loading />
    return null;
  }
  
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode={colorScheme as 'light' | 'dark' ?? 'light'} >
       <AuthProvider>
        <UserProvider>
        
          <Stack initialRouteName='(protected)'>
            <Stack.Screen name='(protected)' options={{
              headerShown: false,
              animation: 'none'
            }}/>
            <Stack.Screen name="(auth)" options={{ headerShown: false,
              title: 'Zenlot',
              animation: 'none',
            }} />
          </Stack>
          <StatusBar style='auto' />
        </UserProvider>
        </AuthProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
