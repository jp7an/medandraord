import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import BigButton from '../components/BigButton';
import { useGame } from '../state/GameContext';
import { Team } from '../state/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Score'>;

export default function ScoreScreen({ navigation }: Props) {
  const { state, dispatch } = useGame();
  const [showVictoryCheck, setShowVictoryCheck] = useState(false);

  const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
  const highestScore = sortedTeams[0]?.score || 0;
  const teamsInLead = sortedTeams.filter(t => t.score === highestScore);
  
  const currentRotation = state.currentRotation;
  const currentTurnIndex = state.currentTurnIndex;
  const isRotationComplete = currentTurnIndex === 0 && currentRotation > 0;
  
  const targetReached = highestScore >= state.settings.targetScore;
  
  useEffect(() => {
    // Check for victory conditions after a rotation completes
    if (isRotationComplete && targetReached) {
      setShowVictoryCheck(true);
    }
  }, [isRotationComplete, targetReached]);

  const startNextTurn = () => {
    if (currentTurnIndex >= state.turnOrder.length) {
      Alert.alert('Fel', 'Ingen tur tillgänglig');
      return;
    }

    const nextTeamId = state.turnOrder[currentTurnIndex];
    navigation.navigate('Turn', { teamId: nextTeamId });
  };

  const handleVictoryCheck = () => {
    // Check if we have a clear winner
    if (teamsInLead.length === 1) {
      // Single winner
      const winner = teamsInLead[0];
      dispatch({ type: 'END_MATCH', winner });
      navigation.navigate('Victory');
    } else {
      // Tie - need tiebreaker rounds
      Alert.alert(
        'Oavgjort!',
        `${teamsInLead.length} lag delar ledningen med ${highestScore} poäng. Tiebreaker-turer startar nu!`,
        [{ text: 'OK', onPress: continueWithTiebreaker }]
      );
    }
  };

  const continueWithTiebreaker = () => {
    // Filter turnOrder to only include tied teams
    setShowVictoryCheck(false);
    const tiedTeamIds = teamsInLead.map(t => t.id);
    dispatch({ type: 'START_TIEBREAKER', tiedTeamIds });
    startNextTurn();
  };

  const getCurrentTeam = () => {
    if (currentTurnIndex >= state.turnOrder.length) return null;
    const teamId = state.turnOrder[currentTurnIndex];
    return state.teams.find(t => t.id === teamId);
  };

  const getPlayerNames = (teamId: string) => {
    const team = state.teams.find(t => t.id === teamId);
    if (!team) return '';
    return team.playerIds
      .map(pid => state.players.find(p => p.id === pid)?.name || '')
      .filter(n => n)
      .join(', ');
  };

  const currentTeam = getCurrentTeam();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Poängtavla</Text>
        <Text style={styles.rotationText}>
          Rotation {currentRotation + 1} • Tur {currentTurnIndex + 1}/{state.turnOrder.length}
        </Text>
        <Text style={styles.targetText}>
          Mål: {state.settings.targetScore} poäng
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {sortedTeams.map((team, index) => {
          const isLeading = team.score === highestScore;
          const hasReachedTarget = team.score >= state.settings.targetScore;
          
          return (
            <View
              key={team.id}
              style={[
                styles.teamCard,
                isLeading && styles.teamCardLeading,
              ]}
            >
              <View style={styles.teamRank}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              
              <View style={styles.teamInfo}>
                <Text style={[
                  styles.teamName,
                  isLeading && styles.teamNameLeading,
                ]}>
                  {team.name}
                </Text>
                <Text style={styles.playerNames}>
                  {getPlayerNames(team.id)}
                </Text>
              </View>
              
              <View style={styles.scoreContainer}>
                <Text style={[
                  styles.scoreText,
                  isLeading && styles.scoreTextLeading,
                ]}>
                  {team.score}
                </Text>
                {hasReachedTarget && (
                  <Text style={styles.targetReachedBadge}>🎯</Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        {showVictoryCheck ? (
          <View style={styles.victoryCheckContainer}>
            <Text style={styles.victoryCheckText}>
              ✨ Rotationen är klar och målpoängen är nådd!
            </Text>
            {teamsInLead.length === 1 ? (
              <Text style={styles.victoryCheckSubtext}>
                {teamsInLead[0].name} vinner med {highestScore} poäng!
              </Text>
            ) : (
              <Text style={styles.victoryCheckSubtext}>
                {teamsInLead.length} lag delar ledningen - tiebreaker krävs!
              </Text>
            )}
            <BigButton
              title="Avgör vinnare"
              onPress={handleVictoryCheck}
              color={theme.colors.primary}
              style={styles.victoryButton}
            />
          </View>
        ) : (
          <>
            {currentTeam && (
              <View style={styles.nextTurnInfo}>
                <Text style={styles.nextTurnLabel}>Nästa tur:</Text>
                <Text style={styles.nextTurnTeam}>{currentTeam.name}</Text>
              </View>
            )}
            <BigButton
              title={currentTeam ? `Starta ${currentTeam.name}s tur` : 'Ingen tur tillgänglig'}
              onPress={startNextTurn}
              color={theme.colors.correct}
              disabled={!currentTeam}
            />
          </>
        )}
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
  rotationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  targetText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.secondary,
    marginTop: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  teamCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  teamCardLeading: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  teamRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  rankText: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  teamNameLeading: {
    color: theme.colors.primary,
  },
  playerNames: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  scoreContainer: {
    alignItems: 'center',
    minWidth: 60,
  },
  scoreText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  scoreTextLeading: {
    color: theme.colors.primary,
  },
  targetReachedBadge: {
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
  },
  nextTurnInfo: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  nextTurnLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  nextTurnTeam: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  victoryCheckContainer: {
    gap: theme.spacing.md,
  },
  victoryCheckText: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  victoryCheckSubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    textAlign: 'center',
  },
  victoryButton: {
    marginTop: theme.spacing.sm,
  },
});
