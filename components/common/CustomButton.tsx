import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/AppProviders';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    style?: object;
    textStyle?: object;
    disabled?: boolean;
    children?: React.ReactNode;
}
const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style = {}, textStyle = {}, disabled = false, children }) => {
  const { colors } = useTheme();
  const buttonStyle = [
    buttonStyles.button, 
    { backgroundColor: disabled ? colors.placeholder : colors.primary }, 
    style
  ];
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      {children}
      <Text style={[buttonStyles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    gap: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomButton;