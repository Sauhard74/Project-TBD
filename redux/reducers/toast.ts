import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the types for the state and options
interface ToastOptions {
  text: string;
  type: 'error' | 'success' | 'info' | null;
  show: boolean;
}

interface ToastState {
  state: boolean | null;
  options: ToastOptions;
}

// Initial state with type annotations
const initialState: ToastState = {
  state: null,
  options: {
    text: '',
    type: null,
    show: false
  }
};

// Create the slice with type annotations
const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<Partial<ToastOptions>>) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        ...action.payload
      };
    },
    hideToast: (state) => {
      state.state = null;
      state.options = {
        text: '',
        type: null,
        show: false
      };
    }
  }
});

// Export the actions and reducer
export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
