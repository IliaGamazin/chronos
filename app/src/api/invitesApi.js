import { axiosInstance } from '@/utils/axiosInterceptor';

export const invitesApi = {
  createInvite: async ({ calendar, role }) => {
    const response = await axiosInstance.post(
      `/calendars/${calendar}/invite`,
      null,
      { params: { role } }
    );
    return response.data;
  },

  getInviteDetails: async token => {
    const response = await axiosInstance.get(`/calendars/invite/${token}`);
    return response.data;
  },

  acceptInvite: async token => {
    const response = await axiosInstance.post(`/calendars/invite/${token}`);
    return response.data;
  },

  declineInvite: async token => {
    const response = await axiosInstance.post(`/calendars/invite/${token}/decline`);
    return response.data;
  },
};
