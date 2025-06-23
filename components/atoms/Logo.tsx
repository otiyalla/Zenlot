import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
const white_logo = require('@/assets/images/zenlot_lightMono.png');
const dark_logo = require('@/assets/images/zenlot_darkMono.png');
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useTranslate } from '@/hooks/useTranslate';
import { router } from 'expo-router';

export default function Logo(){
    const logo = useColorScheme() === 'dark' ? dark_logo : white_logo;
    const { localize } = useTranslate();
    const themeColor = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
    
    return (
         <View style={styles.logoContainer}>
            <TouchableOpacity onPress={() => router.replace('/(auth)')}>
                <Image
                    source={logo} 
                    style={[styles.logo, {borderColor: themeColor.logoBorder}]}
                    accessibilityLabel={localize('zenlot_logo')}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    logoContainer: {
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 2,
    },
});