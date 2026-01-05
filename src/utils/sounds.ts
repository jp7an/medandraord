import { Audio } from 'expo-av';
import type { AVPlaybackSource } from 'expo-av';

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
 * @param soundPath - Path to the sound asset file
 * @param soundName - Name of the sound for logging purposes
 * @param volume - Volume level (0.0 to 1.0). Values outside this range are clamped automatically.
 */
async function playSoundFile(soundPath: AVPlaybackSource, soundName: string, volume: number = 1.0) {
  try {
    // Validate volume is in valid range (0.0 to 1.0)
    const validVolume = Math.max(0.0, Math.min(1.0, volume));
    
    const { sound } = await Audio.Sound.createAsync(
      soundPath,
      { shouldPlay: true, volume: validVolume }
    );
    
    // Unload after playing to free resources
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync().catch((err) => {
          console.warn(`[Sound] Failed to unload ${soundName}:`, err instanceof Error ? err.message : 'Unknown error');
        });
      }
    });
  } catch (error) {
    // Log error but don't crash - sound is optional
    const errorMsg = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : JSON.stringify(error);
    console.warn(`[Sound] Could not play ${soundName}:`, errorMsg);
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
