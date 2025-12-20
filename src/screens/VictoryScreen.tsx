import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import BigButton from '../components/BigButton';
import { useGame } from '../state/GameContext';
import { saveMatchHistory } from '../data/database';
import { MatchHistoryEntry } from '../state/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Victory'>;

export default function VictoryScreen({ navigation }: Props) {
  const { state, dispatch } = useGame();

  const winner = state.winner;
  const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);

  useEffect(() => {
    // Save match history
    if (winner) {
      const historyEntry: MatchHistoryEntry = {
        id: Date.now().toString(),
        date: Date.now(),
        players: state.players,
        teams: state.teams,
        winner: winner,
        settings: state.settings,
      };

      // Save to database (async, best effort)
      saveMatchHistory(JSON.stringify(historyEntry)).catch(err => {
        console.error('Failed to save match history:', err);
      });

      // Also update in-memory history
      dispatch({
        type: 'LOAD_HISTORY',
        history: [...state.matchHistory, historyEntry],
      });
    }
  }, [winner]);

  const getPlayerNames = (teamId: string) => {
    const team = state.teams.find(t => t.id === teamId);
    if (!team) return '';
    return team.playerIds
      .map(pid => state.players.find(p => p.id === pid)?.name || '')
      .filter(n => n)
      .join(', ');
  };

  const playAgain = () => {
    dispatch({ type: 'RESET_GAME' });
    navigation.navigate('Start');
  };

  const viewScores = () => {
    navigation.navigate('Score');
  };

  if (!winner) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Ingen vinnare hittades</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebrationEmoji}>🎉🏆🎉</Text>
          <Text style={styles.winnerTitle}>VINNARE!</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerScore}>{winner.score} poäng</Text>
          <Text style={styles.winnerPlayers}>{getPlayerNames(winner.id)}</Text>
        </View>

        <View style={styles.finalStandings}>
          <Text style={styles.standingsTitle}>Slutställning</Text>
          {sortedTeams.map((team, index) => (
            <View key={team.id} style={styles.standingItem}>
              <Text style={styles.standingRank}>{index + 1}.</Text>
              <View style={styles.standingTeamInfo}>
                <Text style={styles.standingTeamName}>{team.name}</Text>
                <Text style={styles.standingPlayers}>
                  {getPlayerNames(team.id)}
                </Text>
              </View>
              <Text style={styles.standingScore}>{team.score}</Text>
            </View>
          ))}
        </View>

        <View style={styles.matchInfo}>
          <Text style={styles.matchInfoTitle}>Matchinformation</Text>
          <Text style={styles.matchInfoText}>
            🎮 Spelläge: {state.settings.mode === 'A' ? 'A (Begränsade pass)' : 'B (Oändliga pass)'}
          </Text>
          <Text style={styles.matchInfoText}>
            ⏱️ Tur-tid: {state.settings.turnDurationSeconds}s
          </Text>
          <Text style={styles.matchInfoText}>
            🎯 Målpoäng: {state.settings.targetScore}
          </Text>
          <Text style={styles.matchInfoText}>
            🔄 Rotationer: {state.currentRotation}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <BigButton
          title="Spela igen"
          onPress={playAgain}
          color={theme.colors.primary}
          style={styles.button}
        />
        <BigButton
          title="Visa poäng"
          onPress={viewScores}
          color={theme.colors.secondary}
          style={styles.button}
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
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  celebrationContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    marginBottom: theme.spacing.lg,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  celebrationEmoji: {
    fontSize: 60,
    marginBottom: theme.spacing.md,
  },
  winnerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  winnerName: {
    fontSize: theme.fontSize.huge,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  winnerScore: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.correct,
    marginBottom: theme.spacing.sm,
  },
  winnerPlayers: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  finalStandings: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  standingsTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  standingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  standingRank: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    width: 30,
  },
  standingTeamInfo: {
    flex: 1,
  },
  standingTeamName: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  standingPlayers: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  standingScore: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    minWidth: 50,
    textAlign: 'right',
  },
  matchInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  matchInfoTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  matchInfoText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  button: {
    width: '100%',
  },
  errorText: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.error,
    textAlign: 'center',
    margin: theme.spacing.xl,
  },
});
