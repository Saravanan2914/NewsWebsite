import { createSlice } from '@reduxjs/toolkit';
import { MOCK_NEWS } from '../utils/dummyData';

const initialState = {
  items: MOCK_NEWS,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNews: (state, action) => {
      state.items = action.payload;
    },
    addNews: (state, action) => {
      state.items.unshift(action.payload);
    }
  }
});

export const { setNews, addNews } = newsSlice.actions;
export default newsSlice.reducer;
