import { useFonts } from 'expo-font';
import { Stack, type ErrorBoundaryProps} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GluestackUIProvider } from '@/components/design-system/ui';
import { Loading }  from '@/components/atoms/Spinner';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {  AuthProvider } from '@/providers/AuthProvider';
import { UserProvider } from '@/providers/UserProvider';
import { SafeAreaView, Text } from '@/components/atoms';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return <Loading/>;
  }
  
  return (
        <SafeAreaProvider>
          <GluestackUIProvider mode={colorScheme as 'light' | 'dark'} >
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

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: 20
    }}>
      <Text style={{ color: 'red', fontSize: 18, marginBottom: 20 }}>
        App Error
      </Text>
      <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
        {error.message}
      </Text>
      <Text 
        onPress={retry}
        style={{ 
          color: '#007AFF', 
          fontSize: 16, 
          textDecorationLine: 'underline' 
        }}
      >
        Try Again
      </Text>
    </SafeAreaView>
  );
}
