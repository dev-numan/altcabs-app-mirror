import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from '../../api';

import {ERROR} from './message.slice';
const initialState = {
  luggage: [],
};

export const GET_ALL_LUGGAGE = createAsyncThunk(
  'luggage/getAllLuggage',
  async (d, {dispatch, rejectWithValue}) => {
    try {
      let response = await API.get('/mobileApp/luggage/all');
      return response.data;
    } catch (err) {
      console.log(err);
      dispatch(ERROR(err.message));
      return rejectWithValue(err.message);
    }
  },
);

export const luggageSlice = createSlice({
  name: 'luggage',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(GET_ALL_LUGGAGE.fulfilled, (state, {payload}) => {
      state.luggage = payload;
    });
    builder.addCase(GET_ALL_LUGGAGE.rejected, (state, {payload}) => {
      console.log('Error', payload);
    });
  },
});

// Action creators are generated for each case reducer function
const {} = luggageSlice.actions;

export default luggageSlice.reducer;
