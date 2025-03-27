import { createSlice } from '@reduxjs/toolkit';

const data = {
  state: null,
  options: {
    progress: 0,
    displayText: 'Upload in progress...',
    total: 0
  }
};

const uploadProgressBarSlice = createSlice({
  name: 'uploadProgressBar',
  initialState: data,
  reducers: {
    showProgressBar: (state, action) => {
      state.state = true;
      state.options = {
        ...data.options,
        ...action.payload
      };
    },
    hideProgressBar: (state) => {
      state.state = null;
      state.options = {
        progress: 0
      };
    }
  }
});

export const { showProgressBar, hideProgressBar } = uploadProgressBarSlice.actions;

export default uploadProgressBarSlice.reducer;
