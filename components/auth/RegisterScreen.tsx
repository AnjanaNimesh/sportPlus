
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/AppProviders';
import { validateRegisterForm } from '../../utils/validation';
import CustomButton from '../common/CustomButton';
import FeatherIcon from '../common/FeatherIcon';

const RegisterScreen: React.FC = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    const validation = validateRegisterForm(username, password, confirmPassword);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    try {
      const stored = await AsyncStorage.getItem('registeredUsers');
      const users = stored ? JSON.parse(stored) : [];
      users.push({ username, password });
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save registered user locally', e);
    } finally {
      setTimeout(() => {
        setLoading(false);
        router.replace('/');
      }, 800);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" backgroundColor={colors.background} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme toggle */}
        <Animated.View style={[styles.themeToggleContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            onPress={toggleTheme} 
            style={[styles.themeToggleButton, { backgroundColor: colors.card }]}
          >
            <FeatherIcon name={theme === 'light' ? 'moon' : 'sun'} size={18} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Header Section */}
        <Animated.View style={[
          styles.headerSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <FeatherIcon name="user-plus" size={40} color="#FFFFFF" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Join SportPlus</Text>
          <Text style={[styles.tagline, { color: colors.placeholder }]}>
            Create your account to get started
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
          <Text style={[styles.formTitle, { color: colors.text }]}>Create Account</Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.placeholder }]}>Username</Text>
            <View style={[styles.inputWrapper, { 
              backgroundColor: colors.background,
              borderColor: errors.username ? '#EF4444' : 'transparent'
            }]}>
              <FeatherIcon name="user" size={18} color={colors.placeholder} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Choose a username"
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
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.placeholder }]}>Password</Text>
            <View style={[styles.inputWrapper, { 
              backgroundColor: colors.background,
              borderColor: errors.password ? '#EF4444' : 'transparent'
            }]}>
              <FeatherIcon name="lock" size={18} color={colors.placeholder} />
              <TextInput
                style={[styles.input, { color: colors.text, flex: 1 }]}
                placeholder="Create a password (min 6 chars)"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <FeatherIcon 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={18} 
                  color={colors.placeholder} 
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.placeholder }]}>Confirm Password</Text>
            <View style={[styles.inputWrapper, { 
              backgroundColor: colors.background,
              borderColor: errors.confirmPassword ? '#EF4444' : 'transparent'
            }]}>
              <FeatherIcon name="shield" size={18} color={colors.placeholder} />
              <TextInput
                style={[styles.input, { color: colors.text, flex: 1 }]}
                placeholder="Confirm your password"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <FeatherIcon 
                  name={showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={18} 
                  color={colors.placeholder} 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          {/* Register Button */}
          <CustomButton 
            title={loading ? 'Creating Account...' : 'Create Account'} 
            onPress={handleRegister}
            style={[styles.registerButton, { backgroundColor: colors.primary }]}
            disabled={loading}
          />

          {/* Login Link */}
          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => router.replace('/')}
          >
            <Text style={[styles.loginText, { color: colors.placeholder }]}>
              Already have an account? <Text style={{ color: colors.primary, fontWeight: '700' }}>Sign In</Text>
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
    paddingBottom: 40,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 20,
  },
  themeToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
  },
  formCard: {
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 28,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  registerButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 12,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RegisterScreen;