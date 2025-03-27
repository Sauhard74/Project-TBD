import { captureException } from '@sentry/react-native';
import { apiInstance } from '../context/Configuration';
import { aiBaseUrl } from '../utilities/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

/**
 * Fetches the activity details for a given activity ID.
 *
 * @param {string} activityId - The unique identifier of the activity to fetch.
 * @returns {Promise<ActivityType>} A promise that resolves to the activity details.
 * @throws Will throw an error if the request fails.
 */
export const fetchActivity = async (activityId: string) => {
  try {
    const response = await apiInstance.get(`/activity/${activityId}`);

    return response?.data?.activity as ActivityType;
  } catch (error) {
    captureException(error);
    throw error;
  }
};

/**
 * Modifies an activity with the given activity ID and payload.
 *
 * @param {string} activityId - The ID of the activity to be modified.
 * @param {ActivityType} payload - The data to update the activity with.
 * @returns {Promise<any>} - A promise that resolves to the response data.
 * @throws {Error} - Throws an error if the request fails.
 */
export const modifyActivity = async (activityId: string, payload: ActivityType) => {
  try {
    const response = await apiInstance.post(`/activity/${activityId}`, payload);

    return response?.data;
  } catch (error) {
    captureException(error);
    throw error;
  }
};

/**
 * Deletes an activity with the given activity ID.
 *
 * @param {string} activityId - The ID of the activity to be deleted.
 * @returns {Promise<any>} - A promise that resolves to the response data.
 * @throws {Error} - Throws an error if the request fails.
 */
export const deleteActivity = async (activityId: string) => {
  try {
    const response = await apiInstance.delete(`/activity/${activityId}`);

    return response?.data;
  } catch (error) {
    captureException(error);
    throw error;
  }
};

/**
 * Generates outcomes for an activity using AI.
 *
 * @param {string} activity_description - The description of the activity.
 * @param {string} class_id - The ID of the class.
 * @param {string} staffId - The ID of the staff member.
 * @param {string} staffName - The name of the staff member.
 * @returns {Promise<any>} - A promise that resolves to the response data.
 * @throws {Error} - Throws an error if the request fails.
 */
export const generateActivityOutcomes = async (
  activity_description: string,
  class_id: string,
  staffId: string,
  staffName: string
) => {
  try {
    const token = await AsyncStorage.getItem('staff_token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.post(
      `${aiBaseUrl}/outcome-selector`,
      {
        user_query: JSON.stringify({
          activity_description,
          class_id
        }),
        user_details: {
          token,
          user_id: staffId,
          user_name: staffName,
          user_role: 'staff'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response?.data;
  } catch (error) {
    captureException(error);
    throw error;
  }
};
