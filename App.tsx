import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameProvider } from './src/state/GameContext';
import { theme } from './src/theme/theme';
import { initializeSounds } from './src/utils/sounds';

// Screens
import StartScreen from './src/screens/StartScreen';
import PlayersScreen from './src/screens/PlayersScreen';
import TeamsScreen from './src/screens/TeamsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TurnScreen from './src/screens/TurnScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import ScoreScreen from './src/screens/ScoreScreen';
import VictoryScreen from './src/screens/VictoryScreen';
import HistoryScreen from './src/screens/HistoryScreen';

export type RootStackParamList = {
  Start: undefined;
  Players: undefined;
  Teams: undefined;
  Settings: undefined;
  Turn: { teamId: string };
  Review: undefined;
  Score: undefined;
  Victory: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // Initialize sounds on app start
  useEffect(() => {
    initializeSounds();
  }, []);

  return (
    <GameProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.text,
            border: theme.colors.border,
            notification: theme.colors.primary,
          },
        }}
      >
        <Stack.Navigator
          initialRouteName="Start"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
          }}
        >
          <Stack.Screen 
            name="Start" 
            component={StartScreen}
            options={{ title: 'Med Andra Ord' }}
          />
          <Stack.Screen 
            name="Players" 
            component={PlayersScreen}
            options={{ title: 'Spelare' }}
          />
          <Stack.Screen 
            name="Teams" 
            component={TeamsScreen}
            options={{ title: 'Lag' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Inställningar' }}
          />
          <Stack.Screen 
            name="Turn" 
            component={TurnScreen}
            options={{ 
              title: 'Tur',
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Review" 
            component={ReviewScreen}
            options={{ title: 'Granska Tur' }}
          />
          <Stack.Screen 
            name="Score" 
            component={ScoreScreen}
            options={{ title: 'Poängtavla' }}
          />
          <Stack.Screen 
            name="Victory" 
            component={VictoryScreen}
            options={{ title: 'Seger!' }}
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen}
            options={{ title: 'Historik' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
