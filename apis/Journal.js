import { apiInstance } from '../context/Configuration';

export const fetchJournals = async (classId, pageNumber) => {
  return await apiInstance
    .get(`/fetch_journal_post/${classId}`, {
      headers: {
        PageNumber: pageNumber
      }
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const createJournal = async (data) => {
  return await apiInstance
    .post(`/create_journal_post/`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchJournalLikes = async (journalId) => {
  return await apiInstance
    .get(`/all_liked_user/${journalId}`)
    .then((response) => response.data?.result)
    .catch((error) => error);
};

export const fetchJournalComments = async (journalId) => {
  return await apiInstance
    .get(`/all_commented_user/${journalId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateJournal = async (data) => {
  return await apiInstance
    .post(`/update_journal_post/${data.journalId}`, data.values)
    .then((response) => response.data?.result)
    .catch((error) => error);
};

export const deleteJournal = async (journalId) => {
  return await apiInstance
    .delete(`/update_journal_post/${journalId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchJournalPostCount = async (classId) => {
  return await apiInstance
    .get(`/student_post_statistics/${classId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchStudentTaggedPosts = async (classId, data, pageNumber) => {
  return await apiInstance
    .post(`/fetch_student_tagged_posts/${classId}`, data, {
      headers: {
        PageNumber: pageNumber
      }
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const createJournalFromMedia = async (classId, data) => {
  return await apiInstance
    .post(`/create_post_with_media/${classId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};
