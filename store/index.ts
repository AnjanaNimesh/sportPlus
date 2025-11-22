import { configureStore } from '@reduxjs/toolkit';
import sportsReducer from './sportsSlice';

export const store = configureStore({
  reducer: {
    sports: sportsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
