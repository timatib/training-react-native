import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Text } from 'native-base';

type Emotion = 'default' | 'happy' | 'motivated' | 'sad' | 'thinking';

interface RobotAvatarProps {
  emotion?: Emotion;
  isThinking?: boolean;
  size?: number;
}

const EMOTION_EMOJI: Record<Emotion, string> = {
  default: '🤖',
  happy: '😊',
  motivated: '💪',
  sad: '😔',
  thinking: '🤔',
};

export function RobotAvatar({ emotion = 'default', isThinking = false, size = 80 }: RobotAvatarProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bobAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isThinking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.9, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      Animated.loop(
        Animated.sequence([
          Animated.timing(bobAnim, { toValue: -6, duration: 1500, useNativeDriver: true }),
          Animated.timing(bobAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isThinking]);

  const currentEmotion = isThinking ? 'thinking' : emotion;
  const emoji = EMOTION_EMOJI[currentEmotion];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale: pulseAnim }, { translateY: bobAnim }],
        },
      ]}
    >
      <View style={[styles.robotBody, { borderRadius: size / 2, backgroundColor: '#1e40af' }]}>
        <Text style={{ fontSize: size * 0.55 }}>{emoji}</Text>
      </View>
      {/* Status indicator */}
      <View
        style={[
          styles.statusDot,
          { backgroundColor: isThinking ? '#f59e0b' : '#10b981' },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  robotBody: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
