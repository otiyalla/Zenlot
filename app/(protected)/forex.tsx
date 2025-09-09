import { Image } from 'expo-image';
import { ScrollView, Platform, StyleSheet, View, Text } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ButtonComponent } from '@/components/atoms/Button';
import { TextInputComponent } from '@/components/atoms/TextInput';
import {SafeAreaViewComponent as SafeAreaView}  from '@/components/atoms/SafeAreaView';
import  Search  from '@/components/atoms/Search';
import Selection from '@/components/atoms/Selection';
import Loading from '@/components/atoms/Spinner';
//import TradeEntry from '@/components/orgnisms/TradeEntry';
import { useTranslate } from '@/hooks/useTranslate';
import { useState } from 'react';
import TextEditor from '@/components/TextEditor';

export default function forexHome() {
  const { localize } = useTranslate();
  return (

   <SafeAreaView>
        <View>
        <Text>Forex Home</Text>
        <ButtonComponent
          title="Forex"
          onPress={() => {
            console.log('Forex button pressed');
          }}
        />
        <TextInputComponent
          placeholder="Text input"
          onChangeText={(text) => console.log(text)}
          style={{ backgroundColor: 'green'}}  
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
        <Search placeholderText='seraching ...' searchResult={() => {}}/>

      

        {/* <TradeEntry 
          onSubmit={(trade) => {
          console.log("Trade submitted", trade);
        }} /> */}
        <TextEditor />
      


        
        </View>
   </SafeAreaView>
    
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
