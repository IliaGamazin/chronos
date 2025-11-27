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
    },
  });
};
