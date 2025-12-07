import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import toast from 'react-hot-toast';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User profile updated successfully.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message ||
        'Failed to update user profile.';
      toast.error(message);
    },
  });
};

export const useSetUserAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.setUserAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Avatar set successfully.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to set user avatar.';
      toast.error(message);
    },
  });
};
