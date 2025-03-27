import { apiInstance } from '../context/Configuration';
import { captureException } from '@sentry/react-native';

/**
 * Fetches all learning outcomes for a given curriculum.
 *
 * @param curriculumId - The ID of the curriculum to fetch learning outcomes for.
 * @param token - The authentication token for the API request.
 * @returns A promise that resolves to the details of the curriculum.
 * @throws Will throw an error if the API request fails.
 */
export const getAllCurriculumDetails = async (
  curriculumId: string
): Promise<CurriculumDetailsType> => {
  try {
    const response = await apiInstance.get(`/get_curriculum_all_details/${curriculumId}`);
    return response.data?.result;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * Adds learning outcomes to an activity.
 *
 * @param id - The ID of the activity to which learning outcomes will be added.
 * @param payload - An object containing the learning outcomes to be added.
 * @param payload.entity_ids - An optional array of entity IDs representing the learning outcomes.
 * @param payload.ai_outcomes - An optional array of AI-generated outcomes.
 * @returns A promise that resolves to the response data from the API.
 * @throws Will throw an error if the API request fails.
 */
export const updateActivityLearningOutcomes = async (
  id: string,
  payload: { entity_ids?: string[]; ai_curriculum_entity?: string[] }
): Promise<any> => {
  try {
    const response = await apiInstance.post(`/activity_entities/${id}`, payload);
    return response?.data;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};
