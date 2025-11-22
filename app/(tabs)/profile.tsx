import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import CustomButton from '../../components/common/CustomButton';
import FeatherIcon from '../../components/common/FeatherIcon';
import { useAuth, useSports, useTheme } from '../../context/AppProviders';

const ProfileScreen: React.FC = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { favorites } = useSports();
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

  const handleLogout = () => {
    logout(); 
  };
  
  const userInitial = user?.username ? user.username[0].toUpperCase() : 'U';

  const stats = [
    { label: 'Favorites', value: favorites.length, icon: 'star', color: '#F59E0B' },
    { label: 'This Week', value: '0', icon: 'calendar', color: '#3B82F6' },
    { label: 'Total Views', value: '0', icon: 'eye', color: '#10B981' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 40 }]}>
      <AppHeader title="Profile" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Profile Card */}
          <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </View>
            <Text style={[styles.username, { color: colors.text }]}>
              {user?.username || 'Guest'}
            </Text>
            <Text style={[styles.userRole, { color: colors.placeholder }]}>
              Sports Enthusiast
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View 
                key={index}
                style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.statIconBox, { backgroundColor: stat.color + '20' }]}>
                  <FeatherIcon name={stat.icon as any} size={22} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.placeholder }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Settings Card */}
          <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
            
            {/* Theme Toggle */}
            <TouchableOpacity 
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
              onPress={toggleTheme}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconBox, { backgroundColor: colors.primary + '20' }]}>
                  <FeatherIcon name={theme === 'light' ? 'sun' : 'moon'} size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Appearance</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.placeholder }]}>
                    {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                  </Text>
                </View>
              </View>
              <FeatherIcon name="chevron-right" size={20} color={colors.placeholder} />
            </TouchableOpacity>

          </View>

          {/* Logout Button */}
          <CustomButton 
            title="Sign Out" 
            onPress={handleLogout}
            style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}
            textStyle={{ fontWeight: '700' }}
          >
            <FeatherIcon name="log-out" size={18} color="#FFFFFF" />
          </CustomButton>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  settingsCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  settingIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  logoutButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 24,
  },
});

export default ProfileScreen;