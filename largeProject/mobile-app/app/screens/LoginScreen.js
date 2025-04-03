import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';

// color: "rgb(85, 70, 60)"

const LoginScreen = () => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const result = await loginUser(username, password);
        
        if (result?.token) {
            console.log("Login successful! Token:", result.token);
            router.navigate("screens/HomeScreen"); // Navigate to home screen
        } else {
            console.error("Login failed:", result.error || "Unknown error");
            alert(result.error || "Login failed. Please try again.");
        }
    };
    

    return (
    <ImageBackground
        source={require("../../assets/images/LoginDoor.png")}
        style={styles.background}
        resizeMode='cover'
    >
        <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        
        <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsername}
            value={username}
        />
        <TouchableOpacity onPress={() => router.navigate("ForgotUsernameScreen")}>
            <Text style={styles.link}>Forgot Username?</Text>
        </TouchableOpacity>

        <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
        />
        <TouchableOpacity onPress={() => router.navigate("ForgotPasswordScreen")}>
            <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.navigate("screens/RegisterScreen")}>
            <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
        </View>
    </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "120%",
      marginTop: "-18%",
      marginBottom: "28%",
      transform: [{ scale: 1.1 }],
    },
    container: {
      width: "60%",
      maxWidth: 400,
      padding: 20,
      alignItems: "center",
      marginTop: "40%"
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: "rgb(85, 70, 60)",
    },
    input: {
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: "rgb(85, 70, 60)",
      color: "rgb(85, 70, 60)",
      placeholderTextColor: "rgba(85, 70, 60, 0.42)",
      fontSize: 14,
      paddingVertical: 4,
      marginBottom: 6,
    },
    link: {
      fontSize: 10,
      color: "rgb(182, 160, 147)",
      textAlign: "right",
      marginBottom: 15,
    },
    buttonContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      width: "80%",
      height: 100,
      marginTop: 30,
    },
    button: {
      flex: 1,
      padding: 10,
      backgroundColor: "rgb(85, 70, 60)",
      borderRadius: 10,
      alignItems: "center",
      marginVertical: 5,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
});

export default LoginScreen;
