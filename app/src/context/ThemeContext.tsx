import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  colors: typeof lightColors | typeof darkColors;
}

const lightColors = {
  primary: '#FF6B35',
  secondary: '#FFD700',
  accent: '#4CAF50',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceSecondary: '#E0E0E0',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#DDDDDD',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  card: '#FFFFFF',
  cardSecondary: '#F8F9FA',
  shadow: 'rgba(0,0,0,0.1)',
  overlay: 'rgba(0,0,0,0.5)',
};

const darkColors = {
  primary: '#FF6B35',
  secondary: '#FFD700',
  accent: '#4CAF50',
  background: '#1A1A1A',
  surface: '#2A2A2A',
  surfaceSecondary: '#3A3A3A',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textTertiary: '#999999',
  border: '#444444',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  card: '#2A2A2A',
  cardSecondary: '#3A3A3A',
  shadow: 'rgba(0,0,0,0.3)',
  overlay: 'rgba(0,0,0,0.8)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    // Initialize theme based on system preference, but default to dark
    if (systemColorScheme) {
      setThemeState(systemColorScheme as Theme);
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 