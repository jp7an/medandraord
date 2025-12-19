import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import BigButton from '../components/BigButton';
import { useGame } from '../state/GameContext';
import { Player } from '../state/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Players'>;

export default function PlayersScreen({ navigation }: Props) {
  const { dispatch } = useGame();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentName, setCurrentName] = useState('');

  const addPlayer = () => {
    const trimmedName = currentName.trim();
    if (trimmedName) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: trimmedName,
      };
      setPlayers([...players, newPlayer]);
      setCurrentName('');
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const continueToTeams = () => {
    if (players.length >= 2) {
      dispatch({ type: 'SET_PLAYERS', players });
      navigation.navigate('Teams');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Lägg till spelare</Text>
        <Text style={styles.subheader}>Minst 2 spelare krävs</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={currentName}
            onChangeText={setCurrentName}
            placeholder="Skriv spelarnamn..."
            placeholderTextColor={theme.colors.textSecondary}
            onSubmitEditing={addPlayer}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.playerList}>
          {players.map((player, index) => (
            <View key={player.id} style={styles.playerItem}>
              <Text style={styles.playerNumber}>{index + 1}.</Text>
              <Text style={styles.playerName}>{player.name}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePlayer(player.id)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {players.length === 0 && (
          <Text style={styles.emptyText}>Inga spelare tillagda ännu</Text>
        )}

        {players.length > 0 && players.length < 2 && (
          <Text style={styles.warningText}>
            Lägg till minst {2 - players.length} spelare till
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <BigButton
          title={`Fortsätt (${players.length} spelare)`}
          onPress={continueToTeams}
          disabled={players.length < 2}
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
  inputContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSize.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  playerList: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  playerNumber: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    width: 32,
  },
  playerName: {
    flex: 1,
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  warningText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
