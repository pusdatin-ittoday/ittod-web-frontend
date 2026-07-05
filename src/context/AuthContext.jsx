import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  isAuthenticated as checkAuthenticatedSession,
} from '../api/user';

/**
 * Auth Context — menyediakan state autentikasi untuk seluruh app.
 * Dipakai oleh Navbar (LOGIN vs PROFILE) dan tombol aksi di halaman detail.
 *
 * Struktur disepakati lintas tim (Orang 1, 2, 3, 4).
 */
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Sinkronisasi state auth dengan localStorage/sessionStorage
  const checkAuth = async () => {
    const savedUser = sessionStorage.getItem('userData');

    if (savedUser) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }

    const hasActiveSession = await checkAuthenticatedSession();

    if (!hasActiveSession) {
      setIsAuthenticated(false);
      setUser(null);
      sessionStorage.removeItem('userData');
      return;
    }

    const userResponse = await getCurrentUser();
    const currentUser = userResponse.success ? userResponse.data : null;

    setIsAuthenticated(true);
    setUser(currentUser);

    if (currentUser) {
      sessionStorage.setItem('userData', JSON.stringify(currentUser));
    }
  };

  useEffect(() => {
    void checkAuth();
    const handleAuthChanged = () => {
      void checkAuth();
    };

    window.addEventListener('auth-changed', handleAuthChanged);
    return () => window.removeEventListener('auth-changed', handleAuthChanged);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    sessionStorage.setItem('userData', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    window.dispatchEvent(new Event('auth-changed'));
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('auth-changed'));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook untuk konsumsi AuthContext.
 * Usage: const { isAuthenticated, user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
