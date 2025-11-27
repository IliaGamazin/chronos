import { axiosInstance } from '@/utils/axiosInterceptor';

export const calendarsApi = {
  getCalendars: async filters => {
    const response = await axiosInstance.get('/calendars', { params: filters });
    return response.data;
  },

  getCalendar: async calendarId => {
    const response = await axiosInstance.get(`/calendars/${calendarId}`);
    return response.data;
  },

  createCalendar: async calendarData => {
    const response = await axiosInstance.post('/calendars', calendarData);
    return response.data;
  },

  updateCalendar: async ({ calendarId, calendarData }) => {
    const response = await axiosInstance.patch(`/calendars/${calendarId}`, calendarData);
    return response.data;
  },

  deleteCalendar: async calendarId => {
    const response = await axiosInstance.delete(`/calendars/${calendarId}`);
    return response.data;
  },
};
