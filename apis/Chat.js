import { apiInstance } from '../context/Configuration';

export const fetchCoworkers = async () => {
  return await apiInstance
    .get('/school_all_teachers/')
    .then((response) => response?.data)
    .catch((error) => error);
};

export const fetchClassCoworkers = async (classId) => {
  return await apiInstance
    .get(`/chat_class_all_teachers/${classId}`)
    .then((response) => response?.data)
    .catch((error) => error);
};

export const fetchFamilies = async (classId) => {
  return await apiInstance
    .get(`/class_all_parents/${classId}`)
    .then((response) => response?.data)
    .catch((error) => error);
};

export const fetchGroups = async (classId) => {
  return await apiInstance
    .get(`/fetch_create_group/${classId}`)
    .then((response) => response?.data)
    .catch((error) => error);
};

export const sendNotification = async (data) => {
  return await apiInstance
    .post(`/send_chat_notification/`, data)
    .then((response) => response?.data)
    .catch((error) => error);
};

export const isChatAvailable = async () => {
  return await apiInstance
    .get('/chat_enabled/')
    .then((response) => response?.data?.result)
    .catch((error) => error);
};

export const createGroupAPI = async (classId, data) => {
  return await apiInstance
    .post(`/fetch_create_group/${classId}`, data)
    .then((response) => response?.data)
    .catch((error) => error);
};

export const isGroupAvailable = async () => {
  return await apiInstance
    .get('/group_chat_enabled/')
    .then((response) => response?.data?.result)
    .catch((error) => error);
};

export const deleteGroupMember = async (groupId, data) => {
  return await apiInstance
    .delete(`/group_participant/${groupId}`, { data })
    .then((response) => response?.data)
    .catch((error) => error);
};

export const addGroupMember = async (groupId, data) => {
  return await apiInstance
    .post(`/group_participant/${groupId}`, data)
    .then((response) => response?.data)
    .catch((error) => error);
};

export const getGroupDetails = async (groupId) => {
  return await apiInstance
    .get(`/fetch_update_group/${groupId}`)
    .then((response) => response?.data)
    .catch((error) => error);
};

export const deleteGroup = async (groupId) => {
  return await apiInstance
    .delete(`/fetch_update_group/${groupId}`)
    .then((response) => response?.data)
    .catch((error) => error);
};

export const fetchAllMembers = async () => {
  return await apiInstance
    .get('/fetch_classes_users/')
    .then((response) => response?.data)
    .catch((error) => error);
};
