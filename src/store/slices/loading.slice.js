import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  isModel: false,
  modelTitle: '',
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    SET_IS_LOADING: state => {
      state.isLoading = true;
    },
    SET_IS_LOADING_FINISHED: state => {
      state.isLoading = false;
    },
    SET_IS_PROCESSING: (state, {payload}) => {
      state.isModel = true;
      state.modelTitle = payload || 'Saving';
    },
    SET_IS_PROCESSING_FINISHED: state => {
      state.isModel = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  SET_IS_LOADING,
  SET_IS_LOADING_FINISHED,
  SET_IS_PROCESSING,
  SET_IS_PROCESSING_FINISHED,
} = loadingSlice.actions;

export default loadingSlice.reducer;
