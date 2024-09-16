import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from '../../api';
import jwtdecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ERROR, SUCCESS} from './message.slice';
import {SET_IS_PROCESSING, SET_IS_PROCESSING_FINISHED} from './loading.slice';
import webSocketService from '../../api/WebSocketService';
import {valid} from 'joi';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';

const initialState = {
  IS_LOGGED: false,
  TOKEN: null,
  JWT: '',
  role: '',
  COMPANYID: '',
  TRIPS: null,
  NAME: '',
  EMAIL: '',
};

const USER = createAsyncThunk('auth/user', async (data, {rejectWithValue}) => {
  try {
    // console.log('USERTOKEN', data);
    await AsyncStorage.setItem('Token', data.token);
    API.defaults.headers.common['x-auth-token'] = data.token;
    API.defaults.headers.common['companyId'] = data.companyId;
    return jwtdecode(data.token);
  } catch (err) {
    console.log('Error in setting user');
    console.log(err);
    return rejectWithValue(err);
  }
});

export const USER_LOGIN_STATUS = createAsyncThunk(
  'auth/userLoginStatus',
  async (data, {dispatch, rejectWithValue}) => {
    const token = await AsyncStorage.getItem('Token');
    console.log('saved token', token ? true : false);
    webSocketService.authenticate(token);
    if (token) {
      return jwtdecode(token);
    } else {
      return rejectWithValue('User not Logged in!');
    }
  },
);

export const USER_STATUS_LOG_OUT = createAsyncThunk(
  'auth/userLogoutStatus',
  async () => {
    console.log('Logout info');
    await AsyncStorage.removeItem('Token');

    return true;
  },
);

export const LOGIN = createAsyncThunk(
  'auth/login',
  async (data, {dispatch, rejectWithValue}) => {
    try {
      dispatch(SET_IS_PROCESSING('Authorizing'));
      let response = await API.post('/mobileApp/auth/login', data);
      console.log('user Info', response.data);
      dispatch(SET_USER(response.data));
      console.log(response.data);
      dispatch(SUCCESS(response.data.message));
      dispatch(
        USER({token: response.data.token, companyId: response.data.companyId}),
      );
      dispatch(SET_IS_PROCESSING_FINISHED());
    } catch (err) {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
      let error = ErrorType(err);
      dispatch(ERROR(error));
      dispatch(SET_IS_PROCESSING_FINISHED());
      return rejectWithValue(error);
    }
  },
);
export const GOOGLE_LOGIN = createAsyncThunk(
  'auth/googleLogin',
  async (data, {dispatch, rejectWithValue}) => {
    try {
      dispatch(SET_IS_PROCESSING('Processing'));
      let response = await API.post('/mobileApp/auth/googleLogin', data);
      dispatch(SUCCESS(response.data.message));
      console.log(response.data);
      await dispatch(USER(response.data.token));
      dispatch(SET_IS_PROCESSING_FINISHED());
    } catch (err) {
      let error = ErrorType(err);
      await dispatch(ERROR(error));
      await dispatch(SET_IS_PROCESSING_FINISHED());
      return rejectWithValue(error);
    }
  },
);

export const REGISTRATION = createAsyncThunk(
  'auth/registration',
  async (data, {dispatch, rejectWithValue}) => {
    try {
      dispatch(SET_IS_PROCESSING('Registering'));
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      let response = await API.post('/mobileApp/auth/registration', data);
      dispatch(SUCCESS(response.data.message));
      if (data.is_google) await dispatch(USER(response.data.token));
      dispatch(SET_IS_PROCESSING_FINISHED());
    } catch (err) {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
      let error = ErrorType(err);
      dispatch(ERROR(error));
      dispatch(SET_IS_PROCESSING_FINISHED());
      return rejectWithValue(error);
    }
  },
);
export const RESEND_VERIFICATION_EMAIL = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (data, {dispatch, rejectWithValue}) => {
    try {
      dispatch(SET_IS_PROCESSING('Processing'));
      let response = await API.post(
        '/mobileApp/auth/resendVerificationEmail/' + data,
      );
      dispatch(SUCCESS(response.data.message));
      dispatch(SET_IS_PROCESSING_FINISHED());
    } catch (err) {
      let error = ErrorType(err);
      dispatch(ERROR(error));
      dispatch(SET_IS_PROCESSING_FINISHED());
      return rejectWithValue(error);
    }
  },
);

function ErrorType(err) {
  if (err.response) {
    // console.log('response', err.response.data);
    return err.response?.data?.error || 'Response Error';
  } else if (err.request) {
    console.log('request', err);
    return 'Bad Request';
  } else {
    console.log('other', err);
    return err.message;
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    SET_USER: (state, {payload}) => {
      state.role = payload.role;
      state.JWT = payload.token;
      state.COMPANYID = payload.companyId;
      state.NAME = payload.name;
      state.EMAIL = payload.email;
    },
    CHANGE_ROLE: (state, {payload}) => {
      state.role = payload;
    },
    COMPANY_ID: (state, {payload}) => {
      state.COMPANYID = payload;
    },
    JWTTOKEN: (state, {payload}) => {
      state.JWT = payload;
    },
    TRIPDATA: (state, {payload}) => {
      state.TRIPS = selectSeperatedTrips(payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(USER.fulfilled, (state, {payload}) => {
      state.TOKEN = payload;
      state.IS_LOGGED = true;
    });
    builder.addCase(USER_LOGIN_STATUS.fulfilled, (state, {payload}) => {
      state.TOKEN = payload;
      state.IS_LOGGED = true;
    });
    builder.addCase(USER_LOGIN_STATUS.rejected, (state, {payload}) => {
      state.IS_LOGGED = false;
    });
    builder.addCase(USER_STATUS_LOG_OUT.fulfilled, state => {
      state.IS_LOGGED = false;
    });
  },
});

export const selectSeperatedTrips = state => {
  let trips = state;
  let dataToReturn = {
    all: trips,
    new_requests: trips.filter(t => t.status == 'requested'),
    urgent: trips.filter(t => t.status == 'urgent'),
    completed: trips.filter(t => t.status == 'completed'),
    action_required: trips.filter(
      t =>
        t.status == 'booked' &&
        moment(t.startTime).valueOf() < moment().valueOf(),
    ),
    driver_no_show: trips.filter(
      t => t.status == 'driver-no-show-investigation',
    ),
    customer_no_show: trips.filter(
      t => t.status == 'customer-no-show-investigation',
    ),
    canceled: trips.filter(
      t =>
        t.status == 'canceled' || t.status == 'cancel-by-client-investigation',
    ),
    upcoming: trips.filter(
      t =>
        t.status == 'booked' &&
        moment(t.startTime).valueOf() > moment().valueOf(),
    ),
  };
  return dataToReturn;
};

// Action creators are generated for each case reducer function
export const {CHANGE_ROLE, COMPANY_ID, JWTTOKEN, TRIPDATA, SET_USER} =
  authSlice.actions;

export default authSlice.reducer;
