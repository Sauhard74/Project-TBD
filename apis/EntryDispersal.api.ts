import { captureException } from '@sentry/react-native';
import { apiInstance } from '../context/Configuration';

export type ApproveEDPayloadType = {
  action: 'entry' | 'dispersal';
  time: string;
} & ({ parent_id: string } | { escort_id: string });

/**
 * Checks wether Entry Dispersal is enabled or not for the current user.
 * @returns A promise that resolves to a boolean indicating whether the permission is enabled or not.
 */
export const checkEDPermission = async () => {
  const response: any = await apiInstance
    .get(`/entry_dispersal_enabled/`)
    .catch((error) => captureException(error));

  return response?.data?.result as boolean;
};

/**
 * Fetches the secret hash for a given date.
 * @param date - The date in YYYY-MM-DD format.
 * @returns The secret hash as a string.
 */
export const fetchSecretHash = async (date: string) => {
  const response: any = await apiInstance
    .post(`/generate_date_hash/`, { date })
    .catch((error) => captureException(error));

  return response?.data?.result as string;
};

/**
 * Sends a one-time verification code to the specified mobile number.
 * @param mobileNumber - The mobile number to send the verification code to.
 * @returns A Promise that resolves to the verification code as a string.
 */
export const sendOneTimeVerificationCode = async (mobileNumber: string) => {
  const response: any = await apiInstance
    .post(`/send_verification_code/`, { phone_number: mobileNumber })
    .catch((error) => captureException(error));

  return response?.data?.result as string;
};

/**
 * Verifies the one-time verification code for the specified mobile number.
 * @param mobileNumber - The mobile number to verify the code for.
 * @param verificationCode - The verification code to verify.
 * @returns A Promise that resolves to a boolean indicating whether the verification code is valid.
 */
export const verifyOneTimeVerificationCode = async (
  mobileNumber: string,
  verificationCode: string
) => {
  const response: any = await apiInstance
    .post(`/phone_verification_check/`, {
      phone_number: mobileNumber,
      otp: verificationCode
    })
    .catch((error) => captureException(error));

  return response?.data?.result as boolean;
};

/**
 * Approves a child's entry.
 *
 * @param studentId - The ID of the student.
 * @param payload - The payload containing the entry time and optional parent and escort IDs.
 * @returns The result of the approval.
 */
export const approveChildEntry = async (
  studentId: string,
  payload: {
    entry_time?: string;
    parent_id?: string;
    escort_id?: string;
  }
) => {
  const response: any = await apiInstance
    .post(`/log_student_entry/${studentId}`, payload)
    .catch((error) => captureException(error));

  return response?.data;
};

/**
 * Approves child dispersal.
 *
 * @param studentId - The ID of the student.
 * @param payload - The payload containing dispersal time, parent ID, and escort ID.
 * @returns The response data.
 */
export const approveChildDispersal = async (
  studentId: string,
  payload: {
    dispersal_time?: string;
    parent_id?: string;
    escort_id?: string;
  }
) => {
  const response: any = await apiInstance
    .post(`/log_student_dispersal/${studentId}`, payload)
    .catch((error) => captureException(error));

  return response?.data;
};

/**
 * Approves child's entry or dispersal.
 *
 * @param studentId - The ID of the student.
 * @param payload - The payload containing action, time, parent ID, and escort ID.
 * @returns The response data.
 */
export const approveChildED = async (studentId: string, payload: ApproveEDPayloadType) => {
  const response: any = await apiInstance
    .post(`/student_check_in_out/${studentId}`, payload)
    .catch((error) => captureException(error));

  return response?.data;
};

/**
 * Fetches the students' entry/dispersal status for a given date.
 *
 * @param classId - The ID of the class.
 * @param filter_date - The date in YYYY-MM-DD format.
 * @returns The entry dispersal status.
 */
export const fetchEDStatus = async (classId: string, filter_date: string) => {
  const response: any = await apiInstance
    .post(`/entry_dispersal_by_date/${classId}`, { filter_date })
    .catch((error) => captureException(error));

  return response?.data?.result;
};
