import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface TimerProps {
  durationSeconds: number;
  onTick?: (secondsRemaining: number) => void;
  onComplete: () => void;
  isPaused?: boolean;
}

export default function Timer({ 
  durationSeconds, 
  onTick, 
  onComplete,
  isPaused = false,
}: TimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (isPaused) return;
    
    if (secondsRemaining <= 0) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        const newValue = prev - 1;
        
        if (onTick) {
          onTick(newValue);
        }
        
        // Sound alerts (stub for now)
        if (newValue === 10) {
          console.log('🔔 10 seconds remaining!');
        }
        if (newValue === 0) {
          console.log('⏰ Time\'s up!');
        }
        
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, isPaused, onTick, onComplete]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  const isWarning = secondsRemaining <= 10;

  return (
    <View style={styles.container}>
      <Text style={[
        styles.timer,
        isWarning && styles.warning,
      ]}>
        {timeString}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 3,
    borderColor: theme.colors.border,
  },
  timer: {
    fontSize: theme.fontSize.huge,
    fontWeight: 'bold',
    color: theme.colors.text,
    fontFamily: 'monospace',
  },
  warning: {
    color: theme.colors.error,
  },
});
