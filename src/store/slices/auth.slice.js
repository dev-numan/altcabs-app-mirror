import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from '../../api';
import jwtdecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ERROR, SUCCESS} from './message.slice';
import {SET_IS_PROCESSING, SET_IS_PROCESSING_FINISHED} from './loading.slice';
const initialState = {
  IS_LOGGED: false,
  TOKEN: null,
};

const USER = createAsyncThunk('auth/user', async (data, {rejectWithValue}) => {
  try {
    await AsyncStorage.setItem('Token', data);
    API.defaults.headers.common['x-auth-token'] = data;
    return jwtdecode(data);
  } catch (err) {
    console.log(err);
    return rejectWithValue(err);
  }
});

export const USER_LOGIN_STATUS = createAsyncThunk(
  'auth/userLoginStatus',
  async (data, {dispatch, rejectWithValue}) => {
    const token = await AsyncStorage.getItem('Token');
    console.log('saved token', token ? true : false);
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
      let response = await API.post('/mobileApp/auth/registration', data);
      dispatch(SUCCESS(response.data.message));
      if (data.is_google) await dispatch(USER(response.data.token));
      dispatch(SET_IS_PROCESSING_FINISHED());
    } catch (err) {
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
  reducers: {},
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

// Action creators are generated for each case reducer function
export const {} = authSlice.actions;

export default authSlice.reducer;
