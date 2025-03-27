import { apiInstance } from '../context/Configuration';

type APIType = 'announcement' | 'homework';

export const fetchAnnouncementsNHomework = async (type: APIType) => {
  const url = type === 'announcement' ? '/fetch_announcement/' : '/class_homework/';
  return await apiInstance
    .get(url)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchBroadcasts = async () => {
  return await apiInstance
    .get('/fetch_broadcast/')
    .then((response) => response.data)
    .catch((error) => error);
};

export const createBroadcast = async (data: any) => {
  return await apiInstance
    .post('/create_broadcast/', data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const createAnnouncement = async (data: any, type: APIType) => {
  const url = type === 'announcement' ? '/create_announcement/' : '/class_homework/';
  return await apiInstance
    .post(url, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateAnnouncement = async (data: any, type: APIType) => {
  const url = type === 'announcement' ? 'announcement' : 'edit_class_homework';
  return await apiInstance
    .post(`/${url}/${data.id}`, data.body)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchAnnouncementNHomeworkById = async (id: string, type: APIType) => {
  const url = type === 'announcement' ? 'announcement' : 'edit_class_homework';
  return await apiInstance
    .get(`/${url}/${id}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchInboxAnnouncements = async () => {
  return await apiInstance
    .get(`/user_inbox_announcements/`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const deleteAnnouncementsNHomework = async (id: string, type: APIType) => {
  const url = type === 'announcement' ? 'announcement' : 'edit_class_homework';
  return await apiInstance
    .delete(`/${url}/${id}`)
    .then((response) => response.data)
    .catch((error) => error);
};
