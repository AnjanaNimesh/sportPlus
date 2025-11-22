export interface User {
  id: number;
  username: string;
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

