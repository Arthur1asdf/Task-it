import React, { useState } from 'react';
import { View, TextInput, ImageBackground, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser } from '../api/auth';

const Register: React.FC = () => {
    const router = useRouter();

    // Define state variables with explicit types
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Handle Registration
    const handleRegister = async (): Promise<void> => {
        try {
            const result = await registerUser(username, email, password);

            if (result.success === true) {
                Alert.alert("Registration Successful", "Check your email to verify your account before logging in.");
                router.navigate("./Login");
            } else if (result.error) {
                Alert.alert("Registration Failed", result.error);
            } else {
                Alert.alert("Registration Failed", "Unknown error");
            }
        } catch (error) {
            console.error("Registration Error:", error);
            Alert.alert("Registration Failed", "An unexpected error occurred.");
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/images/LoginDoor.png")}
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
                    value={email}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.navigate("./Login")}>
                        <Text style={styles.buttonText}>Login</Text>
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
        transform: [{ scale: 1.12 }],
    },
    container: {
        width: "55%",
        maxWidth: 400,
        padding: 20,
        alignItems: "center",
        marginTop: "37%"
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
        fontSize: 14,
        paddingVertical: 8,
        marginBottom: 8,
    } as const,  // Explicitly mark it as a read-only object to avoid TS warnings
    link: {
        fontSize: 10,
        color: "rgba(156, 146, 140, 0.84)",
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
    registerButton: {
        flex: 1,
        padding: 10,
        backgroundColor: "rgb(85, 70, 60)",
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 5,
    },
    loginButton: {
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
    },
});

export default Register;
