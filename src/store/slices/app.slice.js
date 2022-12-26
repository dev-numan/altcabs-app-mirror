import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoadingComplete: false,
  app: 'customer',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    loadClientApp: state => {
      state.isLoadingComplete = true;
      state.app = 'customer';
    },
  },
});

// Action creators are generated for each case reducer function
export const {loadClientApp} = appSlice.actions;

export default appSlice.reducer;
