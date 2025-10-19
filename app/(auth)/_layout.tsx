import { Stack } from 'expo-router';
import { useTranslate } from '@/hooks/useTranslate';

export default function TabLayout() {
  const { localize } = useTranslate();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: localize('login'),
          headerShown: false,
          animation: 'none'
        }}
        
      />
      <Stack.Screen
        name="signup"
        options={{
          title: localize('signup'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="resetpassword"
        options={{
          title: localize('password.reset'),
          headerShown: false,
        }}
      />
    </Stack>
  );
}
