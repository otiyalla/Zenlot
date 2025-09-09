import React, { useState, useCallback } from 'react';
import { Platform, StyleSheet, TouchableOpacity, ScrollView, View, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaViewComponent as SafeAreaView } from '@/components/atoms/SafeAreaView';
import { TextComponent as Text } from '@/components/atoms/Text';
import { TextInputComponent as TextInput } from '@/components/atoms/TextInput';
import { ButtonComponent as Button } from '@/components/atoms/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useUser } from '@/providers/UserProvider';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { HStack, VStack, EditIcon } from '@/components/ui';
import { IconComponent as Icon } from '@/components/atoms/Icon';
import UserInfoSection from './UserInfoSection';
import UserRulesSection from './UserRulesSection';
import UserPasswordSection from './UserPasswordSection';
import UserHeader from './UserHeader';

export default function Profile() {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const { user, update } = useUser();
  const { localize } = useTranslate();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

 
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
          <UserHeader/>
        <VStack space="lg" style={styles.content}>
          <UserInfoSection/>
          <UserPasswordSection/>
          <UserRulesSection/>
        </VStack> 
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  content: {
    padding: 20,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
  },
  form: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    flex: 1,
    paddingVertical: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
});
