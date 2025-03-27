import { createAsyncThunk } from '@reduxjs/toolkit';
import { startProgress1, stopProgress1 } from '../reducers/Progress';
import {
  fetchAnnouncementNHomeworkById,
  fetchAnnouncementsNHomework,
  fetchBroadcasts
} from '../../apis/AnnouncementNHomework';
import { showToast } from '../reducers/toast';

export const getAnnouncementsList = createAsyncThunk(
  'announcement/getAnnouncementsList',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { announcementList } = state.announcement;
    dispatch(startProgress1());
    try {
      const response = await fetchAnnouncementsNHomework();
      if (response.result) {
        dispatch(stopProgress1());
        return { list: response.result };
      } else {
        dispatch(stopProgress1());
        return { list: announcementList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: announcementList };
    }
  }
);

export const getBroadcastList = createAsyncThunk(
  'announcement/getBroadcastList',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { broadcastList } = state.announcement;
    dispatch(startProgress1());
    try {
      const response = await fetchBroadcasts();
      if (response.result) {
        dispatch(stopProgress1());
        return { list: response.result };
      } else {
        dispatch(stopProgress1());
        return { list: broadcastList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: broadcastList };
    }
  }
);

export const getAnnouncementById = createAsyncThunk(
  'announcement/getAnnouncementById',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { announcement } = state.announcement;
    dispatch(startProgress1());
    try {
      const response = await fetchAnnouncementNHomeworkById(data);
      if (response.result) {
        dispatch(stopProgress1());
        return { list: response.result };
      } else {
        dispatch(stopProgress1());
        return { list: announcement };
      }
    } catch (error) {
      dispatch(stopProgress1());
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: announcement };
    }
  }
);
