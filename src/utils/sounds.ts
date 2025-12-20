import { Audio } from 'expo-av';

let warningSound: Audio.Sound | null = null;
let endSound: Audio.Sound | null = null;

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
 * Play a warning sound (10 seconds remaining)
 */
export async function playWarningSound() {
  try {
    // Create and play a short beep tone
    const { sound } = await Audio.Sound.createAsync(
      // Using Data URI for a simple beep sound
      { uri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' },
      { shouldPlay: true, volume: 0.8 }
    );
    
    // Unload after playing
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Failed to play warning sound:', error);
    // Fallback to console log
    console.log('🔔 10 seconds remaining!');
  }
}

/**
 * Play an end sound (time's up)
 */
export async function playEndSound() {
  try {
    // Create and play a longer beep tone
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' },
      { shouldPlay: true, volume: 1.0 }
    );
    
    // Unload after playing
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Failed to play end sound:', error);
    // Fallback to console log
    console.log('⏰ Time\'s up!');
  }
}

/**
 * Cleanup sounds on app exit
 */
export async function cleanupSounds() {
  try {
    if (warningSound) {
      await warningSound.unloadAsync();
      warningSound = null;
    }
    if (endSound) {
      await endSound.unloadAsync();
      endSound = null;
    }
  } catch (error) {
    console.error('Failed to cleanup sounds:', error);
  }
}
