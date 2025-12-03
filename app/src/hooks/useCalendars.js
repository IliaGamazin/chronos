import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarsApi } from '@/api/calendarsApi';

export const useCalendars = filters => {
  return useQuery({
    queryKey: ['calendars', filters],
    queryFn: () => calendarsApi.getCalendars(filters),
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
  return useQuery({
    queryKey: ['calendar', calendarId],
    queryFn: () => calendarsApi.getCalendar(calendarId),
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
