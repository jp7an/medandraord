import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import BigButton from '../components/BigButton';
import Timer from '../components/Timer';
import WordCard from '../components/WordCard';
import { useGame } from '../state/GameContext';
import { getRandomWord } from '../data/words';
import { playStartSound, playCorrectSound, playPassSound, playFoulSound } from '../utils/sounds';

type Props = NativeStackScreenProps<RootStackParamList, 'Turn'>;

type GamePhase = 'ready' | 'countdown' | 'playing' | 'ended';

export default function TurnScreen({ navigation, route }: Props) {
  const { state, dispatch } = useGame();
  const { teamId } = route.params;
  
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [countdown, setCountdown] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);

  const team = state.teams.find(t => t.id === teamId);
  const currentWord = state.currentTurn?.currentWord;
  const passesUsed = state.currentTurn?.passesUsed || 0;
  
  const isPassDisabled = 
    state.settings.mode === 'A' && 
    passesUsed >= state.settings.maxPassesPerTurn;

  const startCountdown = () => {
    setPhase('countdown');
    dispatch({ type: 'START_TURN', teamId });
    
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(interval);
        setPhase('playing');
        // Play start sound when turn begins
        playStartSound();
        // Show first word
        showNextWord();
      }
    }, 1000);
  };

  const showNextWord = () => {
    const word = getRandomWord(state.usedWordIds);
    if (word) {
      dispatch({ type: 'SHOW_WORD', word });
    }
  };

  const handleCorrect = () => {
    playCorrectSound();
    dispatch({ type: 'MARK_CORRECT' });
    setCorrectCount(prev => prev + 1);
    showNextWord();
  };

  const handlePass = () => {
    if (!isPassDisabled) {
      playPassSound();
      dispatch({ type: 'MARK_PASS' });
      showNextWord();
    }
  };

  const handleFoul = () => {
    playFoulSound();
    dispatch({ type: 'MARK_FOUL' });
    showNextWord();
  };

  const handleTimeUp = () => {
    dispatch({ type: 'END_TURN' });
    setPhase('ended');
    
    // Navigate to review after a short delay
    setTimeout(() => {
      navigation.navigate('Review');
    }, 1500);
  };

  if (!team) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lag hittades inte</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {phase === 'ready' && (
        <View style={styles.readyContainer}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.readyText}>
            Gör dig redo!
          </Text>
          <Text style={styles.instructions}>
            En spelare läser orden.{'\n'}
            Övriga i laget gissar.{'\n'}
            Tryck på START när ni är redo!
          </Text>
          
          <BigButton
            title="START"
            onPress={startCountdown}
            color={theme.colors.correct}
            style={styles.startButton}
          />
        </View>
      )}

      {phase === 'countdown' && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}

      {phase === 'playing' && (
        <View style={styles.playingContainer}>
          {/* Timer */}
          <View style={styles.timerContainer}>
            <Timer
              durationSeconds={state.settings.turnDurationSeconds}
              onComplete={handleTimeUp}
            />
          </View>

          {/* Correct count */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Rätt: {correctCount}
            </Text>
            {state.settings.mode === 'A' && (
              <Text style={styles.statsText}>
                Pass: {passesUsed}/{state.settings.maxPassesPerTurn}
              </Text>
            )}
          </View>

          {/* Current word */}
          {currentWord ? (
            <View style={styles.wordContainer}>
              <WordCard text={currentWord.text} type={currentWord.type} />
            </View>
          ) : (
            <View style={styles.wordContainer}>
              <Text style={styles.noWordText}>Laddar ord...</Text>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <BigButton
              title="RÄTT"
              onPress={handleCorrect}
              color={theme.colors.correct}
              textColor="#000000"
              style={styles.actionButton}
            />
            
            <BigButton
              title="PASS"
              onPress={handlePass}
              color={theme.colors.pass}
              textColor="#ffffff"
              disabled={isPassDisabled}
              style={styles.actionButton}
            />
            
            <BigButton
              title="REGELBROTT"
              onPress={handleFoul}
              color={theme.colors.foul}
              textColor="#000000"
              style={styles.actionButton}
            />
          </View>
        </View>
      )}

      {phase === 'ended' && (
        <View style={styles.endedContainer}>
          <Text style={styles.endedText}>Tiden är slut!</Text>
          <Text style={styles.endedSubtext}>
            Rätt svar: {correctCount}
          </Text>
          <Text style={styles.endedSubtext}>
            Går till granskning...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  readyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  teamName: {
    fontSize: theme.fontSize.huge,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  readyText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  instructions: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: theme.spacing.xxl,
  },
  startButton: {
    minWidth: 200,
  },
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  playingContainer: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  statsText: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  noWordText: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
  actionButton: {
    minHeight: 80,
  },
  endedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  endedText: {
    fontSize: theme.fontSize.huge,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  endedSubtext: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.error,
    textAlign: 'center',
    margin: theme.spacing.xl,
  },
});
