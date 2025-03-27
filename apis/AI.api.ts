import { captureException } from '@sentry/react-native';
import { apiInstance } from '../context/Configuration';

/**
 * Get AI config for a class
 *
 * @param classId - Class ID
 * @returns AI config
 */
export const getAIConfigForClass = async (classId: string) => {
  try {
    const response = await apiInstance.get(`fetch_class_all_ai_blocks/${classId}`);
    return response.data?.result;
  } catch (error) {
    captureException(error);
    throw error;
  }
  
};
