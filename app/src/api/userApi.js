import { axiosInstance } from '@/utils/axiosInterceptor';
import qs from 'qs';

export const userApi = {
  updateUser: async ({ userData }) => {
    const response = await axiosInstance.patch(`/users`, userData);
    return response.data;
  },

  setUserAvatar: async ({ avatarFile }) => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await axiosInstance.patch(
      `/users/avatar`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    return response.data;
  },
};