// DO NOT USE
// USE HOME.TSX INSTEAD

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // for routing

const HomeScreen = () => {
  const router = useRouter(); // used to navigate between screens

  // Logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
      router.replace("screens/Login"); // Navigate to Login screen after logout
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
