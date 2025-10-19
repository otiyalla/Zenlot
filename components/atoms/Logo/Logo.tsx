import {
    StyleProp,
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageSourcePropType,
} from 'react-native';
const white_logo = require('@/assets/images/zenlot_lightMono.png');
const dark_logo = require('@/assets/images/zenlot_darkMono.png');
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useTranslate } from '@/hooks/useTranslate';
import { ImageStyle } from 'expo-image';

export interface LogoProps {
    width?: number;
    height?: number;
    borderRadius?: number;
    style?: StyleProp<ImageStyle>
    onClick?: () => {}
}


export const Logo: React.FC<LogoProps> = ({width, height, borderRadius, style, onClick}) => {
    const logo = useColorScheme() === 'dark' ? dark_logo : white_logo;
    const { localize } = useTranslate();
    const themeColor = useColorScheme() === 'dark' ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        logoContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        logo: {
            width: width ?? 96,
            height: height ?? 96,
            borderRadius: borderRadius ?? 48,
            borderWidth: 2,
        },
    });
    
    return (
        <TouchableOpacity onPress={onClick}>
            <Image
                source={logo} 
                style={[styles.logo, style, {borderColor: themeColor.logoBorder}]}
                accessibilityLabel={localize('zenlot_logo')}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );
}
