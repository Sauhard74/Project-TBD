import * as Sentry from '@sentry/react';
import { aiRequestHandler } from './Service.config';

export const getTranscription = async (body: AiRequestType) => {
  try {
    // get the transcription
    const response = await aiRequestHandler.post('/http/transcribe', body);

    return response.data;
  } catch (error) {
    Sentry.captureException(error);
  }
};
