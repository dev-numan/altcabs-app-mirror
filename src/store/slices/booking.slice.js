import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import bookingService from '../../api/BookingService';
import voucherService from '../../api/VoucherService';
import uuid from 'react-native-uuid';
import {ERROR, SUCCESS} from './message.slice';
const initialState = {
  processBookings: {},
  newQuotations: [],
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

      return booking;
    } catch (err) {
      console.log(err);

      return rejectWithValue(err.message);
    }
  },
);
export const SET_BIDDING_QUOTATION = createAsyncThunk(
  'booking/setBiddingQuotation',
  async ({bidId, bookingId}, {dispatch, rejectWithValue}) => {
    try {
      console.log(`bidid: ${bidId}`);
      let {booking} = await bookingService.setBidQuotation(bookingId, bidId);
      console.log(`bookingId: ${booking._id}`);
      dispatch(SUCCESS('Bid Selected Successfully'));
      return booking;
    } catch (err) {
      console.log(err);
      dispatch(ERROR('Unable to Select Bid'));
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

export const APPLY_VOUCHER = createAsyncThunk(
  'booking/applyVoucher',
  async ({bookingId, voucherCode}, {dispatch, rejectWithValue}) => {
    try {
      const response = await voucherService.applyVoucher(bookingId, voucherCode);
      dispatch(SUCCESS(response.message));
      return { bookingId, ...response };
    } catch (error) {
      dispatch(ERROR(error.message || 'Failed to apply voucher'));
      return rejectWithValue(error.message);
    }
  },
);

export const REMOVE_VOUCHER = createAsyncThunk(
  'booking/removeVoucher',
  async (bookingId, {dispatch, rejectWithValue}) => {
    try {
      const response = await voucherService.removeVoucher(bookingId);
      dispatch(SUCCESS(response.message));
      return { bookingId, ...response };
    } catch (error) {
      dispatch(ERROR(error.message || 'Failed to remove voucher'));
      return rejectWithValue(error.message);
    }
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
      state.quotationCreatedFor = action.payload.booking_id;
      state.newQuotations = action.payload.quotations;
    },
  },
  extraReducers: builder => {
    builder.addCase(LOAD_PROCESS_BOOKING.fulfilled, (state, {payload}) => {
      state.processBookings[payload?._id] = payload;
    });
    builder.addCase(SET_BIDDING_QUOTATION.fulfilled, (state, {payload}) => {
      state.processBookings[payload?._id] = payload;
    });
    builder.addCase(LOAD_PROCESS_BOOKING.rejected, (state, {payload}) => {
      console.log('Error', payload);
    });
    builder.addCase(POST_NEW_BOOKING.fulfilled, (state, {payload}) => {
      state.processBookings[payload?._id] = payload;
    });
    builder.addCase(APPLY_VOUCHER.fulfilled, (state, {payload}) => {
      if (state.processBookings[payload.bookingId]) {
        state.processBookings[payload.bookingId].discount = payload.discount;
        state.processBookings[payload.bookingId].priceToCharge = payload.priceToCharge;
      }
    });
    builder.addCase(REMOVE_VOUCHER.fulfilled, (state, {payload}) => {
      if (state.processBookings[payload.bookingId]) {
        state.processBookings[payload.bookingId].discount = 0;
        state.processBookings[payload.bookingId].priceToCharge = payload.priceToCharge;
      }
    });
  },
});

// Action creators are generated for each case reducer function
export const {QUOTATION_CREATED, LOAD_BOOKING} = bookingSlice.actions;

export default bookingSlice.reducer;
