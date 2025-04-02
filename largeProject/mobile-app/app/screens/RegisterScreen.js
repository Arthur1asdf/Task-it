import React, { useState } from 'react';
import { registerUser } from '../api/auth';
import { View, TextInput} from 'react-native';
import { useRouter} from 'expo-router';
import { ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';

const RegisterScreen = () => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        const result = await registerUser(username, email, password);
        
        if (result.success) {
            alert("Registration Successful\nCheck your email to verify your account before logging in.");
            router.navigate("screens/LoginScreen");
        } else {
            alert("Registration Failed", result.error || "Unknown error");
        }
    };

    return (
    <ImageBackground
        source={require("../../assets/images/LoginBackgroundMobile.png")}
        style={styles.background}
        resizeMode='cover'
    >
        <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        
        <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsername}
            value={username}
        />

        <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            value={username}
        />

        <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
        />

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.navigate("screens/LoginScreen")}>
            <Text style={styles.buttonText}>Login</Text>
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
    },
    container: {
      width: "70%",
      maxWidth: 400,
      padding: 20,
      alignItems: "center",
      marginTop: "42%"
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: "rgb(85, 70, 60)",
      marginBottom: 8,
    },
    input: {
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: "rgb(85, 70, 60)",

      color: "rgb(85, 70, 60)",
      placeholderTextColor: "rgba(85, 70, 60, 0.42)",
      fontSize: 14,
      paddingVertical: 10,
      marginBottom: 10,
    },
    link: {
      fontSize: 10,
      color: "rgba(156, 146, 140, 0.84)",
      textAlign: "right",
      marginBottom: 15,
    },
    buttonContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      width: "50%",
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

export default RegisterScreen;
