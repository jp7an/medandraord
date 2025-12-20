export const theme = {
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#bb86fc',
    secondary: '#03dac6',
    error: '#cf6679',
    
    // Game-specific colors
    correct: '#4caf50',      // Green for RÄTT
    pass: '#000000',          // Black for PASS
    foul: '#9e9e9e',          // Neutral gray for REGELBROTT
    invalid: '#424242',       // Dark gray for OGILTIG
    
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333',
    
    // Word type colors
    wordTypes: {
      substantiv: '#2196f3',  // Blue
      adjektiv: '#ff9800',    // Orange
      verb: '#f44336',        // Red
      personer: '#e91e63',    // Pink
      platser: '#ffeb3b',     // Yellow
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    huge: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export type Theme = typeof theme;
