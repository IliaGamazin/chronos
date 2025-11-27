import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { useAuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuthContext();

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      navigate('/login');
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: response => {
      const { access_token, user } = response.data;
      login(access_token, user);
      navigate('/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      navigate('/login');
    },
    onError: error => {
      logout();
      navigate('/login');
      console.error('Logout error:', error);
    },
  });

  return {
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    registerError: registerMutation.error,
    loginError: loginMutation.error,
  };
};
