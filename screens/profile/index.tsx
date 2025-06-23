import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

import { Link, router } from 'expo-router';
import { SafeAreaViewComponent as SafeAreaView } from '@/components/atoms/SafeAreaView';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslate } from '@/hooks/useTranslate';
import { HStack, Text } from '@/components/ui';

//TODO: Profile - User persinalization, settings, and preferences (base currency, rules and more)

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const { localize } = useTranslate();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)');
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HStack>
        <Text>
          {localize('welcome')}, {user?.fname}!
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ marginLeft: 10, padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5 }}
        >
          <Text>{localize('logout')}</Text>
        </TouchableOpacity>
      </HStack>
      <Link href="../forex">Forex</Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
