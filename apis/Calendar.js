import { apiInstance } from '../context/Configuration';

export const createEvent = async (data) => {
  return await apiInstance
    .post(`/create_class_event/`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchYearlyNdMonthlyEvents = async (classId, data) => {
  return await apiInstance
    .post(`/class_monthly_yearly_events/${classId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateEvents = async (eventId, data) => {
  return await apiInstance
    .post(`/class_event/${eventId}`, data)
    .then((response) => response.data);
};

export const deleteEvents = async (eventId) => {
  return await apiInstance
    .delete(`/class_event/${eventId}`)
    .then((response) => response.status);
};
