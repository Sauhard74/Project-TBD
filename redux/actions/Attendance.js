import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchDailyAttendance,
  fetchMonthlyAttendance,
  fetchWeeklyAttendance,
  fetchYearlyAttendance
} from '../../apis/Attendance';
import { startProgress1, stopProgress1 } from '../reducers/Progress';
import { showToast } from '../reducers/toast';

export const getDailyAttendance = createAsyncThunk(
  'attendance/getDailyAttendance',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { dailyAttendanceList } = state.attendance;
    dispatch(startProgress1());
    try {
      const response = await fetchDailyAttendance(data);
      if (response.result) {
        dispatch(stopProgress1());
        return { list: response.result };
      } else {
        dispatch(stopProgress1());
        return { list: dailyAttendanceList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: dailyAttendanceList };
    }
  }
);

export const getWeeklyAttendance = createAsyncThunk(
  'attendance/getWeeklyAttendance',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { weeklyAttendanceList } = state.attendance;
    dispatch(startProgress1());
    try {
      const response = await fetchWeeklyAttendance(data);
      if (response.result) {
        dispatch(stopProgress1());
        return { list: response.result };
      } else {
        dispatch(stopProgress1());
        return { list: weeklyAttendanceList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: weeklyAttendanceList };
    }
  }
);

export const getMonthlyAttendance = createAsyncThunk(
  'attendance/getMonthlyAttendance',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { monthlyAttendanceList } = state.attendance;
    dispatch(startProgress1());
    try {
      const response = await fetchMonthlyAttendance(data);
      if (response.result) {
        dispatch(stopProgress1());
        return { list: response.result };
      } else {
        dispatch(stopProgress1());
        return { list: monthlyAttendanceList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: monthlyAttendanceList };
    }
  }
);

export const getYearlyAttendance = createAsyncThunk(
  'attendance/getYearlyAttendance',
  async (data, { dispatch, getState }) => {
    const state = getState();
    const { yearlyAttendanceList } = state.attendance;
    dispatch(startProgress1());
    try {
      const response = await fetchYearlyAttendance(data);
      if (response.result) {
        dispatch(stopProgress1());
        return { list: response.result };
      } else {
        dispatch(stopProgress1());
        return { list: yearlyAttendanceList };
      }
    } catch (error) {
      dispatch(stopProgress1());
      error.message && dispatch(showToast({ text: error.message, type: 'error' }));
      return { list: yearlyAttendanceList };
    }
  }
);
