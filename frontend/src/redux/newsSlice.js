import { createSlice } from '@reduxjs/toolkit';
import { MOCK_NEWS } from '../utils/dummyData';

const defaultBreakingNews = [];

const persistedBreakingNews = localStorage.getItem('breakingNews');
const initialBreakingNews = persistedBreakingNews ? JSON.parse(persistedBreakingNews) : defaultBreakingNews;

const initialState = {
  items: MOCK_NEWS,
  breakingNews: initialBreakingNews,
  searchQuery: '',
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNews: (state, action) => {
      state.items = action.payload.map(item => ({
        ...item,
        id: item._id || item.id
      }));
    },
    addNews: (state, action) => {
      const newItem = {
        ...action.payload,
        id: action.payload._id || action.payload.id
      };
      state.items.unshift(newItem);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    updateBreakingNews: (state, action) => {
      state.breakingNews = action.payload;
      localStorage.setItem('breakingNews', JSON.stringify(action.payload));
    },
    addBreakingNewsItem: (state, action) => {
      state.breakingNews.push(action.payload);
      localStorage.setItem('breakingNews', JSON.stringify(state.breakingNews));
    },
    deleteBreakingNewsItem: (state, action) => {
      state.breakingNews = state.breakingNews.filter(item => item.id !== action.payload);
      localStorage.setItem('breakingNews', JSON.stringify(state.breakingNews));
    },
    deleteNews: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleBreaking: (state, action) => {
      const article = state.items.find(item => item.id === action.payload);
      if (article) {
        article.isBreaking = !article.isBreaking;
      }
    },
    toggleTrending: (state, action) => {
      const article = state.items.find(item => item.id === action.payload);
      if (article) {
        article.isTrending = !article.isTrending;
      }
    }
  }
});

export const { setNews, addNews, setSearchQuery, updateBreakingNews, addBreakingNewsItem, deleteBreakingNewsItem, deleteNews, toggleBreaking, toggleTrending } = newsSlice.actions;
export default newsSlice.reducer;
