const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export const authService = {
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
      this.clearAuth();
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
