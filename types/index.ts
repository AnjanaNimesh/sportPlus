export interface User {
  id: number;
  username: string;
}

export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string | null;
}

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string;
  strAlternate?: string;
  intFormedYear?: string;
  strSport?: string;
  strLeague?: string;
  idLeague?: string;
  strStadium?: string;
  strStadiumThumb?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  strWebsite?: string;
  strDescriptionEN?: string;
  strTeamBadge?: string;
  strTeamJersey?: string;
  strTeamLogo?: string;
  strTeamFanart1?: string;
  strTeamBanner?: string;
}

export interface Colors {
  background: string;
  card: string;
  text: string;
  primary: string;
  secondary: string;
  border: string;
  placeholder: string;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: Colors;
}

export type ScreenName = 'Login' | 'Register' | 'App' | 'Details';
export type TabName = 'Home' | 'Favorites' | 'Profile';

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (username: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface SportsState {
  leagues: League[];
  favorites: League[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  fetchLeagues: () => Promise<void>;
  toggleFavorite: (league: League) => void;
}