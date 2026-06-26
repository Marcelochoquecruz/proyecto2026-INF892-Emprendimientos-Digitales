import { createContext, useState, useEffect, ReactNode } from 'react';
// createContext: para pasar valores globales a través de la jerarquía de componentes sin "props drilling"
// useState: para manejar el estado local en componentes funcionales
// useEffect: para ejecutar efectos secundarios como llamadas a APIs o sincronizar con el DOM
// ReactNode: tipo que describe cualquier contenido que React pueda renderizar (para TypeScript)
type ThemeContextType = {
  //Este tipo se usa generalmente para proporcionar un contexto tipado que facilite la gestión del tema
  theme: string; // La propiedad "theme" es de tipo string, representa el tema actual (ej. "light" o "dark")
  toggleTheme: () => void; // "toggleTheme" es una función que no recibe parámetros y no devuelve nada
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
//creando y ex´portando el contexto para que ptros componentes lo usen
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('light'); // Establecer el estado inicial a 'light'

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Carga el tema guardado o usa 'light' si no hay ninguno
    setTheme(savedTheme); // Actualiza el estado del tema
    document.documentElement.classList.add(savedTheme); // Aplica la clase del tema al <html> para cambiar los estilos globales
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'; // Cambia el tema: si es 'light', lo pone en 'dark' y viceversa
    setTheme(newTheme); // Actualiza el estado del tema
    document.documentElement.classList.remove(theme); // Elimina la clase del tema actual del <html>
    document.documentElement.classList.add(newTheme); // Agrega la clase del nuevo tema al <html>
    localStorage.setItem('theme', newTheme); // Guarda el nuevo tema en localStorage para futuras visitas
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
