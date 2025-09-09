import { View, StyleSheet, ScrollView } from 'react-native';
import { TextComponent as Text } from '@/components/atoms/Text';
import Header  from '@/components/Header';
import { SafeAreaViewComponent as SafeAreaView } from '@/components/atoms/SafeAreaView';
import useNetwork from '@/hooks/useNetwork';
import TradingAnalysis from './components/TradingAnalysis';
import { ButtonComponent as Button } from '@/components/atoms/Button';
import { useState } from 'react';
import ModalEntry from '@/components/templates/ModalEntry';
import { useTrade } from '@/providers/TradeProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useTranslate } from '@/hooks/useTranslate';
import ActiveTrade from './components/molecules/ActiveTrade';

//user should be able to select favorite pairs at setup
//TODO: Home - Forex, Crypto, Stocks
export default function Home() {
  const {isOnline} = useNetwork();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const colorSchema = useColorScheme();
  const theme = Colors[colorSchema ?? 'light'];
  const { localize } = useTranslate();
  
  const handleOpen = () => {
    setIsModalOpen(true);
  };

      //todo: BUTTON ISN'T SHOWING BECAUSE OF THE STYLE SHEET. Flex 1 is hiding it.
  return (
    <SafeAreaView>
      <Header title="enlot" />
      { !isOnline && (
        <Text style={[styles.noInternet, { color: theme.error }]}>
          {localize('no_internet_connection')}
        </Text>
      )}
      <TradingAnalysis/>
      <View style={styles.container}>
          <Button accessibilityLabel={localize('tap_to_enter_trade')} onPress={handleOpen} title={localize('tap_to_enter_trade')} />
        
        {isModalOpen && <ModalEntry isOpen={isModalOpen} setIsOpen={setIsModalOpen}/>}
        <View style={styles.activeTrade}>
          {!isModalOpen && <ActiveTrade/> }
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginRight: 10,
  },
  activeTrade: {
    marginTop: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  noInternet: {
    textAlign: 'center',
    marginVertical: 1,
  },
});
