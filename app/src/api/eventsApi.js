import { axiosInstance } from '@/utils/axiosInterceptor';
import qs from 'qs';

export const eventsApi = {
  getEvents: async filters => {
    const response = await axiosInstance.get('/events', {
      params: filters,
      paramsSerializer: params =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    });
    return response.data;
  },

  getEvent: async eventId => {
    const response = await axiosInstance.get(`/events/${eventId}`);
    return response.data;
  },

  createEvent: async eventData => {
    const response = await axiosInstance.post('/events', eventData);
    return response.data;
  },

  updateEvent: async ({ eventId, eventData }) => {
    const response = await axiosInstance.patch(`/events/${eventId}`, eventData);
    return response.data;
  },

  toggleTask: async eventId => {
    const response = await axiosInstance.post(`/events/${eventId}/toggle_task`);
    return response.data;
  },

  deleteEvent: async eventId => {
    const response = await axiosInstance.delete(`/events/${eventId}`);
    return response.data;
  },
};
