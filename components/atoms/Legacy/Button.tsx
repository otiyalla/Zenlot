import { type ComponentProps } from 'react';
import { Button, View } from 'react-native';
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

type Props = ComponentProps<typeof Button> ;

export function ButtonComponent({ onPress, title, ...rest }: Props) {
  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
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
            color={Colors[colorScheme ?? 'light'].buttons}
            {...rest}
            accessibilityLabel={title}
          />
        </View>
      </View>
  );
}
//TODO: Few app details
// Navigation tabs - Home, Profile, History, Analytics
//TODO:  success and performance metrics

// Analytics - Charts, graphs, and analysis tools, total trades, account balance, total pnl, win rate
// Profile - User info, settings, subscription management
// Home - Dashboard with overview of account stats, recent trades, quick actions
// ability to view all journal entries and performance metrics