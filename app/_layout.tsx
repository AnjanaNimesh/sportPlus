import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AppProviders, useAuth, useTheme } from '../context/AppProviders';
import { ScreenName } from '../types';

// The main application setup component using providers
const AppRoot: React.FC = () => {
    const { isAuthenticated, authLoading } = useAuth();
    const { colors } = useTheme();

    if (authLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10, color: colors.text }}>Loading Authentication...</Text>
            </View>
        );
    }
    
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Auth Screens (index, register) - only shown when not authenticated */}
            {!isAuthenticated ? (
                <>
                    <Stack.Screen name="index" options={{ title: 'Login' }} />
                    <Stack.Screen name="register" options={{ title: 'Register' }} />
                </>
            ) : (
                <>
                    {/* Main App Content (Tabs) - only shown when authenticated */}
                    <Stack.Screen name="(tabs)" options={{ title: 'Home' }} />
                    {/* Detail Screen uses dynamic routing */}
                    <Stack.Screen name="details/[id]" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                </>
            )}
        </Stack>
    );
};


// The file system requires a single default export.
// This wrapper handles the global context setup.
export default function RootLayout() {
    // This state is used internally by AuthContext to force the top-level re-render in AppRoot
    const [appScreen, setAppScreen] = useState<ScreenName>('Login'); 
    return (
        <AppProviders setAppScreen={setAppScreen}>
            <AppRoot />
        </AppProviders>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
    }
});