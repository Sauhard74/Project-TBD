import { captureException } from '@sentry/react-native';
import { apiInstance } from '../context/Configuration';

/**
 * Retrieves the school settings from the API.
 * @returns A promise that resolves to the school settings data.
 */
export const getSchoolSettings = async () => {
  const response: any = await apiInstance
    .get('/manage_school_settings/')
    .catch((error) => captureException(error));

  return response?.data?.result as SchoolSettingsType;
};

/**
 * Fetches all the staff details for a given school.
 *
 * @param schoolId - The unique identifier of the school.
 * @returns A promise that resolves to an array of staff details.
 * @throws Will capture and log any errors encountered during the API call.
 */
export const getSchoolStaff = async (schoolId: string) => {
  const response: any = await apiInstance
    .get('/school_all_staffs/' + schoolId)
    .catch((error) => captureException(error));

  return response?.data?.result as StaffDetailsType[];
};
