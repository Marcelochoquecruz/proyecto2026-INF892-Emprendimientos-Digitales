import { useContext } from 'react';
import { ThemeContext } from './ThemeContext'; // Asegúrate de importar desde la ubicación correcta

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
