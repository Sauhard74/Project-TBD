import { apiInstance } from '../context/Configuration';
import * as Sentry from '@sentry/react-native';

export const fetchStories = async (
  classId: string,
  pageNumber: number,
  storyStage: 'published' | 'draft' | 'review'
) => {
  return await apiInstance
    .get(`/fetch_class_story/${classId}`, {
      headers: {
        PageNumber: pageNumber,
        StoryStage: storyStage || 'all'
      }
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const deleteStory = async (storyId: string) => {
  return await apiInstance
    .delete(`/user_story/${storyId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const createStory = async (data: any) => {
  return await apiInstance
    .post(`/create_user_story/`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchStoryById = async (storyId: string) => {
  return await apiInstance
    .get(`/user_story/${storyId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateStory = async (storyId: string, data: any) => {
  return await apiInstance
    .post(`/user_story/${storyId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateStoryComments = async (storyId: string, data: any) => {
  return await apiInstance
    .post(`/user_story_comment/${storyId}`, data)
    .then((response) => response.data?.result)
    .catch((error) => error);
};

export const fetchSchoolTags = async () => {
  return await apiInstance
    .get(`/school_tag_story/`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const fetchStoryLikes = async (storyId: string) => {
  return await apiInstance
    .get(`/all_liked_user_story/${storyId}`)
    .then((response) => response?.data?.result)
    .catch((error) => error);
};

export const updateStoryLike = async (storyId: string, data: any) => {
  return await apiInstance
    .post(`/post_user_story_like/${storyId}`, data)
    .then((response) => response.data)
    .catch((error) => error);
};

export const searchStories = async (
  classId: string,
  pageNumber: number,
  data: {
    search_query?: string | null;
    story_tag_ids?: string[];
    staff_ids?: string[];
    student_ids?: string[];
    story_stage?: 'published' | 'draft' | 'review';
  }
) => {
  return await apiInstance
    .post(`/search_story_by_name/${classId}`, data, {
      headers: {
        PageNumber: pageNumber
      }
    })
    .then((response) => response.data)
    .catch((error) => {
      Sentry.captureException(error);
      return error;
    });
};

export const modifyStoryComment = async (commentId: string, comment: string) => {
  return await apiInstance
    .post(`/update_post_comment/${commentId}`, { comment })
    .then((response) => response?.data?.result)
    .catch((error) => {
      Sentry.captureException(error);
      return error;
    });
};

export const deleteStoryComment = async (commentId: string) => {
  return await apiInstance
    .delete(`/delete_comment/${commentId}`)
    .then((response) => response?.data?.result)
    .catch((error) => {
      Sentry.captureException(error);
      return error;
    });
};
