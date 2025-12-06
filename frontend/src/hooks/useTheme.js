import { useContext } from 'react';
import { ThemeModeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeModeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeModeProvider');
  }
  
  return context;
};
