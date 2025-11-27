import { axiosInstance } from '@/utils/axiosInterceptor';

export const eventsApi = {
  getEvents: async filters => {
    const response = await axiosInstance.get('/events', { params: filters });
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

  deleteEvent: async eventId => {
    const response = await axiosInstance.delete(`/events/${eventId}`);
    return response.data;
  },
};