import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  isAuthenticated as checkAuthenticatedSession,
  logoutUser,
} from '../api/user';

/**
 * Auth Context — menyediakan state autentikasi untuk seluruh app.
 * Dipakai oleh Navbar (LOGIN vs PROFILE) dan tombol aksi di halaman detail.
 *
 * Struktur disepakati lintas tim (Orang 1, 2, 3, 4).
 */
const AuthContext = createContext({
  isAuthenticated: false,
  isAuthLoading: true,
  user: null,
  login: () => {},
  logout: () => {},
});

const getStoredUser = () => {
  try {
    const savedUser = sessionStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const hasStoredAuthHint = () =>
  Boolean(
    localStorage.getItem('authToken') ||
      localStorage.getItem('isLoggedIn') === 'true' ||
      localStorage.getItem('userId') ||
      sessionStorage.getItem('userData'),
  );

const clearStoredAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userId');
  sessionStorage.removeItem('userData');
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasStoredAuthHint());
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState(() => getStoredUser());

  // Sinkronisasi state auth dengan localStorage/sessionStorage
  const checkAuth = async () => {
    const storedUser = getStoredUser();
    const storedAuthHint = hasStoredAuthHint();

    if (storedAuthHint) {
      setIsAuthenticated(true);
    }

    if (storedUser) {
      setUser(storedUser);
    }

    try {
      const hasActiveSession = await checkAuthenticatedSession();

      if (!hasActiveSession) {
        setIsAuthenticated(false);
        setUser(null);
        clearStoredAuth();
        return;
      }

      const userResponse = await getCurrentUser();
      const currentUser = userResponse.success ? userResponse.data : storedUser;

      setIsAuthenticated(true);
      setUser(currentUser);
      localStorage.setItem('isLoggedIn', 'true');

      if (currentUser?.id) {
        localStorage.setItem('userId', currentUser.id);
      }

      if (currentUser) {
        sessionStorage.setItem('userData', JSON.stringify(currentUser));
      }
    } catch {
      if (!storedAuthHint) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setIsAuthLoading(false);
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
    if (token) {
      localStorage.setItem('authToken', token);
    }

    localStorage.setItem('isLoggedIn', 'true');

    if (userData?.id) {
      localStorage.setItem('userId', userData.id);
    }

    if (userData) {
      sessionStorage.setItem('userData', JSON.stringify(userData));
    }

    setIsAuthenticated(true);
    setUser(userData);
    window.dispatchEvent(new Event('auth-changed'));
  };

  const logout = async () => {
    await logoutUser();
    clearStoredAuth();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthLoading, user, login, logout }}>
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
