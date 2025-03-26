// HomeScreen.tsx (or HomeScreen.js)
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // For navigation (if you need it)

const HomeScreen = () => {
  const navigation = useNavigation(); // If you need to navigate

  // Logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
      navigation.replace('Login'); // Navigate to Login screen after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
