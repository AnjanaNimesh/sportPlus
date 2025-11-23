import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import FeatherIcon from '../../components/common/FeatherIcon';
import SearchBar from '../../components/common/SearchBar';
import LeagueCard from '../../components/sports/LeagueCard';
import { useSports, useTheme } from '../../context/AppProviders';
import { League } from '../../types';

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { leagues, status, error, fetchLeagues, favorites } = useSports();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLeagues, setFilteredLeagues] = useState<League[]>([]);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === 'idle') {
      fetchLeagues();
    }
  }, [status, fetchLeagues]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLeagues(leagues);
    } else {
      const filtered = leagues.filter(league => 
        league.strLeague.toLowerCase().includes(searchQuery.toLowerCase()) ||
        league.strSport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (league.strLeagueAlternate?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
      setFilteredLeagues(filtered);
    }
  }, [searchQuery, leagues]);
  
  const handlePress = (item: League) => {
    router.push({ pathname: '/details/[id]', params: { id: String(item.idLeague) } });
  };

  const renderItem = ({ item, index }: { item: League; index: number }) => (
    <Animated.View style={{ 
      opacity: fadeAnim,
      transform: [{
        translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0],
        })
      }]
    }}>
      <LeagueCard 
        item={item} 
        onPress={() => handlePress(item)} 
      />
    </Animated.View>
  );

  const uniqueSports = [...new Set(leagues.map(l => l.strSport))].length;

  const renderHeader = () => (
    <>
      {/* Quick Stats */}
      <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIconBox, { backgroundColor: colors.primary + '20' }]}>
            <FeatherIcon name="globe" size={24} color={colors.primary} />
          </View>
          <View style={styles.statInfo}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{leagues.length}</Text>
            <Text style={[styles.statLabel, { color: colors.placeholder }]}>Leagues</Text>
          </View>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIconBox, { backgroundColor: colors.secondary + '20' }]}>
            <FeatherIcon name="award" size={24} color={colors.secondary} />
          </View>
          <View style={styles.statInfo}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{uniqueSports}</Text>
            <Text style={[styles.statLabel, { color: colors.placeholder }]}>Sports</Text>
          </View>
        </View>
      </Animated.View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          All Leagues
        </Text>
        <Text style={[styles.sectionCount, { color: colors.placeholder }]}>
          {filteredLeagues.length} {filteredLeagues.length === 1 ? 'league' : 'leagues'}
        </Text>
      </View>
    </>
  );

  let content;
  if (status === 'loading') {
    content = (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading leagues...</Text>
      </View>
    );
  } else if (status === 'failed') {
    content = (
      <View style={styles.centerContainer}>
        <FeatherIcon name="alert-circle" size={64} color={colors.placeholder} />
        <Text style={[styles.errorText, { color: colors.text }]}>Oops! Something went wrong</Text>
        <Text style={[styles.errorSubText, { color: colors.placeholder }]}>{error}</Text>
      </View>
    );
  } else {
    content = (
      <FlatList
        data={filteredLeagues}
        renderItem={renderItem}
        keyExtractor={(item) => item.idLeague.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FeatherIcon name="inbox" size={64} color={colors.placeholder} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No leagues found
            </Text>
            <Text style={[styles.emptySubText, { color: colors.placeholder }]}>
              {searchQuery ? `No results for "${searchQuery}"` : 'Check back later'}
            </Text>
          </View>
        }
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 40 }]}>
      <AppHeader title="Discover" />
      <SearchBar 
        value={searchQuery} 
        onChangeText={setSearchQuery}
        placeholder="Search leagues, sports..."
      />
      <View style={{ flex: 1 }}>
        {content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 10,
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
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    fontWeight: '700',
  },
  errorSubText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
});

export default HomeScreen;