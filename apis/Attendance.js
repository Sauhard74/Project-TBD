import { apiInstance } from '../context/Configuration';

export const fetchDailyAttendance = async (classId) => {
  return apiInstance
    .get(`/class_student_attendance/${classId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateAttendance = async (data) => {
  return apiInstance
    .post(`/class_student_attendance/${data.classId}`, data.body)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchWeeklyAttendance = async (classId) => {
  return apiInstance
    .get(`/student_weekly_attendance/${classId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchMonthlyAttendance = async (classId) => {
  return apiInstance
    .get(`/student_monthly_attendance/${classId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchYearlyAttendance = async (classId) => {
  return apiInstance
    .get(`/student_yearly_attendance/${classId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateAllStudentsAttendance = async (data) => {
  return apiInstance
    .post(`/mark_all_present/${data.classId}`, data.body)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchParentAttendance = async (data) => {
  return apiInstance
    .post(`/parent_child_attendance/${data.classId}`, data.body)
    .then((response) => response.data)
    .catch((error) => error);
};
