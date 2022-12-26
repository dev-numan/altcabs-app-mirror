import {configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import appReducer from './slices/app.slice';
import introSlice from './slices/introSlice';
export const store = configureStore({
  reducer: {
    app: appReducer,
    Intro: introSlice,
  },
  middleware: [thunk],
});
