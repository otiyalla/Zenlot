import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import Header  from '@/components/Header';
import { SafeAreaViewComponent as SafeAreaView } from '@/components/atoms/SafeAreaView';

import TextEditor from '@/components/TextEditor';
//TODO: Home - Forex, Crypto, Stocks
export default function Home() {
  return (
    <SafeAreaView >
        <Header title="Zenlot" />

        <TextEditor/>
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
