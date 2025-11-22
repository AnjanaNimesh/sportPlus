import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../constants/api';
import { League } from '../types';

export interface SportsState {
  leagues: League[];
  favorites: League[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SportsState = {
  leagues: [],
  favorites: [],
  status: 'idle',
  error: null,
};

export const fetchLeagues = createAsyncThunk('sports/fetchLeagues', async () => {
  const res = await fetch(`${API_BASE_URL}all_leagues.php`);
  if (!res.ok) throw new Error('Failed to fetch leagues');
  const json = await res.json();
  const fetchedLeagues: League[] = (json.leagues || []).filter((l: League) => l.idLeague && l.strLeague);
  return fetchedLeagues;
});

export const loadFavorites = createAsyncThunk('sports/loadFavorites', async () => {
  try {
    const favJson = await AsyncStorage.getItem('favoriteLeagues');
    if (favJson) return JSON.parse(favJson) as League[];
    return [] as League[];
  } catch (e) {
    return [] as League[];
  }
});

const sportsSlice = createSlice({
  name: 'sports',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<League>) {
      const league = action.payload;
      const index = state.favorites.findIndex(f => f.idLeague === league.idLeague);
      if (index === -1) {
        state.favorites.push(league);
      } else {
        state.favorites = state.favorites.filter(f => f.idLeague !== league.idLeague);
      }
      try {
        AsyncStorage.setItem('favoriteLeagues', JSON.stringify(state.favorites));
      } catch (e) {
        console.warn('Failed to persist favorites', e);
      }
    },
    setFavorites(state, action: PayloadAction<League[]>) {
      state.favorites = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeagues.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLeagues.fulfilled, (state, action: PayloadAction<League[]>) => {
        state.status = 'succeeded';
        state.leagues = action.payload;
      })
      .addCase(fetchLeagues.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch leagues';
      })
      .addCase(loadFavorites.fulfilled, (state, action: PayloadAction<League[]>) => {
        state.favorites = action.payload || [];
      });
  }
});

export const { toggleFavorite, setFavorites } = sportsSlice.actions;

export default sportsSlice.reducer;
