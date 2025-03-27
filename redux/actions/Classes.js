import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchClasses } from '../../apis/Classes';
import { startProgress1, stopProgress1 } from '../reducers/Progress';
import { showToast } from '../reducers/toast';

export const getClasses = createAsyncThunk(
  'classes/getClasses',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { classesList } = state.classes;
    dispatch(startProgress1());
    try {
      const response = await fetchClasses();
      if (response.my_class) {
        dispatch(stopProgress1());
        return { list: response.my_class };
      } else {
        dispatch(stopProgress1());
        return { list: classesList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: classesList };
    }
  }
);
