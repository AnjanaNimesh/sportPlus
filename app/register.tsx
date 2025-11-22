import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegisterScreen from '../components/auth/RegisterScreen';
import { useTheme } from '../context/AppProviders';

const RegisterRoute: React.FC = () => {

     const { colors } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <RegisterScreen />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30, // Placeholder for safe area
    }
});

export default RegisterRoute;