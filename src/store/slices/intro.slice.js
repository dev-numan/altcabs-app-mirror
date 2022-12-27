import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import AsyncStorage from '@react-native-async-storage/async-storage';
const initialState = {
  IS_NEWLY_INSTALLED: true,
  message: null,
};

export const GET_APP_NEWLY_INSTALLED = createAsyncThunk(
  'intro/gettingIntro',
  async (data, {rejectWithValue}) => {
    let isNewlyInstalled = await AsyncStorage.getItem('isNewlyInstalled');
    if (!isNewlyInstalled) {
      await AsyncStorage.setItem('isNewlyInstalled', 'YES');
      return rejectWithValue({
        status: true,
        message: 'App is installed First Time',
      });
    } else if (isNewlyInstalled === 'YES') {
      return true;
    } else {
      return false;
    }
  },
);

export const SET_APP_NEWLY_INSTALLED = createAsyncThunk(
  'intro/settingIntro',
  async data => {
    await AsyncStorage.setItem('isNewlyInstalled', data);
    return false;
  },
);

export const introSlice = createSlice({
  name: 'intro',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(GET_APP_NEWLY_INSTALLED.fulfilled, (state, {payload}) => {
      state.IS_NEWLY_INSTALLED = payload;
    });
    builder.addCase(GET_APP_NEWLY_INSTALLED.rejected, (state, {payload}) => {
      state.IS_NEWLY_INSTALLED = payload.status;
      state.message = payload.message;
    });
    builder.addCase(SET_APP_NEWLY_INSTALLED.fulfilled, (state, {payload}) => {
      state.IS_NEWLY_INSTALLED = payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = introSlice.actions;

export default introSlice.reducer;
