import { apiInstance } from '../context/Configuration';

export const fetchClassMedia = async (classId, pageNumber) => {
  return await apiInstance
    .get(`/class_media/${classId}`, {
      headers: {
        PageNumber: pageNumber
      }
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchClassAlbums = async (classId) => {
  return await apiInstance
    .get(`/class_album/${classId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchUserMedia = async (classId, data, pageNumber) => {
  return await apiInstance
    .post(`/search_with_face/${classId}`, data, {
      headers: {
        PageNumber: pageNumber
      }
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const createAlbum = async (classId, data) => {
  return await apiInstance
    .post(`/class_album/${classId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateAlbum = async (albumId, data) => {
  return await apiInstance
    .post(`/album_edit/${albumId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchAlbum = async (albumId, pageNumber) => {
  return await apiInstance
    .get(`/album_edit/${albumId}`, {
      headers: {
        PageNumber: pageNumber
      }
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateUserAvatar = async (data) => {
  return await apiInstance
    .post(`/add_new_face/`, data)
    .then((response) => response.data)
    .catch((error) => error?.response);
};

export const deleteMedia = async (mediaId) => {
  return await apiInstance
    .delete(`/class_media_edit/${mediaId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateUnmatchedFace = async (data) => {
  return await apiInstance
    .post(`/add_unmatched_face/`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const sendCloudMediaUrlToServer = async (classId, data) => {
  return await apiInstance
    .post(`/class_media/${classId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchRecognisedFaceForChild = async (childId, pageNumber) => {
  return await apiInstance
    .get(`/search_child_media/${childId}`, {
      headers: {
        PageNumber: pageNumber
      }
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchMediaUploadConstraints = async () => {
  return await apiInstance
    .get(`/fetch_media_upload_constraint/`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const tagUsersInVideoImg = async (mediaId, data) => {
  return await apiInstance
    .post(`/tagged-video-person/${mediaId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const tagMultipleUsersInMedia = async (data) => {
  return await apiInstance
    .post(`/multiple_peoples_tag/`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateMediaPrivacyStatus = async (data) => {
  return await apiInstance
    .post(`/media_privacy_status/`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const deleteAlbum = async (albumId) => {
  return await apiInstance
    .delete(`/album_edit/${albumId}`)
    .then((response) => response.data)
    .catch((error) => error);
};
