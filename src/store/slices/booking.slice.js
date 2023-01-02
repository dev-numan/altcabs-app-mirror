import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import bookingService from '../../api/BookingService';

const initialState = {
  processBookings: {},
};
export const LOAD_PROCESS_BOOKING = createAsyncThunk(
  'booking/loadProcessBooking',
  async (bookingId, {dispatch, rejectWithValue}) => {
    try {
      console.log('bookingId');
      console.log(bookingId);
      let booking = await bookingService.getById(bookingId);
      return booking;
    } catch (err) {
      console.log(err);

      return rejectWithValue(err.message);
    }
  },
);

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(LOAD_PROCESS_BOOKING.fulfilled, (state, {payload}) => {
      state.processBookings[payload._id] = payload;
    });
    builder.addCase(LOAD_PROCESS_BOOKING.rejected, (state, {payload}) => {
      console.log('Error', payload);
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = bookingSlice.actions;

export default bookingSlice.reducer;
