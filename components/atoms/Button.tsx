import { type ComponentProps } from 'react';
import { Button, View } from 'react-native';
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
//TODO: Customize all your atoms and add your own styles
type Props = ComponentProps<typeof Button> ;

export function ButtonComponent({ onPress, title, ...rest }: Props) {
  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: 10, 
    },
    roundedButton: {
      borderRadius: 15,
      overflow: 'hidden',
      width: '100%',
    },
  });

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.roundedButton}>
        <Button
          title={title}
          onPress={onPress}
          {...rest}
          accessibilityLabel={title}
          color={Colors[colorScheme ?? 'light'].buttons}
        />
      </View>
    </View>
  );
}
//TODO: Few app details
// Navigation tabs - Home, Profile, History, Analytics


// Analytics - Charts, graphs, and analysis tools
// ability to view all journal entries and performance metrics