import { createSlice } from '@reduxjs/toolkit';
import { getStaffClasses, getStaffList } from '../actions/Staff';

const classesSlice = createSlice({
  name: 'staff',
  initialState: {
    staffClassesList: [],
    staffList: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStaffClasses.fulfilled, (state, action) => {
      state.staffClassesList = action.payload.list;
    });
    builder.addCase(getStaffList.fulfilled, (state, action) => {
      state.staffList = action.payload.list;
    });
  }
});

export default classesSlice.reducer;
