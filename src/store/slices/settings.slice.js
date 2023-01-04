import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from '../../api';

import {ERROR} from './message.slice';
const initialState = {
  luggage_types: [],
  rating_types: [],
  fleet_types: [],
  addons: [],
  loaded: false,
};

export const GET_ALL_SETTINGS = createAsyncThunk(
  'setting/getAllSettings',
  async (d, {dispatch, rejectWithValue}) => {
    try {
      console.log('Hitting settings route');
      let response = await API.get('/mobileApp/startupdataroutes/all');
      return response.data;
    } catch (err) {
      console.log(err);
      dispatch(ERROR(err.message));
      return rejectWithValue(err.message);
    }
  },
);

export const luggageSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(GET_ALL_SETTINGS.fulfilled, (state, {payload}) => {
      state.addons = payload.addons;
      state.luggage_types = payload.luggage_types;
      state.rating_types = payload.rating_types;
      state.fleet_types = payload.fleet_types;
      state.loaded = false;
    });
    builder.addCase(GET_ALL_SETTINGS.rejected, (state, {payload}) => {
      console.log('Error', payload);
    });
  },
});

// Action creators are generated for each case reducer function
const {} = luggageSlice.actions;

export default luggageSlice.reducer;
