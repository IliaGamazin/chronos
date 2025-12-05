import { axiosInstance } from '@/utils/axiosInterceptor';

export const calendarsApi = {
  getCalendars: async filters => {
    const response = await axiosInstance.get('/calendars', { params: filters });
    return response.data;
  },

  getCalendar: async (calendarId, params) => {
    const response = await axiosInstance.get(`/calendars/${calendarId}`, {
      params,
    });
    return response.data;
  },

  createCalendar: async calendarData => {
    const response = await axiosInstance.post('/calendars', calendarData);
    return response.data;
  },

  updateCalendar: async ({ calendarId, calendarData }) => {
    const response = await axiosInstance.patch(
      `/calendars/${calendarId}`,
      calendarData
    );
    return response.data;
  },

  deleteCalendar: async calendarId => {
    try {
      const response = await axiosInstance.delete(`/calendars/${calendarId}`, {
        timeout: 10000,
      });
      return response.data || { success: true };
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out');
      }
      throw error;
    }
  },

  unfollowCalendar: async calendarId => {
    const response = await axiosInstance.delete(
      `/calendars/${calendarId}/unfollow`
    );
    return response.data || { success: true };
  },

  removeCollaborator: async ({ calendarId, userId }) => {
    const response = await axiosInstance.delete(
      `/calendars/${calendarId}/${userId}`
    );
    return response.data || { success: true };
  },
};
