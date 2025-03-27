import { apiInstance } from '../context/Configuration';

export const fetchNotificationSettings = async () => {
  return await apiInstance
    .get(`/manage_user_notification_settings/`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateNotificationSettings = async (data) => {
  return await apiInstance
    .post(`/manage_user_notification_settings/`, data)
    .then((response) => response.data)
    .catch((error) => error);
};
