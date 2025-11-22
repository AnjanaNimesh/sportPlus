import AsyncStorage from '@react-native-async-storage/async-storage'; // Assuming this module is installed
import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { darkColors, lightColors } from '../constants/colors';
import store, { AppDispatch, RootState } from '../store';
import { fetchLeagues, loadFavorites, toggleFavorite as toggleFavoriteAction } from '../store/sportsSlice';
import {
    AuthState,
    League,
    ScreenName,
    SportsState,
    ThemeContextType,
    User
} from '../types';

// --- Context Definitions ---
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const AuthContext = createContext<AuthState | undefined>(undefined);
export const SportsContext = createContext<SportsState | undefined>(undefined);

// --- Context Hooks ---
export const useTheme = () => useContext(ThemeContext)!;
export const useAuth = () => useContext(AuthContext)!;
export const useSports = () => useContext(SportsContext)!;

// --- App Providers Component ---
interface AppProvidersProps {
    children: React.ReactNode;
    setAppScreen: React.Dispatch<React.SetStateAction<ScreenName>>;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children, setAppScreen }) => {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState<'light' | 'dark'>(systemTheme || 'light');

    // Theme Logic
    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    const themeContextValue = useMemo(() => ({
        theme, 
        toggleTheme, 
        colors: theme === 'dark' ? darkColors : lightColors
    }), [theme, toggleTheme]);

    // Auth State
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const login = useCallback(async (username: string, token: string) => {
        const userId = Math.floor(Math.random() * 1000) + 1; 
        const userData: User = { username, id: userId };

        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        setToken(token);
        setUser(userData);
        setIsAuthenticated(true);
        setAppScreen('App');
    }, [setAppScreen]);

    const logout = useCallback(async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setAppScreen('Login');
        try {
            // Ensure we navigate back to the login/index route when logging out
            router.replace('/');
        } catch (e) {
            // swallow router errors in environments where router isn't available
            console.warn('Router replace failed on logout', e);
        }
    }, [setAppScreen]);

    const authContextValue: AuthState = useMemo(() => ({
        token, user, isAuthenticated, authLoading, login, logout,
    }), [token, user, isAuthenticated, authLoading, login, logout]);

    // Sports will be provided via Redux. We'll expose the same shape through SportsContext for compatibility.

    // Initial Load for Auth (favorites are loaded by Redux)
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Load Auth
                const loadedToken = await AsyncStorage.getItem('userToken');
                const userDataJson = await AsyncStorage.getItem('userData');
                if (loadedToken && userDataJson) {
                    const loadedUser: User = JSON.parse(userDataJson);
                    setToken(loadedToken);
                    setUser(loadedUser);
                    setIsAuthenticated(true);
                }
            } catch (e) {
                console.error("Failed to load initial state:", e);
            } finally {
                setAuthLoading(false);
            }
        };
        loadInitialData();
    }, []);
    // Inner provider component that can use Redux hooks (must be rendered inside <Provider>)
    const InnerProviders: React.FC<{ children: React.ReactNode }> = ({ children: innerChildren }) => {
        const dispatch = useDispatch<AppDispatch>();
        const sports = useSelector((state: RootState) => state.sports);

        useEffect(() => {
            // Load persisted favorites into redux store on mount
            dispatch(loadFavorites());
        }, [dispatch]);

        const sportsContextValue: SportsState = useMemo(() => ({
            leagues: sports.leagues,
            favorites: sports.favorites,
            status: sports.status,
            error: sports.error,
            fetchLeagues: async () => { await dispatch(fetchLeagues()); },
            toggleFavorite: (league: League) => { dispatch(toggleFavoriteAction(league)); },
        }), [sports, dispatch]);

        return (
            <SportsContext.Provider value={sportsContextValue}>
                {innerChildren}
            </SportsContext.Provider>
        );
    };

    return (
        <ThemeContext.Provider value={themeContextValue}>
            <AuthContext.Provider value={authContextValue}>
                <Provider store={store}>
                    <InnerProviders>
                        {children}
                    </InnerProviders>
                </Provider>
            </AuthContext.Provider>
        </ThemeContext.Provider>
    );
};