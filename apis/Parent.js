import * as Sentry from '@sentry/react-native';
import { apiInstance } from '../context/Configuration';

export const fetchParent = async (parentId) => {
  const response = await apiInstance
    .get(`/parent/${parentId}`)
    .catch((error) => Sentry.captureException(error));

  return response?.data?.result;
};

export const fetchParentList = async () => {
  return await apiInstance
    .get('/parent/')
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchParentExcusal = async (data) => {
  return await apiInstance
    .post(`/fetch_child_excusal/${data.classId}`, data.body)
    .then((response) => response.data)
    .catch((error) => error);
};

export const createExcusal = async (data) => {
  return await apiInstance
    .post(`/create_child_excusal/${data.classId}`, data.body)
    .then((response) => response.data)
    .catch((error) => error);
};

export const modifyParent = async (parentId, body) => {
  const response = await apiInstance.post(`/parent/${parentId}`, body);
  return response.data;
};

export const updateParentChild = async (data) => {
  return await apiInstance
    .post(`/parent_child_switch/`, data)
    .then((response) => response.data)
    .catch((error) => error);
};
