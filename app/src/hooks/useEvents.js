import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/api/eventsApi';
import toast from 'react-hot-toast';

export const useEvents = filters => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventsApi.getEvents(filters),
    enabled: !!filters.calendars && filters.calendars.length > 0,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createEvent'],
    mutationFn: eventsApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to create event.';
      toast.error(message);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated successfully.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to update event.';
      toast.error(message);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteEvent'],
    mutationFn: eventsApi.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to delete event.';
      toast.error(message);
    },
  });
};

export const useToggleTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.toggleTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Task status updated.');
    },
    onError: error => {
      const message =
        error.response?.data?.error?.message || 'Failed to update task status.';
      toast.error(message);
    },
    onMutate: () => {
      toast.loading('Updating task status...', { id: 'toggleTask' });
    },
  });
};
