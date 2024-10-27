import {configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // or localStorage for web
import appReducer from './slices/app.slice';
import introSlice from './slices/intro.slice';
import loadingSlice from './slices/loading.slice';
import bookingSlice from './slices/booking.slice';
import luggageSlice from './slices/luggage.slice';
import messageSlice from './slices/message.slice';
import authSlice from './slices/auth.slice';
import settingsSlice from './slices/settings.slice';

// Configuration for persisting the auth slice
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage, // You can use localStorage for web
  // No whitelist or blacklist means all fields will be persisted
};

// Wrap authSlice with persistReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);

export const store = configureStore({
  reducer: {
    app: appReducer,
    Intro: introSlice,
    Message: messageSlice,
    Auth: persistedAuthReducer, // Use persisted reducer
    Loading: loadingSlice,
    Luggage: luggageSlice,
    booking: bookingSlice,
    settings: settingsSlice,
  },
  middleware: [thunk],
});

// Create a persistor to persist the store
export const persistor = persistStore(store);
