import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { useAuthContext } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuthContext();

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: response => {
      const { access_token, user } = response.data;
      login(access_token, user);
      navigate('/dashboard');
    },
    onError: error => {
      console.error('Registration error:', error);
      throw error;
    },
  });

  const register = data => {
    toast.promise(
      registerMutation.mutateAsync(data),
      {
        loading: 'Registering...',
        success: 'Registration successful! Redirecting...',
        error: err =>
          err.response?.data?.error?.message || 'Registration failed.',
      },
      { id: 'authAction' }
    );
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: response => {
      const { access_token, user } = response.data;
      login(access_token, user);
      navigate('/dashboard');
    },
    onError: error => {
      console.error('Login error:', error);
      throw error;
    },
  });

  const loginFn = data => {
    toast.promise(
      loginMutation.mutateAsync(data),
      {
        loading: 'Logging in...',
        success: 'Login successful! Redirecting...',
        error: err =>
          err.response?.data?.error?.message || 'Invalid credentials.',
      },
      { id: 'authAction' }
    );
  };

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      navigate('/login');
      toast.success('Successfully logged out.', { id: 'authAction' });
    },
    onError: error => {
      logout();
      navigate('/login');
      console.error('Logout error:', error);
      toast.error('Logout failed, but session was closed.', {
        id: 'authAction',
      });
    },
  });

  return {
    register: register,
    login: loginFn,
    logout: logoutMutation.mutate,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    registerError: registerMutation.error,
    loginError: loginMutation.error,
  };
};
