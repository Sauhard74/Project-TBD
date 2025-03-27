import { apiInstance } from '../context/Configuration';
import { captureException } from '@sentry/react-native';

/**
 * @method GET - Fetch all the stories ready for review across all schools.
 * @returns The message from the response.
 */
export const getStoriesForReview = async (): Promise<any> => {
  try {
    const response = await apiInstance.get('/school_review_stories/');
    return response.data?.result?.in_review;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method POST - Fetch all the published stories across all schools.
 * @param payload - All the class ids.
 * @returns The message from the response.
 */
export const getPublishedStories = async (
  classes_ids: string[],
  staff_ids: string[] | undefined
): Promise<any> => {
  try {
    const response = await apiInstance.post('/school_published_stories/', {
      classes_ids,
      staff_ids
    });
    return response.data?.result;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method POST - Fetch all the drafted stories across all schools.
 * @param payload - All the class ids.
 * @returns The message from the response.
 */
export const getDraftedStories = async (
  classes_ids: string[],
  staff_ids: string[] | undefined
): Promise<any> => {
  try {
    const response = await apiInstance.post('/school_drafted_stories/', { classes_ids, staff_ids });
    return response.data?.result;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};
