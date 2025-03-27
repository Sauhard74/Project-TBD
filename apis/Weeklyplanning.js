import { apiInstance } from '../context/Configuration';

export const fetchClassPeriods = async (classId, data) => {
  return await apiInstance
    .post(`/fetch_period/${classId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const createClassPeriod = async (data) => {
  return await apiInstance
    .post(`/create_period/`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchClassProjects = async (classId) => {
  return await apiInstance
    .get(`/class_units/${classId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchProjectActivities = async (projectId) => {
  return await apiInstance
    .get(`/units/${projectId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const assignActivitiesToPeriod = async (periodId, data) => {
  return await apiInstance
    .post(`/period_activity/${periodId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchClassDefaultProject = async (classId) => {
  return await apiInstance
    .get(`/class_default_project/${classId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const createActivity = async (data) => {
  return await apiInstance
    .post(`/activity/`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateActivitySummary = async (activityId, data) => {
  return await apiInstance
    .post(`/activity/${activityId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const deleteActivityFromPeriod = async (periodId, data) => {
  return await apiInstance
    .delete(`/period_activity/${periodId}`, { data })
    .then((response) => response.data)
    .catch((error) => error);
};

export const deletePeriod = async (periodId, data) => {
  return await apiInstance
    .delete(`/delete_period/${periodId}`, { data })
    .then((response) => response.data)
    .catch((error) => error);
};

export const updatePeriod = async (periodId, data) => {
  return await apiInstance
    .post(`/update_period/${periodId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateActivity = async (activityId, data) => {
  return await apiInstance
    .post(`/activity/${activityId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};
