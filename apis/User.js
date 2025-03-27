import { apiInstance } from '../context/Configuration';
import axios from 'axios';
import { env } from '../../environment';
import { captureException } from '@sentry/react-native';
import logErrorToSentry from '../utilities/sentryUtils';

const { endpoint } = env;

export const fetchUserDetails = async () => {
  return apiInstance
    .get('/logined_user_details')
    .then((response) => response.data?.result)
    .catch((error) => error);
};

export const fetchUserDetailsV2 = async (userKeyforBody, token) => {
  return await axios({
    method: 'post',
    url: endpoint + `/logined_user_details_v2/`,
    data: { [userKeyforBody]: token },
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.data?.result)
    .catch((error) => error);
};

export const generateSignedUrl = async (data) => {
  return await apiInstance
    .post(`/generate_signed_url/`, data)
    .then((response) => response.data)
    .catch((err) => {
      throw err;
    });
};

export const generateMultipleSignedUrls = async (data) => {
  return await apiInstance
    .post(`/bulk_upload_signed_urls/`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const fetchMediaUsageLimit = async () => {
  return await apiInstance
    .get(`/school_media_usage/`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const deleteUserAccount = async () => {
  return await apiInstance
    .delete(`/delete_user_profile/`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchUserCurrentAppVersion = async () => {
  return await axios({
    method: 'get',
    url: endpoint + `/fetch_app_version/`
  })
    .then((response) => response.data)
    .catch((error) => error?.response);
};

export const updateDeviceFcmToken = async (data) => {
  return await apiInstance
    .post(`/update_user_fcm_token/`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const generateMultipartUploadUrl = async (data) => {
  return await apiInstance
    .post(`/multipart_resumable_upload/`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const getUserPermissions = async () => {
  try {
    const response = await apiInstance.get(`/user/api-permissions/`);
    return response.data?.result;
  } catch (error) {
    captureException(error);
    throw error;
  }
};
