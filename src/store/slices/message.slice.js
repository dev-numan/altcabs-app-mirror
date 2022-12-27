import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: null,
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    SUCCESS: (state, {payload}) => {
      state.message = payload;
      state.type = 'success';
    },
    ERROR: (state, {payload}) => {
      state.message = payload;
      state.type = 'error';
    },
    INFO: (state, {payload}) => {
      state.message = payload;
      state.type = 'info';
    },
    MESSAGE_NULL: state => {
      state.message = null;
      state.type = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {SUCCESS, ERROR, INFO, MESSAGE_NULL} = messageSlice.actions;

export default messageSlice.reducer;
