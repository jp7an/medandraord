import { Audio } from 'expo-av';

/**
 * Initialize and load sound effects
 * Call this once when the app starts
 */
export async function initializeSounds() {
  try {
    // Set audio mode for ambient sound
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  } catch (error) {
    console.error('Failed to initialize audio mode:', error);
  }
}

/**
 * Generic helper to play a sound file from assets
 * Robust: handles errors gracefully without crashing the app
 */
async function playSoundFile(soundPath: any, soundName: string) {
  try {
    const { sound } = await Audio.Sound.createAsync(
      soundPath,
      { shouldPlay: true, volume: 1.0 }
    );
    
    // Unload after playing to free resources
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    // Log error but don't crash - sound is optional
    console.log(`[Sound] Could not play ${soundName}:`, error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Play start sound (when countdown finishes and turn begins)
 */
export async function playStartSound() {
  await playSoundFile(require('../../assets/sounds/start.mp3'), 'start');
}

/**
 * Play warning sound (10 seconds remaining)
 */
export async function playWarningSound() {
  await playSoundFile(require('../../assets/sounds/warn10.mp3'), 'warn10');
}

/**
 * Play end sound (time's up)
 */
export async function playEndSound() {
  await playSoundFile(require('../../assets/sounds/end.mp3'), 'end');
}

/**
 * Play correct sound (when RÄTT button is pressed)
 */
export async function playCorrectSound() {
  await playSoundFile(require('../../assets/sounds/correct.mp3'), 'correct');
}

/**
 * Play pass sound (when PASS button is pressed)
 */
export async function playPassSound() {
  await playSoundFile(require('../../assets/sounds/pass.mp3'), 'pass');
}

/**
 * Play foul sound (when REGELBROTT button is pressed)
 */
export async function playFoulSound() {
  await playSoundFile(require('../../assets/sounds/foul.mp3'), 'foul');
}
