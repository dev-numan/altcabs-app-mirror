import {configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import appReducer from './slices/app.slice';
export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: [thunk],
});
