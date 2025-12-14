import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Logo } from '@/components/atoms/Logo';

export function SpinningLogo() {
  const rotationAnimation = useSharedValue(0);
  const rotationAnimationZ = useSharedValue(0);

  useEffect(() => {
    rotationAnimation.value = withRepeat(
      withTiming(360, { duration: 1200 }),
      5, // Infinite loop (-1)
      false
    );
    rotationAnimationZ.value = withRepeat(
      withTiming(360, { duration: 1200 }),
      5, // Infinite loop (-1)
      false
    );
  }, [rotationAnimation, rotationAnimationZ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotationAnimation.value}deg` },
      { rotateZ: `${rotationAnimationZ.value}deg` },
    ],
  }));

  return (
    <View style={styles.center}>
      <Animated.View style={animatedStyle}>
        <Logo />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
