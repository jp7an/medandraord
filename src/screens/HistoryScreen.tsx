import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { getMatchHistory } from '../data/database';
import { MatchHistoryEntry } from '../state/types';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export default function HistoryScreen({ navigation }: Props) {
  const [history, setHistory] = useState<MatchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await getMatchHistory();
      const parsed = historyData
        .map(data => {
          try {
            return JSON.parse(data) as MatchHistoryEntry;
          } catch {
            return null;
          }
        })
        .filter((entry): entry is MatchHistoryEntry => entry !== null);
      
      setHistory(parsed);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matchhistorik</Text>
        <Text style={styles.headerSubtitle}>
          {history.length} {history.length === 1 ? 'match' : 'matcher'} sparade
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={styles.emptyText}>Laddar historik...</Text>
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>Ingen historik ännu</Text>
            <Text style={styles.emptySubtext}>
              Spela en match så kommer den att sparas här
            </Text>
          </View>
        ) : (
          history.map((entry) => {
            const sortedTeams = [...entry.teams].sort((a, b) => b.score - a.score);
            
            return (
              <View key={entry.id} style={styles.matchCard}>
                <View style={styles.matchHeader}>
                  <Text style={styles.matchDate}>{formatDate(entry.date)}</Text>
                  <Text style={styles.matchMode}>
                    Läge {entry.settings.mode}
                  </Text>
                </View>

                <View style={styles.winnerSection}>
                  <Text style={styles.winnerLabel}>🏆 Vinnare</Text>
                  <Text style={styles.winnerName}>{entry.winner.name}</Text>
                  <Text style={styles.winnerScore}>{entry.winner.score} poäng</Text>
                </View>

                <View style={styles.teamsSection}>
                  <Text style={styles.teamsSectionTitle}>Alla lag:</Text>
                  {sortedTeams.map((team, index) => (
                    <View key={team.id} style={styles.teamRow}>
                      <Text style={styles.teamRank}>{index + 1}.</Text>
                      <Text style={styles.teamName}>{team.name}</Text>
                      <Text style={styles.teamScore}>{team.score}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.matchStats}>
                  <Text style={styles.statText}>
                    👥 {entry.players.length} spelare
                  </Text>
                  <Text style={styles.statText}>
                    ⏱️ {entry.settings.turnDurationSeconds}s turer
                  </Text>
                  <Text style={styles.statText}>
                    🎯 Mål: {entry.settings.targetScore}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
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
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    padding: theme.spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  matchCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  matchDate: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  matchMode: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  winnerSection: {
    backgroundColor: theme.colors.primary + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  winnerLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  winnerName: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  winnerScore: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.correct,
  },
  teamsSection: {
    marginBottom: theme.spacing.md,
  },
  teamsSectionTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  teamRank: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    width: 25,
  },
  teamName: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  teamScore: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    minWidth: 40,
    textAlign: 'right',
  },
  matchStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
});
