import { StyleSheet, View, ImageSourcePropType } from "react-native";
import { TextComponent as Text } from "@/components/atoms/Text";
import Logo from "@/components/atoms/Logo";


export default function Header({title}: {title: string}) {

  return (
    <View style={styles.header}>
      <Logo style={styles.logo}/>
      <Text bold size='lg' testID="header-text">{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 70,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 16,
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 30,
    marginRight: 1,
  },
});