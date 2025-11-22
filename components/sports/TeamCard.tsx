import React, { useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/AppProviders';
import { Team } from '../../types';
import FeatherIcon from '../common/FeatherIcon';

interface TeamCardProps {
    item: Team;
    onPress: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ item, onPress }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const teamName = item.strTeam || 'Unknown Team';
  const league = item.strLeague || 'League';
  const stadium = item.strStadium || 'Stadium not available';
  
  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
      }),
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(bgAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.card, colors.primary + '10'],
  });
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Animated.View style={[
          cardStyles.container, 
          { 
            backgroundColor,
            borderColor: colors.border,
          }
        ]}>
          {/* Team Badge */}
          <View style={cardStyles.imageContainer}>
            {item.strTeamBadge ? (
              <View style={[cardStyles.badgeWrapper, { backgroundColor: colors.background }]}>
                <Image 
                  source={{ uri: item.strTeamBadge }} 
                  style={cardStyles.badge}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View style={[cardStyles.placeholderBadge, { backgroundColor: colors.border }]}>
                <FeatherIcon name="shield" size={32} color={colors.placeholder} />
              </View>
            )}
          </View>
          
          {/* Team Info */}
          <View style={cardStyles.textContainer}>
            <Text style={[cardStyles.title, { color: colors.text }]} numberOfLines={1}>
              {teamName}
            </Text>
            <View style={cardStyles.leagueBadge}>
              <FeatherIcon name="award" size={12} color={colors.primary} />
              <Text style={[cardStyles.leagueText, { color: colors.primary }]} numberOfLines={1}>
                {league}
              </Text>
            </View>
            <View style={cardStyles.metaRow}>
              <FeatherIcon name="map-pin" size={14} color={colors.secondary} />
              <Text style={[cardStyles.meta, { color: colors.placeholder }]} numberOfLines={1}>
                {stadium}
              </Text>
            </View>
          </View>
          
          {/* Arrow */}
          <View style={cardStyles.arrowContainer}>
            <View style={[cardStyles.arrowCircle, { backgroundColor: colors.primary + '15' }]}>
              <FeatherIcon name='arrow-right' size={18} color={colors.primary} />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    marginVertical: 6,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 14,
  },
  badgeWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  badge: {
    width: 52,
    height: 52,
  },
  placeholderBadge: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  leagueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  leagueText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    fontSize: 13,
    fontWeight: '500',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TeamCard;