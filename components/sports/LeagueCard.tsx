import React, { ComponentProps, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSports, useTheme } from '../../context/AppProviders';
import { League } from '../../types';
import FeatherIcon from '../common/FeatherIcon';

interface LeagueCardProps {
    item: League;
    onPress: () => void;
}

const LeagueCard: React.FC<LeagueCardProps> = ({ item, onPress }) => {
  const { colors } = useTheme();
  const { favorites } = useSports();
  const isFavorite = favorites.some(fav => fav.idLeague === item.idLeague);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Pulse animation for favorite icon
  useEffect(() => {
    if (isFavorite) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFavorite]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const sportName = item.strSport || 'General Sports';
  const description = item.strLeagueAlternate || 'Click for details';
  
  let iconName: ComponentProps<typeof FeatherIcon>['name'] = 'globe';
  let iconColor = colors.primary;
  if (sportName.toLowerCase().includes('soccer') || sportName.toLowerCase().includes('football')) {
    iconName = 'dribbble';
    iconColor = '#10B981'; // Green
  } else if (sportName.toLowerCase().includes('basketball')) {
    iconName = 'disc';
    iconColor = '#F59E0B'; // Orange
  } else if (sportName.toLowerCase().includes('racing') || sportName.toLowerCase().includes('motorsport')) {
    iconName = 'flag';
    iconColor = '#EF4444'; // Red
  } else if (sportName.toLowerCase().includes('baseball')) {
    iconName = 'circle';
    iconColor = '#3B82F6'; // Blue
  } else if (sportName.toLowerCase().includes('tennis')) {
    iconName = 'target';
    iconColor = '#8B5CF6'; // Purple
  } else if (sportName.toLowerCase().includes('ice hockey')) {
    iconName = 'octagon';
    iconColor = '#06B6D4'; // Cyan
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[cardStyles.container, { 
          backgroundColor: colors.card, 
          borderColor: isFavorite ? colors.primary : colors.border,
          borderLeftWidth: 4,
          borderLeftColor: iconColor,
        }]}
      >
        {/* Sport Icon with Gradient Background */}
        <View style={[cardStyles.iconContainer, { backgroundColor: iconColor + '15' }]}>
          <FeatherIcon name={iconName} size={32} color={iconColor} />
        </View>
        
        {/* Content */}
        <View style={cardStyles.textContainer}>
          <Text style={[cardStyles.title, { color: colors.text }]} numberOfLines={1}>
            {item.strLeague}
          </Text>
          <Text style={[cardStyles.description, { color: colors.placeholder }]} numberOfLines={2}>
            {description && description.length > 60 ? description.substring(0, 60) + '...' : description}
          </Text>
          <View style={cardStyles.sportBadge}>
            <Text style={[cardStyles.sportText, { color: iconColor }]}>
              {sportName}
            </Text>
          </View>
        </View>
        
        {/* Favorite Star with Animation */}
        <Animated.View style={[
          cardStyles.favoriteIndicator,
          { transform: [{ scale: pulseAnim }] }
        ]}>
          <FeatherIcon 
            name={isFavorite ? 'star' : 'star'} 
            size={24} 
            color={isFavorite ? colors.secondary : colors.placeholder}
            style={{ 
              opacity: isFavorite ? 1 : 0.5 
            }}
          />
        </Animated.View>
        
        {/* Chevron */}
        <View style={cardStyles.chevron}>
          <FeatherIcon name="chevron-right" size={20} color={colors.placeholder} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  sportBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  sportText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteIndicator: {
    marginHorizontal: 8,
  },
  chevron: {
    marginLeft: 4,
  },
});

export default LeagueCard;