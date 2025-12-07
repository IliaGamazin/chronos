import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarsApi } from '@/api/calendarsApi';
import { getUserLocale } from '@/utils/localeUtils';

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
    },
  });
};

export const useCreateInvite = () => {
  return useMutation({
    mutationKey: ['createInvite'],
    mutationFn: calendarsApi.invite,
    onError: error => {
      console.error('Failed to generate invite token:', error);
    },
  });
};

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarsApi.updateCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
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
    },
  });
};

export const useRemoveCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarsApi.removeCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
    },
  });
};

export const useSendInviteEmail = () => {
  return useMutation({
    mutationFn: calendarsApi.sendInviteEmail,
    onSuccess: () => {
      console.log('Email sent successfully');
    },
    onError: error => {
      console.error('Failed to send email:', error);
    },
  });
};
