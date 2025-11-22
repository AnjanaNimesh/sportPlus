import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import FeatherIcon from '../../components/common/FeatherIcon';
import LeagueCard from '../../components/sports/LeagueCard';
import { useSports, useTheme } from '../../context/AppProviders';
import { League } from '../../types';

const FavoritesScreen: React.FC = () => {
  const { colors } = useTheme();
  const { favorites } = useSports();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePress = (item: League) => {
    router.push(`/details/${item.idLeague}`);
  };

  const renderItem = ({ item }: { item: League }) => (
    <LeagueCard 
      item={item} 
      onPress={() => handlePress(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Your Favorites
      </Text>
      <Text style={[styles.sectionSubtitle, { color: colors.placeholder }]}>
        {favorites.length} {favorites.length === 1 ? 'league' : 'leagues'} saved
      </Text>
    </View>
  );

  let content;
  if (favorites.length === 0) {
    content = (
      <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
        <View style={[styles.emptyIconBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FeatherIcon name="star" size={48} color={colors.placeholder} />
        </View>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          No favorites yet
        </Text>
        <Text style={[styles.emptySubText, { color: colors.placeholder }]}>
          Start adding leagues to your favorites from the home screen
        </Text>
      </Animated.View>
    );
  } else {
    content = (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.idLeague.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 40 }]}>
      <AppHeader title="Favorites" />
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
  headerContainer: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default FavoritesScreen;