import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { WordType } from '../state/types';

interface WordCardProps {
  text: string;
  type: WordType;
  size?: 'normal' | 'large';
}

export default function WordCard({ text, type, size = 'large' }: WordCardProps) {
  const backgroundColor = theme.colors.wordTypes[type];
  const isLarge = size === 'large';

  return (
    <View style={[
      styles.container,
      { backgroundColor },
      isLarge && styles.largeContainer,
    ]}>
      <Text style={[
        styles.text,
        isLarge && styles.largeText,
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  largeContainer: {
    padding: theme.spacing.xxl,
    minHeight: 200,
  },
  text: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  largeText: {
    fontSize: theme.fontSize.huge,
  },
});
