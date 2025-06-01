import { StyleSheet, Text, View, ImageSourcePropType } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from "expo-image";
const dark_logo = require('@/assets/images/zenlot_darkMono.png');
const light_logo = require('@/assets/images/zenlot_lightMono.png');

export default function Header({title}: {title: string}) {
  const colorScheme = useColorScheme();
  const logo: ImageSourcePropType | string | undefined = colorScheme === "dark" ? dark_logo : light_logo;
  return (
    <View style={styles.header}>
      <Image testID="header-logo" source={logo} style={styles.logo} />
      <Text testID="header-text" style={styles.title}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    //backgroundColor: "pink",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    },
    logo: {
        width: 35,
        height: 35,
        borderRadius: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
    }

});