import {configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import appReducer from './slices/app.slice';
import introSlice from './slices/intro.slice';
import loadingSlice from './slices/loading.slice';
import luggageSlice from './slices/luggage.slice';
import messageSlice from './slices/message.slice';
import authSlice from './slices/auth.slice';
export const store = configureStore({
  reducer: {
    app: appReducer,
    Intro: introSlice,
    Message: messageSlice,
    Auth: authSlice,
    Loading: loadingSlice,
    Luggage: luggageSlice,
  },
  middleware: [thunk],
});
