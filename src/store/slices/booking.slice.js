import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import bookingService from '../../api/BookingService';
import uuid from 'react-native-uuid';
const initialState = {
  processBookings: {},
  quotationCreated: '', //a uuid will be placed here it will inform the quotations component to update itself.
  quotationCreatedFor: '', //web socket will also inform about the booking Id for which the quotation has been created
};
export const POST_NEW_BOOKING = createAsyncThunk(
  'booking/newBooking',
  async (booking, {dispatch, rejectWithValue}) => {
    return booking;
  },
);
export const LOAD_PROCESS_BOOKING = createAsyncThunk(
  'booking/loadProcessBooking',
  async (bookingId, {dispatch, rejectWithValue}) => {
    try {
      let booking = await bookingService.getById(bookingId);
      console.log('Herrrrrreeee', booking);
      return booking;
    } catch (err) {
      console.log(err);

      return rejectWithValue(err.message);
    }
  },
);
export const ADD_BOOKING_DETAILS = createAsyncThunk(
  'booking/addBookingDetails',
  async (data, {dispatch, rejectWithValue}) => {
    console.log(data);
  },
);
export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    LOAD_BOOKING: (state, {payload}) => {
      state.processBookings[payload?._id] = payload;
    },
    QUOTATION_CREATED: (state, action) => {
      state.quotationCreated = uuid.v4();
      // state.quotationCreated = Math.random() * 50000;
      state.quotationCreatedFor = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(LOAD_PROCESS_BOOKING.fulfilled, (state, {payload}) => {
      state.processBookings[payload?._id] = payload;
    });
    builder.addCase(LOAD_PROCESS_BOOKING.rejected, (state, {payload}) => {
      console.log('Error', payload);
    });
    builder.addCase(POST_NEW_BOOKING.fulfilled, (state, {payload}) => {
      state.processBookings[payload?._id] = payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {QUOTATION_CREATED, LOAD_BOOKING} = bookingSlice.actions;

export default bookingSlice.reducer;
