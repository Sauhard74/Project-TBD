import * as Sentry from '@sentry/react-native';
import { apiInstance } from '../context/Configuration';

export const fetchStudent = async (studentId: string) => {
  const response: any = await apiInstance
    .get(`/student/${studentId}`)
    .catch((error) => Sentry.captureException(error));

  return response?.data?.result as StudentType;
};
