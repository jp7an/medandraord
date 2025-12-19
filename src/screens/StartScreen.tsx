import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import BigButton from '../components/BigButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Start'>;

export default function StartScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Med Andra Ord</Text>
          <Text style={styles.subtitle}>Ordspel för festliga stunder</Text>
        </View>

        <View style={styles.buttonContainer}>
          <BigButton
            title="Ny Match"
            onPress={() => navigation.navigate('Players')}
            color={theme.colors.primary}
            style={styles.button}
          />
          
          <BigButton
            title="Visa Historik"
            onPress={() => navigation.navigate('History')}
            color={theme.colors.secondary}
            style={styles.button}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Ett klassiskt ordspel där lag tävlar om att förklara ord.
          </Text>
          <Text style={styles.infoText}>
            Två spellägen, anpassningsbara regler, och roligt för hela sällskapet!
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  button: {
    width: '100%',
  },
  infoContainer: {
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
