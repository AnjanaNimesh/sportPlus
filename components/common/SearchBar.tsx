// import React from 'react';
// import { View, TextInput, StyleSheet } from 'react-native';
// import { useTheme } from '../../context/AppProviders';
// import FeatherIcon from './FeatherIcon';

// interface SearchBarProps {
//   value: string;
//   onChangeText: (text: string) => void;
//   placeholder?: string;
// }

// const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder = 'Search...' }) => {
//   const { colors } = useTheme();

//   return (
//     <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
//       <FeatherIcon name="search" size={20} color={colors.placeholder} />
//       <TextInput
//         style={[styles.input, { color: colors.text }]}
//         placeholder={placeholder}
//         placeholderTextColor={colors.placeholder}
//         value={value}
//         onChangeText={onChangeText}
//         autoCapitalize="none"
//         autoCorrect={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     marginHorizontal: 10,
//     marginVertical: 10,
//     gap: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     padding: 0,
//   },
// });

// export default SearchBar;




import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../context/AppProviders';
import FeatherIcon from './FeatherIcon';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder = 'Search...' }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
        <FeatherIcon name="search" size={18} color={colors.primary} />
      </View>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <View style={[styles.clearButton]}>
          <FeatherIcon name="x" size={16} color={colors.placeholder} onPress={() => onChangeText('')} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;