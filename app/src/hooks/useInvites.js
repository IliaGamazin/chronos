import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitesApi } from '@/api/invitesApi';
import toast from 'react-hot-toast';

export const useCreateInvite = () => {
  return useMutation({
    mutationFn: invitesApi.createInvite,
    onSuccess: () => {
      toast.success('Invite created successfully.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to create invite.';
      toast.error(message);
    },
  });
};

export const useInviteDetails = token => {
  return useQuery({
    queryKey: ['invite', token],
    queryFn: () => invitesApi.getInviteDetails(token),
    enabled: !!token,
  });
};

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invitesApi.acceptInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      toast.success('Invitation accepted. Calendar added!');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to accept invitation.';
      toast.error(message);
    },
  });
};

export const useDeclineInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invitesApi.declineInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      toast.success('Invitation declined.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to decline invitation.';
      toast.error(message);
    },
  });
};
