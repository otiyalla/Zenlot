import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/atoms/HapticTab';
import { Icon } from '@/components/atoms';
import { TabBarBackground }  from '@/components/atoms';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTranslate } from '@/hooks/useTranslate';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { localize } = useTranslate();

  return (
      <Tabs
        backBehavior='order'
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].primary,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].secondary,
          tabBarButton: HapticTab,
          //tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              borderTopColor: Colors[colorScheme ?? 'light'].borderColor,
              borderTopWidth: 1
            },
            android: {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              borderTopColor: Colors[colorScheme ?? 'light'].borderColor,
              borderTopWidth: 1,
            },
            default: {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              borderTopColor: Colors[colorScheme ?? 'light'].borderColor,
              borderTopWidth: 1,
            },
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: localize('home'),
            tabBarIcon: ({ color }) => <Icon size={24} name="house" color={color} />,
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: localize('journals'),
            tabBarIcon: ({ color }) => <Icon size={24} name="book" color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: localize('history'),
            tabBarIcon: ({ color }) => <Icon size={24} name="rotate-left" color={color} />,
          }}
          /*listeners={{ 
            tabPress: (e) => {
              // Prevent default action
              console.log('History tab pressed:', e);
              //e.preventDefault();
              // Redirect user to login page

            },
          }}*/
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: localize('profile'),
            tabBarIcon: ({ color }) => <Icon size={24} name="user" color={color} />,
          }}
        />
      </Tabs>
  );
}
