import { apiInstance } from '../context/Configuration';

export const fetchClassAllExcusals = async (classId) => {
  return await apiInstance
    .get(`/fetch_update_class_excusal/${classId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateStudentExcusal = async (classId, data) => {
  return await apiInstance
    .post(`/fetch_update_class_excusal/${classId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};
