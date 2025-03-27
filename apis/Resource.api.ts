import { apiInstance } from '../context/Configuration';
import { captureException } from '@sentry/react-native';

/**
 * Fetches all resources for a given class ID.
 *
 * @param {string} classId - The ID of the class to fetch resources for.
 * @returns {Promise<ResourceResponseType>}
 *          A promise that resolves to an object containing arrays of media, docs, and links resources.
 * @throws Will throw an error if the request fails.
 */
export const fetchAllResources = async (classId: string): Promise<ResourceResponseType> => {
  try {
    const { data } = await apiInstance.get(`/fetch_resources/${classId}`);
    return data?.result;
  } catch (error) {
    captureException(error);
    return { media: [], docs: [], links: [] };
  }
};

/**
 * Fetches all resource folders for a given class ID.
 *
 * @param {string} classId - The ID of the class to fetch folders for.
 * @returns {Promise<ResourceFolderType[]>}
 *          A promise that resolves to an array of folder objects.
 * @throws Will throw an error if the request fails.
 */
export const fetchResourceFolders = async (classId: string): Promise<ResourceFolderType[]> => {
  try {
    const { data } = await apiInstance.get(`/resource_library/${classId}`);
    return data?.result;
  } catch (error) {
    captureException(error);
    return [];
  }
};

/**
 * Creates resources for a given class.
 *
 * @param {string} classId - The ID of the class for which resources are being created.
 * @param {ResourceType[]} resources - An array of resources to be created.
 * @returns {Promise<any>} A promise that resolves to the result of the created resources or an empty array if an error occurs.
 * @throws Will log an error message and capture the exception if the API request fails.
 */
export const createResources = async (classId: string, resources: ResourceType[]): Promise<any> => {
  try {
    const { data } = await apiInstance.post(`/create_resources/${classId}`, { resources });
    return data?.result;
  } catch (error) {
    console.error('Failed: ', error);
    captureException(error);
  }
};
