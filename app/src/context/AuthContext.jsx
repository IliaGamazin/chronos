import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authService } from '@/utils/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = useCallback((token, userData) => {
    authService.setToken(token);
    authService.setUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    authService.clearAuth();
    setUser(null);
    setIsAuthenticated(false);

    window.localStorage.setItem('logout-event', Date.now().toString());
    window.localStorage.removeItem('logout-event');
  }, []);

  useEffect(() => {
    const storedUser = authService.getUser();
    const isAuth = authService.isAuthenticated();

    if (storedUser && isAuth) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);

    const handleStorageChange = e => {
      if (e.key === 'logout-event') {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout]);

  const updateUser = useCallback(userData => {
    authService.setUser(userData);
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
