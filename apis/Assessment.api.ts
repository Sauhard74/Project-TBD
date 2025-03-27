import { captureException } from '@sentry/react-native';
import { apiInstance } from '../context/Configuration';

/**
 * Upload Students work
 * @param id - evaluation id
 * @param body - {media_name,media_link,media_size}
 * @returns status of request
 */
export const uploadStudentWork = async (
  id: string,
  body: {
    media_link: string;
    media_name: string;
    media_size: string;
    media_type: string;
  }
): Promise<any> => {
  try {
    const response = await apiInstance.post(`/evaluation_media/${id}`, body);
    return response.data;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * Update Students Evaluation
 * @param id - evaluation id
 * @param body - selected_options: [] || evaluation_stage: stage || comments
 * @returns status of request
 */
export const updateEvaluation = async (
  id: string,
  body: {
    evaluation_stage?: string;
    caption?: string;
    privacy_level?: string;
    selected_options?: number[];
    comments?: string;
  }
): Promise<any> => {
  try {
    const response = await apiInstance.post(`/evaluation/${id}`, body);
    return response.data;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * Delete Students work
 * @param id - evaluation id
 * @param body - {media_url}
 * @returns status of request
 */
export const deleteStudentWork = async (id: string, body: Object): Promise<any> => {
  try {
    const response = await apiInstance.delete(`/evaluation_media/${id}`, {
      data: body
    });
    return response.data;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method POST - get activity evalution of specific period
 * @param id - activity id
 * @param body - {period_id}
 * @returns status of request
 */
export const getActivityEvaluation = async (id: string, body: { period_id: string | null }) => {
  try {
    const response = await apiInstance.post(`/activity_evaluation_version2/${id}`, body);
    return response?.data as { evaluations: EvaluationType[]; state: string | null | undefined };
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method POST - get activity evalution of unscheduled assessments
 * @param id - assessment id
 */
export const getUnscheduledActivityEvaluation = async (id: string) => {
  try {
    const response = await apiInstance.get(`/assessment_evaluation/${id}`);
    return response?.data as { evaluations: EvaluationType[]; state: string | null | undefined };
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method POST - get evaluation insights of specific assessment
 * @param id - assessment id
 * @returns status of request
 */
export const getEvaluationInsights = async (id: string) => {
  try {
    const response = await apiInstance.get(`/assessment_level_insights/${id}`);
    return response?.data?.result as EvaluationInsightsType[];
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method GET - get details of assessment rubric
 * @param id - assessment id
 * @returns status of request
 */
export const getAssessmentRubricDetails = async (id: string) => {
  try {
    const response = await apiInstance.get(`/activity_assessment/${id}`);
    return response?.data?.assessment?.at(0) as StudentAssessmentType;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method GET - get unscheduled activities of class
 * @param id - class id
 * @param page - page no.
 * @returns status of request
 */
export const getUnscheduledActivities = async (id: string, page?: number) => {
  try {
    const response = await apiInstance.get(`/class_unschedule_activity/${id}`, {
      headers: {
        PageNumber: page || null
      }
    });
    return response?.data?.result as { _id: string | null; activities: AssessmentActivityType[] }[];
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method POST - get Todo, upcoming, journaled, done activities of class
 * @param id - class id
 * @param status - TODO, UPCOMING, JOURNALED, DONE
 * @param page - page no.
 * @returns status of request
 */
export const getScheduledActivities = async (
  id: string,
  status: 'TODO' | 'UPCOMING' | 'JOURNALED' | 'DONE',
  page?: number
) => {
  try {
    const response = await apiInstance.post(
      `/class_schedule_activity/${id}`,
      {
        status
      },
      {
        headers: {
          PageNumber: page || null
        }
      }
    );
    return response?.data?.result as { _id: string | null; activities: AssessmentActivityType[] }[];
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method POST - gets filtered assessment by title
 * @param id - class id
 * @param title - search keyword
 * @param date - filter date
 * @param status - TODO, UPCOMING, JOURNALED, DONE, UNSCHEDULED
 * @param page - page no.
 */
export const filterAssessment = async (
  id: string,
  title: string | undefined,
  date: string | undefined,
  status: 'TODO' | 'UPCOMING' | 'JOURNALED' | 'DONE' | 'UNSCHEDULED',

  page?: number
) => {
  try {
    const response = await apiInstance.post(
      `/search_activities_by_name/${id}`,
      {
        title: title || null,
        status,
        date: status === 'UNSCHEDULED' ? null : date || null,
        search_activity_date: status === 'UNSCHEDULED' ? false : date ? true : false
      },
      {
        headers: {
          PageNumber: page || null
        }
      }
    );
    return response?.data?.result as { _id: string | null; activities: AssessmentActivityType[] }[];
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method POST adds media to activity
 * @param body - {media_ids:[],activity_id,period_id:[]}
 * @param id - class id
 */
export const addMediaToActivity = async (body: Object, id: string): Promise<any> => {
  try {
    const response = await apiInstance.post(`/media_add_in_activity/${id}`, body);
    return response.data;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};
