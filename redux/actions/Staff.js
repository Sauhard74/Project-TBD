import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStaffClasses, fetchStaffList } from '../../apis/Staff';
import { startProgress1, stopProgress1 } from '../reducers/Progress';
import { showToast } from '../reducers/toast';

export const getStaffClasses = createAsyncThunk(
  'staff/getStaffClasses',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { staffClassesList } = state.staff;
    dispatch(startProgress1());
    try {
      const response = await fetchStaffClasses();
      if (response.my_class) {
        dispatch(stopProgress1());
        return { list: response.my_class };
      } else {
        dispatch(stopProgress1());
        return { list: staffClassesList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: staffClassesList };
    }
  }
);

export const getStaffList = createAsyncThunk(
  'staff/getStaffList',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { staffList } = state.staff;
    dispatch(startProgress1());
    try {
      const response = await fetchStaffList();
      if (response) {
        dispatch(stopProgress1());
        return { list: response };
      } else {
        dispatch(stopProgress1());
        return { list: staffList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: staffList };
    }
  }
);
