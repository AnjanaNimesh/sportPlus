import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, useAuth } from '../../context/AppProviders';
import FeatherIcon from './FeatherIcon';

interface AppHeaderProps {
    title: string;
    showUser?: boolean;
    onBack?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showUser = true, onBack }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <View style={[headerStyles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={headerStyles.iconButton}>
            <FeatherIcon name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
      ) : (
        <View style={headerStyles.iconButtonPlaceholder} />
      )}
      <Text style={[headerStyles.title, { color: colors.primary }]}>{title}</Text>
      <View style={headerStyles.rightContent}>
        {showUser && user && (
          <Text style={[headerStyles.username, { color: colors.text }]}>
            Hi, {user.username || 'User'}!
          </Text>
        )}
        <TouchableOpacity onPress={toggleTheme} style={headerStyles.iconButton}>
          <FeatherIcon 
            name={theme === 'light' ? 'moon' : 'sun'} 
            size={20} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    height: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'flex-end',
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 15,
  },
  iconButton: {
    padding: 5,
  },
  iconButtonPlaceholder: {
    width: 34,
  }
});

export default AppHeader;