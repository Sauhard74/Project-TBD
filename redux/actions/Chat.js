import { createAsyncThunk } from '@reduxjs/toolkit';
import { startProgress1, stopProgress1 } from '../reducers/Progress';
import { showToast } from '../reducers/toast';
import { fetchCoworkers, fetchFamilies, fetchGroups } from '../../apis/Chat';
import * as Sentry from '@sentry/react-native';

export const getCoworkersList = createAsyncThunk(
  'chat/getCoworkersList',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { coWorkersList } = state.chat;
    dispatch(startProgress1());
    try {
      const response = await fetchCoworkers(data);
      if (response.result) {
        dispatch(stopProgress1());
        return { list: response.result };
      } else {
        dispatch(stopProgress1());
        return { list: coWorkersList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      Sentry.captureException(error);
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: coWorkersList };
    }
  }
);

export const getFamiliesList = createAsyncThunk(
  'chat/getFamiliesList',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { familiesList } = state.chat;
    dispatch(startProgress1());
    try {
      const response = await fetchFamilies(data);
      if (response.result) {
        dispatch(stopProgress1());
        return { list: response.result };
      } else {
        dispatch(stopProgress1());
        return { list: familiesList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      Sentry.captureException(error);
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: familiesList };
    }
  }
);

export const getGroupsList = createAsyncThunk(
  'chat/getGroupsList',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { groupsList } = state.chat;
    dispatch(startProgress1());
    try {
      const response = await fetchGroups(data);
      if (response.result) {
        dispatch(stopProgress1());
        return { list: response.result };
      } else {
        dispatch(stopProgress1());
        return { list: groupsList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      Sentry.captureException(error);
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: groupsList };
    }
  }
);
