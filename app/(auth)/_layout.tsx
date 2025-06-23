import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Login',
          headerShown: false,
          animation: 'none'
        }}
        
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign Up',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="resetpassword"
        options={{
          title: 'Password Reset',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
