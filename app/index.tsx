import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginScreen from '../components/auth/LoginScreen'; // Renamed to keep component files cleaner
import { useAuth, useTheme } from '../context/AppProviders';

// Create a component that renders the Login screen but handles redirection if auth is complete
const IndexScreen: React.FC = () => {
  const { isAuthenticated, authLoading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
        // Redirect to the main tab screen if authenticated
        router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, authLoading]);

  // If not authenticated, render the Login screen. The actual login action 
  // will update the AuthContext, which triggers the useEffect and then the router.replace.
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoginScreen />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30, 
    }
});

export default IndexScreen;