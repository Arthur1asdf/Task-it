import React, { useState } from 'react';
import { View, TextInput, ImageBackground, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { loginUser } from '../api/auth';

const Login: React.FC = () => {
    const router = useRouter();

    // Define state variables with explicit types
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Define expected API response type
    interface LoginResponse {
        token?: string;
        error?: string;
    }

    // Handle Login
    const handleLogin = async (): Promise<void> => {
        try {
            const result: LoginResponse = await loginUser(username, password);
            
            if (result?.token) {
                console.log("Login successful! Token:", result.token);
                router.navigate("./Home"); // Navigate to home screen
            } else {
                console.error("Login failed:", result.error || "Unknown error");
                Alert.alert("Login Failed", result.error || "Please try again.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Login Failed", "An unexpected error occurred.");
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
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />
                <TouchableOpacity onPress={() => router.navigate("./ForgotPassword")}>
                    <Text style={styles.link}>Forgot Password?</Text>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.registerButton} onPress={() => router.navigate("./Register")}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

// Define styles with TypeScript-friendly typing
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
        marginTop: "40%",
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        color: "rgb(85, 70, 60)",
        fontFamily: "Quicksand",
    },
    input: {
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "rgb(85, 70, 60)",
        color: "rgb(85, 70, 60)",
        fontSize: 14,
        paddingVertical: 8,
        marginBottom: 6,
    } as const, // Explicitly marked as read-only to avoid TS warnings
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
    loginButton: {
        flex: 1,
        padding: 10,
        backgroundColor: "rgb(85, 70, 60)",
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 5,
    },
    registerButton: {
        backgroundColor: "rgb(128, 106, 91)",
        flex: 1,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontFamily: "Quicksand",
    },
});

export default Login;
