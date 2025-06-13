import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import Header  from '@/components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
//TODO: Home - Forex, Crypto, Stocks
export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <Header title="Zenlot" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
