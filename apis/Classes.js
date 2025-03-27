import { captureException } from '@sentry/react-native';
import { apiInstance } from '../context/Configuration';

export const fetchClasses = async () => {
  return await apiInstance
    .get('/classes/')
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchClassActivities = async (classId) => {
  return await apiInstance
    .get(`/class_all_units_activity/${classId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchClassDetails = async (classId) => {
  return await apiInstance
    .get(`/classes/${classId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

/**
 * Fetches all the classes of all schools that the user is associated with.
 *
 * @function fetchAllSchoolClasses
 * @returns A promise that resolves to the result of the API call.
 * @throws Will throw an error if the API call fails.
 */
export const fetchAllSchoolClasses = async () => {
  try {
    const response = await apiInstance.get('/user_schools_classes/');
    return response.data?.result;
  } catch (error) {
    captureException(error);
    throw error;
  }
};
