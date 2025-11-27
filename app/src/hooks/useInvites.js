import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitesApi } from '@/api/invitesApi';

export const useCreateInvite = () => {
  return useMutation({
    mutationFn: invitesApi.createInvite,
    onError: (error) => {
      console.error('Failed to create invite:', error);
    }
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
    },
  });
};

export const useDeclineInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invitesApi.declineInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
    }
  });
};
