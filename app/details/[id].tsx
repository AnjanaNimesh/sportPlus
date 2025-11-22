import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import CustomButton from '../../components/common/CustomButton';
import FeatherIcon from '../../components/common/FeatherIcon';
import TeamCard from '../../components/sports/TeamCard';
import { API_BASE_URL } from '../../constants/api';
import { useSports, useTheme } from '../../context/AppProviders';
import { Team } from '../../types';

const DetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { favorites, leagues, toggleFavorite } = useSports();
  const { id } = useLocalSearchParams();
  const leagueId = id as string;

  const league = useMemo(() => {
    return leagues.find(l => l.idLeague === leagueId) || favorites.find(l => l.idLeague === leagueId);
  }, [leagueId, leagues, favorites]);

  const [details, setDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const heroScaleAnim = useRef(new Animated.Value(1.1)).current;

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
      Animated.timing(heroScaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!league) return;
    const fetchLeagueDetails = async () => {
      setLoadingDetails(true);
      try {
        const res = await fetch(`${API_BASE_URL}lookupleague.php?id=${league.idLeague}`);
        const json = await res.json();
        if (json && json.leagues && json.leagues.length) {
          setDetails(json.leagues[0]);
        }
      } catch (e) {
        console.warn('Failed to fetch league details', e);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchLeagueDetails();
  }, [league]);

  useEffect(() => {
    if (!league) return;
    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const res = await fetch(`${API_BASE_URL}lookup_all_teams.php?id=${league.idLeague}`);
        const json = await res.json();
        if (json && json.teams) {
          setTeams(json.teams);
        }
      } catch (e) {
        console.warn('Failed to fetch teams', e);
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchTeams();
  }, [league]);
  
  if (!league) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 30 }]}>
        <AppHeader title="League Not Found" onBack={() => router.back()} showUser={false} />
        <View style={styles.centerContainer}>
          <FeatherIcon name="alert-circle" size={64} color={colors.placeholder} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            League with ID {leagueId} not found.
          </Text>
        </View>
      </View>
    );
  }

  const isFavorite = favorites.some(fav => fav.idLeague === league.idLeague);

  const handleToggleFavorite = () => {
    toggleFavorite(league);
  };
  
  const handleBack = () => {
    router.back();
  };

  const handleTeamPress = (team: Team) => {
    console.log('Team pressed:', team.strTeam);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 40 }]}>
      <AppHeader title="League Details" onBack={handleBack} showUser={false} />
      
      <ScrollView style={detailsStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Image with Overlay */}
        {details?.strFanart1 && (
          <Animated.View style={[
            detailsStyles.heroContainer,
            { transform: [{ scale: heroScaleAnim }] }
          ]}>
            <Image 
              source={{ uri: details.strFanart1 }} 
              style={detailsStyles.heroImage}
              resizeMode="cover"
            />
            <View style={detailsStyles.heroOverlay}>
              <View style={detailsStyles.heroContent}>
                {details?.strBadge && (
                  <Image source={{ uri: details.strBadge }} style={detailsStyles.heroBadge} />
                )}
                <Text style={detailsStyles.heroTitle}>{league.strLeague}</Text>
                <View style={detailsStyles.heroMeta}>
                  <View style={[detailsStyles.heroBadgeItem, { backgroundColor: colors.primary }]}>
                    <Text style={detailsStyles.heroBadgeText}>{league.strSport}</Text>
                  </View>
                  {details?.strCountry && (
                    <View style={[detailsStyles.heroBadgeItem, { backgroundColor: colors.secondary }]}>
                      <FeatherIcon name="map-pin" size={12} color="#FFF" />
                      <Text style={detailsStyles.heroBadgeText}>{details.strCountry}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        )}
        
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Info Cards */}
          <View style={detailsStyles.infoGrid}>
            {details?.intFormedYear && (
              <View style={[detailsStyles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <FeatherIcon name="calendar" size={24} color={colors.primary} />
                <Text style={[detailsStyles.infoCardValue, { color: colors.text }]}>{details.intFormedYear}</Text>
                <Text style={[detailsStyles.infoCardLabel, { color: colors.placeholder }]}>Founded</Text>
              </View>
            )}
            <View style={[detailsStyles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <FeatherIcon name="users" size={24} color={colors.secondary} />
              <Text style={[detailsStyles.infoCardValue, { color: colors.text }]}>{teams.length}</Text>
              <Text style={[detailsStyles.infoCardLabel, { color: colors.placeholder }]}>Teams</Text>
            </View>
          </View>

          {/* Main Content Card */}
          <View style={[detailsStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={detailsStyles.sectionHeader}>
              <FeatherIcon name="info" size={20} color={colors.primary} />
              <Text style={[detailsStyles.sectionTitle, { color: colors.text }]}>Overview</Text>
            </View>
            
            {loadingDetails ? (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
            ) : (
              <Text style={[detailsStyles.description, { color: colors.placeholder }]}> 
                {details?.strDescriptionEN || league.strLeagueAlternate || 'No detailed description available.'}
              </Text>
            )}

            <CustomButton
              title={isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
              onPress={handleToggleFavorite}
              style={[
                detailsStyles.favoriteButton, 
                { 
                  backgroundColor: isFavorite ? colors.secondary : colors.primary,
                  borderWidth: 2,
                  borderColor: isFavorite ? colors.secondary : colors.primary,
                }
              ]}
              textStyle={{ fontWeight: '800', fontSize: 16 }}
            />
          </View>

          {/* Teams Section */}
          <View style={[detailsStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity 
              onPress={() => setShowTeams(!showTeams)}
              style={detailsStyles.teamsHeader}
              activeOpacity={0.7}
            >
              <View style={detailsStyles.teamsHeaderLeft}>
                <View style={[detailsStyles.teamsIconBox, { backgroundColor: colors.primary + '15' }]}>
                  <FeatherIcon name="shield" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={[detailsStyles.teamsTitle, { color: colors.text }]}>
                    Teams
                  </Text>
                  <Text style={[detailsStyles.teamsCount, { color: colors.placeholder }]}>
                    {teams.length} teams available
                  </Text>
                </View>
              </View>
              <View style={[detailsStyles.chevronBox, { backgroundColor: colors.background }]}>
                <FeatherIcon 
                  name={showTeams ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={colors.primary} 
                />
              </View>
            </TouchableOpacity>

            {showTeams && (
              <View style={detailsStyles.teamsContainer}>
                {loadingTeams ? (
                  <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
                ) : teams.length > 0 ? (
                  teams.map((team) => (
                    <TeamCard 
                      key={team.idTeam} 
                      item={team} 
                      onPress={() => handleTeamPress(team)} 
                    />
                  ))
                ) : (
                  <View style={detailsStyles.noTeamsContainer}>
                    <FeatherIcon name="inbox" size={40} color={colors.placeholder} />
                    <Text style={[detailsStyles.noTeamsText, { color: colors.placeholder }]}>
                      No teams found for this league
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
  }
});

const detailsStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  heroContainer: {
    height: 240,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroBadge: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  heroBadgeItem: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoGrid: {
    flexDirection: 'row',
    padding: 15,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCardValue: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
  },
  infoCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  card: {
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  favoriteButton: {
    marginTop: 8,
    height: 56,
    borderRadius: 14,
  },
  teamsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  teamsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  teamsIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamsTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  teamsCount: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  chevronBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamsContainer: {
    marginTop: 16,
  },
  noTeamsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noTeamsText: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: '500',
  },
});

export default DetailsScreen;