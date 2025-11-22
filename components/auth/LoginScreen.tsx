
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DUMMY_AUTH_URL } from '../../constants/api';
import { useAuth, useTheme } from '../../context/AppProviders';
import { validateLoginForm } from '../../utils/validation';
import CustomButton from '../common/CustomButton';
import FeatherIcon from '../common/FeatherIcon';

const LoginScreen: React.FC = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const { login } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    const validation = validateLoginForm(username, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors({});
    setApiError('');
    setLoading(true);

    try {
      const localJson = await AsyncStorage.getItem('registeredUsers');
      if (localJson) {
        try {
          const localUsers = JSON.parse(localJson) as Array<{username: string; password: string}>;
          const found = localUsers.find(u => u.username === username && u.password === password);
          if (found) {
            const fakeToken = 'local-' + Math.random().toString(36).slice(2);
            await login(username, fakeToken);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Failed to parse local users', e);
        }
      }
      const response = await fetch(DUMMY_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.token) {
        await login(data.username, data.token);
      } else {
        setApiError(data.message || 'Login failed. Check credentials.');
      }
    } catch (e) {
      setApiError('Network error or API failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} backgroundColor={colors.background} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme toggle */}
        <Animated.View style={[styles.themeToggleContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={toggleTheme} style={[styles.themeToggleButton, { backgroundColor: colors.card }]}>
            <FeatherIcon name={theme === 'light' ? 'moon' : 'sun'} size={20} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Header Section */}
        <Animated.View style={[
          styles.headerSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
          }
        ]}>
          <Animated.View style={[
            styles.logoContainer, 
            { 
              backgroundColor: colors.primary,
              transform: [{ scale: pulseAnim }]
            }
          ]}>
            <FontAwesome5 name="basketball-ball" size={46} color="#FFFFFF" solid />
          </Animated.View>
          <Text style={[styles.appName, { color: colors.text }]}>
            Sport<Text style={{ color: colors.primary }}>Plus</Text>
          </Text>
          <Text style={[styles.tagline, { color: colors.placeholder }]}>
          Fuel Your Passion for Sports
          </Text>
        </Animated.View>

        {/* Form Section */}
        <Animated.View style={[
          styles.formCard,
          {
            backgroundColor: colors.card,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.welcomeHeader}>
            <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome Back!</Text>
            <View style={[styles.accentLine, { backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Sign in to continue your journey
          </Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { 
              backgroundColor: colors.background,
              borderColor: errors.username ? '#EF4444' : colors.border 
            }]}>
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                <FeatherIcon name="user" size={20} color={colors.primary} />
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Username"
                placeholderTextColor={colors.placeholder}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrors(prev => ({ ...prev, username: '' }));
                }}
                autoCapitalize="none"
              />
            </View>
            {errors.username ? (
              <View style={styles.errorContainer}>
                <FeatherIcon name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.errorText}>{errors.username}</Text>
              </View>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { 
              backgroundColor: colors.background,
              borderColor: errors.password ? '#EF4444' : colors.border 
            }]}>
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                <FeatherIcon name="lock" size={20} color={colors.primary} />
              </View>
              <TextInput
                style={[styles.input, { color: colors.text, flex: 1 }]}
                placeholder="Password"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <FeatherIcon 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={colors.placeholder} 
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <View style={styles.errorContainer}>
                <FeatherIcon name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.errorText}>{errors.password}</Text>
              </View>
            ) : null}
          </View>

          {apiError ? (
            <View style={styles.apiErrorContainer}>
              <FeatherIcon name="alert-triangle" size={18} color="#EF4444" />
              <Text style={styles.apiErrorText}>{apiError}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <CustomButton 
            title={loading ? 'Signing In...' : 'Sign In'} 
            onPress={handleLogin}
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            disabled={loading}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.placeholder }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Register Link */}
          <TouchableOpacity 
            style={[styles.registerButton, { borderColor: colors.primary, backgroundColor: colors.primary + '08' }]}
            onPress={() => router.push('/register')}
          >
            <FeatherIcon name="user-plus" size={18} color={colors.primary} />
            <Text style={[styles.registerButtonText, { color: colors.primary }]}>
              Create New Account
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  appName: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
  },
  formCard: {
    borderRadius: 28,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  accentLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2,
    paddingHorizontal: 16,
    height: 60,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 4,
    gap: 6,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
  },
  apiErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  apiErrorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  loginButton: {
    marginTop: 8,
    height: 56,
    borderRadius: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '600',
  },
  registerButton: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 28,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 20,
  },
  themeToggleButton: {
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default LoginScreen;