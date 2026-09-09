import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'spj_logged_in_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  function login(userObj) {
    setUser(userObj);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj)); } catch { /* abaikan kalau storage diblokir */ }
  }
  function logout() {
    setUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* abaikan */ }
  }
  function updateUser(patch) {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* abaikan */ }
      return next;
    });
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
