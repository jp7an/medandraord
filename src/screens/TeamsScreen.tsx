import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import BigButton from '../components/BigButton';
import { useGame } from '../state/GameContext';
import { Team } from '../state/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Teams'>;

function autoSplitTeams(playerIds: string[]): Team[] {
  const numPlayers = playerIds.length;
  const numTeamsOf2 = Math.floor(numPlayers / 2);
  const hasTeamOf3 = numPlayers % 2 === 1;
  
  const teams: Team[] = [];
  let playerIndex = 0;
  
  // Create teams of 2
  for (let i = 0; i < numTeamsOf2; i++) {
    teams.push({
      id: `team-${i}`,
      name: `Lag ${i + 1}`,
      playerIds: [playerIds[playerIndex], playerIds[playerIndex + 1]],
      score: 0,
    });
    playerIndex += 2;
  }
  
  // Add team of 3 if odd number of players
  if (hasTeamOf3 && playerIndex < numPlayers) {
    teams.push({
      id: `team-${teams.length}`,
      name: `Lag ${teams.length + 1}`,
      playerIds: [playerIds[playerIndex], playerIds[playerIndex + 1], playerIds[playerIndex + 2]],
      score: 0,
    });
  }
  
  return teams;
}

export default function TeamsScreen({ navigation }: Props) {
  const { state, dispatch } = useGame();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    // Auto-split players into teams
    if (state.players.length >= 2) {
      const autoTeams = autoSplitTeams(state.players.map(p => p.id));
      setTeams(autoTeams);
    }
  }, [state.players]);

  const getPlayerName = (playerId: string) => {
    return state.players.find(p => p.id === playerId)?.name || 'Okänd';
  };

  const movePlayerToTeam = (playerId: string, fromTeamId: string, toTeamId: string) => {
    const updatedTeams = teams.map(team => {
      if (team.id === fromTeamId) {
        return {
          ...team,
          playerIds: team.playerIds.filter(id => id !== playerId),
        };
      }
      if (team.id === toTeamId) {
        return {
          ...team,
          playerIds: [...team.playerIds, playerId],
        };
      }
      return team;
    });
    setTeams(updatedTeams);
  };

  const validateTeams = (): string | null => {
    if (teams.length < 2) {
      return 'Minst 2 lag krävs';
    }
    
    const invalidTeams = teams.filter(team => team.playerIds.length < 2);
    if (invalidTeams.length > 0) {
      return 'Alla lag måste ha minst 2 spelare';
    }
    
    return null;
  };

  const continueToSettings = () => {
    const error = validateTeams();
    if (error) {
      Alert.alert('Validering misslyckades', error);
      return;
    }
    
    dispatch({ type: 'SET_TEAMS', teams });
    navigation.navigate('Settings');
  };

  const addTeam = () => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: `Lag ${teams.length + 1}`,
      playerIds: [],
      score: 0,
    };
    setTeams([...teams, newTeam]);
  };

  const removeTeam = (teamId: string) => {
    if (teams.length <= 2) {
      Alert.alert('Kan inte ta bort', 'Minst 2 lag måste finnas');
      return;
    }
    setTeams(teams.filter(t => t.id !== teamId));
  };

  const validationError = validateTeams();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Lagindelning</Text>
        <Text style={styles.subheader}>
          Automatisk indelning (2-3 per lag). Justera fritt!
        </Text>

        {teams.map((team, teamIndex) => (
          <View key={team.id} style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamCount}>
                {team.playerIds.length} spelare
              </Text>
              {teams.length > 2 && (
                <TouchableOpacity
                  style={styles.removeTeamButton}
                  onPress={() => removeTeam(team.id)}
                >
                  <Text style={styles.removeTeamButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.playersList}>
              {team.playerIds.length === 0 ? (
                <Text style={styles.emptyTeamText}>Tomt lag (lägg till spelare)</Text>
              ) : (
                team.playerIds.map(playerId => (
                  <View key={playerId} style={styles.playerChip}>
                    <Text style={styles.playerChipText}>
                      {getPlayerName(playerId)}
                    </Text>
                    {/* Simple move controls */}
                    {teams.length > 1 && (
                      <View style={styles.moveButtons}>
                        {teams.map((otherTeam, idx) => {
                          if (otherTeam.id === team.id) return null;
                          return (
                            <TouchableOpacity
                              key={otherTeam.id}
                              style={styles.moveButton}
                              onPress={() => movePlayerToTeam(playerId, team.id, otherTeam.id)}
                            >
                              <Text style={styles.moveButtonText}>→L{idx + 1}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>

            {team.playerIds.length < 2 && (
              <Text style={styles.teamWarning}>⚠️ Minst 2 spelare krävs</Text>
            )}
          </View>
        ))}

        <BigButton
          title="Lägg till lag"
          onPress={addTeam}
          color={theme.colors.secondary}
          style={styles.addTeamButton}
        />

        {validationError && (
          <View style={styles.validationBox}>
            <Text style={styles.validationText}>❌ {validationError}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <BigButton
          title="Fortsätt till Inställningar"
          onPress={continueToSettings}
          disabled={!!validationError}
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
    marginBottom: theme.spacing.sm,
  },
  subheader: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  teamCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  teamName: {
    flex: 1,
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  teamCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
  removeTeamButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeTeamButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  playersList: {
    gap: theme.spacing.sm,
  },
  playerChip: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerChipText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    flex: 1,
  },
  moveButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  moveButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  moveButtonText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  emptyTeamText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  teamWarning: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.sm,
  },
  addTeamButton: {
    marginBottom: theme.spacing.md,
  },
  validationBox: {
    backgroundColor: theme.colors.error + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.error,
  },
  validationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
