import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarsApi } from '@/api/calendarsApi';
import { getUserLocale } from '@/utils/localeUtils';
import toast from 'react-hot-toast';

export const useCalendars = filters => {
  const locale = getUserLocale();

  return useQuery({
    queryKey: ['calendars', filters, locale],
    queryFn: () => calendarsApi.getCalendars({ ...filters, locale }),
  });
};

export const useCreateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarsApi.createCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      toast.success('Calendar created successfully.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to create calendar.';
      toast.error(message);
    },
  });
};

export const useCreateInvite = () => {
  return useMutation({
    mutationKey: ['createInvite'],
    mutationFn: calendarsApi.invite,
    onSuccess: () => {
      toast.success('Invite token generated.', { id: 'inviteGen' });
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to generate invite.';
      toast.error(message, { id: 'inviteGen' });
    },
    onMutate: () => {
      toast.loading('Generating invite link...', { id: 'inviteGen' });
    },
  });
};

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarsApi.updateCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      toast.success('Calendar settings updated successfully.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to update calendar.';
      toast.error(message);
    },
  });
};

export const useDeleteCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarsApi.deleteCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Calendar deleted.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to delete calendar.';
      toast.error(message);
    },
  });
};

export const useCalendar = calendarId => {
  const locale = getUserLocale();

  return useQuery({
    queryKey: ['calendar', calendarId, locale],
    queryFn: () => calendarsApi.getCalendar(calendarId, { locale }),
    enabled: !!calendarId,
  });
};

export const useUnfollowCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarsApi.unfollowCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Successfully unfollowed calendar.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to unfollow calendar.';
      toast.error(message);
    },
  });
};

export const useRemoveCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarsApi.removeCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      toast.success('Collaborator removed.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message ||
        'Failed to remove collaborator.';
      toast.error(message);
    },
  });
};

export const useSendInviteEmail = () => {
  return useMutation({
    mutationFn: calendarsApi.sendInviteEmail,
    onSuccess: () => {
      toast.success('Invitation email sent successfully.', { id: 'emailSend' });
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message ||
        'Failed to send invitation email.';
      toast.error(message, { id: 'emailSend' });
    },
    onMutate: () => {
      toast.loading('Sending invitation email...', { id: 'emailSend' });
    },
  });
};
