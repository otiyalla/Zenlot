import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { Text } from '@/components/atoms';
import { useAuth } from '@/providers/AuthProvider';
import { useUser } from '@/providers/UserProvider';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { HStack, VStack } from '@/components/design-system/ui';

export default function UserHeader() {
    const { logout } = useAuth();
    const { user } = useUser();
    const { localize } = useTranslate();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const handleLogout = () => {
        if (Platform.OS === "web"){
          logout();
        }else{
          Alert.alert(
            localize('logout'),
            localize('logout_confirmation'),
            [
              {
                text: localize('logout'),
                style: 'destructive',
                onPress: () => {
                  logout();
                },
              },
              { text: localize('common.cancel'), style: 'cancel' },
            ]
          );
        }
      };
    
    return (
        <View style={[styles.header, { borderBottomColor: theme.textBorderColor }]}>
        <HStack style={styles.headerContent}>
          <VStack>
            <Text bold size="2xl" style={{ color: theme.text }}>
              {localize('profile')}
            </Text>
            <Text style={{ color: theme.lightText }}>
              {localize('welcome')}, {user?.fname} {user?.lname}!
            </Text>
          </VStack>
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.logoutButton, { backgroundColor: theme.error }]}
          >
            <Text bold>{localize('logout')}</Text>
          </TouchableOpacity>
        </HStack>
      </View>
    )
}

const styles = StyleSheet.create({
    header: {
      padding: 20,
      borderBottomWidth: 1,
    },
    headerContent: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoutButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
  });
  