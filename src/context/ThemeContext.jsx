import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark'); // 'dark' | 'day'

  useEffect(() => {
    document.body.classList.toggle('theme-day', theme === 'day');
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'day' ? 'dark' : 'day'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme harus dipakai di dalam <ThemeProvider>');
  return ctx;
}
