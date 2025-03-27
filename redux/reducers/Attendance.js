import { createSlice } from '@reduxjs/toolkit';
import {
  getDailyAttendance,
  getWeeklyAttendance,
  getMonthlyAttendance,
  getYearlyAttendance
} from '../actions/Attendance';

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    dailyAttendanceList: [],
    weeklyAttendanceList: [],
    monthlyAttendanceList: [],
    yearlyAttendanceList: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDailyAttendance.fulfilled, (state, action) => {
      state.dailyAttendanceList = action.payload.list;
    });
    builder.addCase(getWeeklyAttendance.fulfilled, (state, action) => {
      state.weeklyAttendanceList = action.payload.list;
    });
    builder.addCase(getMonthlyAttendance.fulfilled, (state, action) => {
      state.monthlyAttendanceList = action.payload.list;
    });
    builder.addCase(getYearlyAttendance.fulfilled, (state, action) => {
      state.yearlyAttendanceList = action.payload.list;
    });
  }
});

export default attendanceSlice.reducer;
