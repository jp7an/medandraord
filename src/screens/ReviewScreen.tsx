import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import BigButton from '../components/BigButton';
import { useGame } from '../state/GameContext';
import { WordStatus } from '../state/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Review'>;

const statusLabels: Record<WordStatus, string> = {
  correct: 'Rätt',
  pass: 'Pass',
  foul: 'Regelbrott',
  invalid: 'Ogiltig',
};

const statusColors: Record<WordStatus, string> = {
  correct: theme.colors.correct,
  pass: theme.colors.pass,
  foul: theme.colors.foul,
  invalid: theme.colors.invalid,
};

const statusPoints: Record<WordStatus, number> = {
  correct: 1,
  pass: 0,
  foul: 0,
  invalid: 0,
};

function getStatusPoints(status: WordStatus, mode: 'A' | 'B'): number {
  if (mode === 'A') {
    return status === 'correct' ? 1 : 0;
  } else {
    // Mode B
    switch (status) {
      case 'correct': return 1;
      case 'pass': return -0.5;
      case 'foul': return -1;
      case 'invalid': return 0;
    }
  }
}

export default function ReviewScreen({ navigation }: Props) {
  const { state, dispatch } = useGame();

  const wordHistory = state.currentTurn?.wordHistory || [];
  const mode = state.settings.mode;

  // Calculate current score
  const totalScore = wordHistory.reduce((sum, instance) => {
    return sum + getStatusPoints(instance.status, mode);
  }, 0);

  const updateWordStatus = (index: number, status: WordStatus) => {
    dispatch({ type: 'UPDATE_WORD_STATUS', index, status });
  };

  const finishReview = () => {
    dispatch({ type: 'FINISH_REVIEW' });
    navigation.navigate('Score');
  };

  const getWordTypeColor = (type: string) => {
    return theme.colors.wordTypes[type as keyof typeof theme.colors.wordTypes] || theme.colors.textSecondary;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Granska Tur</Text>
        <Text style={styles.headerSubtitle}>
          Korrigera fel och lägg till missade
        </Text>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Tur-poäng:</Text>
          <Text style={styles.scoreValue}>{totalScore}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {wordHistory.length === 0 ? (
          <Text style={styles.emptyText}>Inga ord i denna tur</Text>
        ) : (
          wordHistory.map((instance, index) => (
            <View key={index} style={styles.wordItem}>
              <View style={styles.wordHeader}>
                <View style={[
                  styles.wordTypeBadge,
                  { backgroundColor: getWordTypeColor(instance.word.type) }
                ]}>
                  <Text style={styles.wordText}>{instance.word.text}</Text>
                </View>
                <Text style={styles.wordPoints}>
                  {getStatusPoints(instance.status, mode) > 0 ? '+' : ''}
                  {getStatusPoints(instance.status, mode)}
                </Text>
              </View>

              <View style={styles.statusButtons}>
                {(['correct', 'pass', 'foul', 'invalid'] as WordStatus[]).map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      { 
                        backgroundColor: statusColors[status],
                        opacity: instance.status === status ? 1 : 0.4,
                      },
                    ]}
                    onPress={() => updateWordStatus(index, status)}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      status === 'pass' && { color: '#ffffff' },
                    ]}>
                      {statusLabels[status]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Tips: Ändra status för att korrigera feltryck eller lägga till missade svar
          </Text>
        </View>
        <BigButton
          title={`Bekräfta (${totalScore} poäng)`}
          onPress={finishReview}
          color={theme.colors.primary}
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
  header: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  scoreLabel: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
  },
  wordItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  wordTypeBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  wordText: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: '#000000',
  },
  wordPoints: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    minWidth: 50,
    textAlign: 'right',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statusButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
    color: '#000000',
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  infoBox: {
    backgroundColor: theme.colors.secondary + '20',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
  },
});
