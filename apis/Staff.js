import { apiInstance } from '../context/Configuration';

export const fetchStaffClasses = async () => {
  const response = await apiInstance.get(`/staff_classes/`);

  return response.data;
};

export const fetchStaffList = async () => {
  const response = await apiInstance.get('/staff/');
  return response.data?.result;
};

export const updateUserCurrentSchool = async (data) => {
  const response = await apiInstance.post(`/logged_in_staff_school_switch/`, data);
  return response.data;
};

export const modifyStaff = async (staffId, body) => {
  const response = await apiInstance.post(`/staff/${staffId}`, body);
  return response.data;
};
