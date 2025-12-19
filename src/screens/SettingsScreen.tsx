import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import BigButton from '../components/BigButton';
import { useGame } from '../state/GameContext';
import { GameMode, GameSettings } from '../state/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { state, dispatch } = useGame();
  
  const [mode, setMode] = useState<GameMode>('A');
  const [turnDuration, setTurnDuration] = useState(45);
  const [targetScore, setTargetScore] = useState(30);
  const [maxPasses, setMaxPasses] = useState(3);

  const startMatch = () => {
    const settings: GameSettings = {
      mode,
      turnDurationSeconds: turnDuration,
      targetScore,
      maxPassesPerTurn: maxPasses,
    };
    
    dispatch({ type: 'SET_SETTINGS', settings });
    dispatch({ type: 'START_MATCH' });
    navigation.navigate('Score');
  };

  const turnOptions = [30, 45, 60, 90];
  const scoreOptions = [20, 30, 40, 50];
  const passOptions = [2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Inställningar</Text>

        {/* Game Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spelläge</Text>
          <View style={styles.optionGroup}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'A' && styles.modeButtonActive]}
              onPress={() => setMode('A')}
            >
              <Text style={[styles.modeButtonText, mode === 'A' && styles.modeButtonTextActive]}>
                Läge A
              </Text>
              <Text style={styles.modeDescription}>
                Begränsade pass (max {maxPasses})
              </Text>
              <Text style={styles.modeRules}>
                Rätt = +1 • Pass = 0 • Regelbrott = 0
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeButton, mode === 'B' && styles.modeButtonActive]}
              onPress={() => setMode('B')}
            >
              <Text style={[styles.modeButtonText, mode === 'B' && styles.modeButtonTextActive]}>
                Läge B
              </Text>
              <Text style={styles.modeDescription}>
                Oändliga pass, minuspoäng
              </Text>
              <Text style={styles.modeRules}>
                Rätt = +1 • Pass = -0.5 • Regelbrott = -1
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Turn Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tur-tid (sekunder)</Text>
          <View style={styles.optionGroup}>
            {turnOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  turnDuration === option && styles.optionButtonActive,
                ]}
                onPress={() => setTurnDuration(option)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    turnDuration === option && styles.optionButtonTextActive,
                  ]}
                >
                  {option}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Target Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Målpoäng</Text>
          <View style={styles.optionGroup}>
            {scoreOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  targetScore === option && styles.optionButtonActive,
                ]}
                onPress={() => setTargetScore(option)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    targetScore === option && styles.optionButtonTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Max Passes (only for mode A) */}
        {mode === 'A' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Max pass per tur</Text>
            <View style={styles.optionGroup}>
              {passOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    maxPasses === option && styles.optionButtonActive,
                  ]}
                  onPress={() => setMaxPasses(option)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      maxPasses === option && styles.optionButtonTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Sammanfattning</Text>
          <Text style={styles.summaryText}>
            🎮 Spelläge: {mode === 'A' ? 'A (Begränsade pass)' : 'B (Oändliga pass)'}
          </Text>
          <Text style={styles.summaryText}>⏱️ Tur-tid: {turnDuration} sekunder</Text>
          <Text style={styles.summaryText}>🎯 Målpoäng: {targetScore}</Text>
          {mode === 'A' && (
            <Text style={styles.summaryText}>🚫 Max pass: {maxPasses}</Text>
          )}
          <Text style={styles.summaryText}>👥 Lag: {state.teams.length}</Text>
          <Text style={styles.summaryText}>
            👤 Spelare: {state.players.length}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <BigButton
          title="Starta Match!"
          onPress={startMatch}
          color={theme.colors.correct}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  modeButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  modeButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '20',
  },
  modeButtonText: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  modeButtonTextActive: {
    color: theme.colors.primary,
  },
  modeDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  modeRules: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  optionButton: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    minWidth: 80,
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '20',
  },
  optionButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  optionButtonTextActive: {
    color: theme.colors.primary,
  },
  summary: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginTop: theme.spacing.md,
  },
  summaryTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  summaryText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
