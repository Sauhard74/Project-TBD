import { captureException } from '@sentry/react-native';
import { apiInstance } from '../context/Configuration';

export type escortPayloadType = {
  child_ids: string[];
  first_name: string;
  last_name: string;
  gender?: string;
  phone_number: string;
  profile_picture?: string;
  email: string;
};

/**
 * Creates an assistant guardian for a parent.
 *
 * @param parentId - The ID of the parent.
 * @param escortData - The details about the assistant guardian.
 * @returns The result of the API call.
 */
export const createEscortForParent = async (parentId: string, escortData: escortPayloadType) => {
  const response: any = await apiInstance
    .post(`/add_parent_escort_profile/${parentId}`, escortData)
    .catch((error) => captureException(error));

  return response?.data?.result;
};

/**
 * Retrieves the details of an assistant guardian.
 *
 * @param escortId - The ID of the assistant guardian.
 * @returns The result of the API call.
 */
export const getEscortDetails = async (escortId: string) => {
  const response: any = await apiInstance
    .get(`/parent_escort_profile/${escortId}`)
    .catch((error) => captureException(error));

  return response?.data?.result;
};

/**
 * Retrieves all escorts associated with a parent ID.
 *
 * @param parentId - The ID of the parent.
 * @returns A promise that resolves to the result data of the API response.
 */
export const getAllEscorts = async (parentId: string) => {
  const response: any = await apiInstance
    .get(`/get_student_escorts_profile/${parentId}`)
    .catch((error) => captureException(error));

  return response?.data?.result;
};

/**
 * Updates the details of an assistant guardian.
 *
 * @param escortId - The ID of the assistant guardian.
 * @param escortData - The updated details about the assistant guardian.
 * @returns The result of the API call.
 */
export const updateEscortDetails = async (escortId: string, escortData: escortPayloadType) => {
  const response: any = await apiInstance
    .post(`/parent_escort_profile/${escortId}`, escortData)
    .catch((error) => captureException(error));

  return response?.data?.result;
};

/**
 * Deletes an assistant guardian.
 *
 * @param escortId - The ID of the assistant guardian.
 * @returns The result of the API call.
 */
export const deleteEscort = async (escortId: string) => {
  const response: any = await apiInstance
    .delete(`/parent_escort_profile/${escortId}`)
    .catch((error) => captureException(error));

  return response?.data?.result;
};
