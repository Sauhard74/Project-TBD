import { captureException } from '@sentry/react-native';
import { aiRequestHandler } from './Service.config';

/**
 * @method POST a prompt.
 * @param data The prompt to be sent.
 */
export const getDebriefOfAssessment = async (data: AiRequestType) => {
  try {
    const response = await aiRequestHandler.post(`/http/debrief_a_assessment`, data);
    return response.data;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method POST a prompt.
 * @param data The prompt to be sent.
 * @returns The regenerated result from the response.
 */
export const createUnitsVC = async (data: AiRequestType) => {
  try {
    const response = await aiRequestHandler.post(`/http/unit_voice_control`, data);
    return response.data;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method POST a prompt.
 * @param data The prompt to be sent.
 * @returns The regenerated result from the response.
 */
export const createAnnouncementsVC = async (data: AiRequestType) => {
  try {
    const response = await aiRequestHandler.post(`/http/announcement_voice_control`, data);
    return response.data;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};

/**
 * @method POST a prompt.
 * @param data The prompt to be sent.
 * @returns The regenerated result from the response.
 */
export const createActvitiesVC = async (data: AiRequestType) => {
  try {
    const response = await aiRequestHandler.post(`/http/activity_voice_control`, data);
    return response.data;
  } catch (error: any) {
    captureException(error);
    throw error;
  }
};
