import { Image } from 'expo-image';
import { ScrollView, Platform, StyleSheet, View, Text } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ButtonComponent } from '@/components/atoms/Button';
import { TextInputComponent } from '@/components/atoms/TextInput';
import Selection from '@/components/atoms/Selection';
import { Stop } from 'react-native-svg';
import StopLossEntry from '@/components/molecules/StopLossEntry';
import TakeProfitEntry from '@/components/molecules/TakeProfitEntry';
import { Pressable } from '@/components/ui/pressable'
import Loading from '@/components/atoms/Spinner';
import TradeEntry from '@/components/orgnisms/TradeEntry';
import { useTranslate } from '@/hooks/useTranslate';
import { useState } from 'react';
import TextEditor from '@/components/TextEditor';

export default function forexHome() {
  const [language, setLang] = useState<'en' | 'fr'>('en')
  const {localize} = useTranslate(language);

  const handleLang = () => {
    const newLang = (language === 'en') ? 'fr' : 'en';
    setLang(newLang)
  }


  return (
    <ScrollView>

    
      <View>
      <Text>Forex Home</Text>
      <ButtonComponent
        title="Forex"
        onPress={() => {
          console.log('Forex button pressed');
          handleLang();
        }}
      />
      <TextInputComponent
        placeholder="Search"
        onChangeText={(text) => console.log(text)}
        style={{ backgroundColor: 'green', padding: 10, margin: 10 }}  
      />
      
      <Text> 
        {localize('welcome')}
      </Text>
      <View className="bg-blue-500">
        <Text className="text-white text-xl">If this is blue, Tailwind works!</Text>
      </View>



      <Selection
        description="Select a language"
        options={[{ label: 'USD', value: 'usd' }, { label: 'EUR', value: 'eur' }, { label: 'GBP', value: 'gbp' }]}
        onValueChange={(value) => console.log("selection", value)}
      />

      <Loading />

    

       <TradeEntry 
        onSubmit={(trade) => {
         console.log("Trade submitted", trade);
       }} />

       <View style={{height: 250, position: 'fixed'}}>
      <TextEditor />
    </View>


      
    </View>
    </ScrollView>
    
  );
}
//Condiser doing dynamic pages and routes i.e [_id].tsx

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
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
