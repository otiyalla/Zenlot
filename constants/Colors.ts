/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    primary: '#0A2540',
    secondry: '#7D8B99',
    background: '#FFFFFF',
    success: "#2ECC71",
    error: "#E74C3C",
    buttons: '#2D9CDB',
    text: '#11181C',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '5%',
    borderColor: '#ccc',
    placeholderTextColor: "#888"
  },
  dark: {
    primary: '#F9FAFB',
    secondry: '#9CA3AF',
    background: '#0A0A0A',
    success: "#00B894",
    error: "#EF4444",
    buttons: '#3B82F6',
    text: '#F9FAFB',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '5%',
    borderColor: '#0A2540',
    placeholderTextColor: "#888"
  },
};
