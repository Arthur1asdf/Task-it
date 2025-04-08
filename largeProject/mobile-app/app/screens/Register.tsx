import React, { useState, useEffect } from 'react';
import { View, TextInput, ImageBackground, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser } from '../api/auth';

const Register: React.FC = () => {
    const router = useRouter();

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [requirements, setRequirements] = useState<{
        length: boolean;
        uppercase: boolean;
        lowercase: boolean;
        number: boolean;
    }>({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
    });

    // Validate password complexity
    const validatePassword = (password: string) => {
        const length = password.length >= 8;
        const uppercase = /[A-Z]/.test(password);
        const lowercase = /[a-z]/.test(password);
        const number = /\d/.test(password);

        setRequirements({
            length,
            uppercase,
            lowercase,
            number,
        });

        return length && uppercase && lowercase && number;
    };

    useEffect(() => {
        // Auto-validation when password changes
        validatePassword(password);
    }, [password]);

    // Handle Registration
    const handleRegister = async (): Promise<void> => {
        if (!validatePassword(password)) {
            Alert.alert("Please fulfill all password requirements.");
            return;
        }

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

                {/* Password requirements */}
                {password.length > 0 && (
                    <View style={styles.requirementsContainer}>
                        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                        <View style={styles.requirementsList}>
                            <Text style={[styles.requirementText, requirements.length ? styles.valid : styles.invalid]}>
                                {requirements.length ? '✔' : '✘'} At least 8 characters
                            </Text>
                            <Text style={[styles.requirementText, requirements.uppercase ? styles.valid : styles.invalid]}>
                                {requirements.uppercase ? '✔' : '✘'} At least one uppercase letter
                            </Text>
                            <Text style={[styles.requirementText, requirements.lowercase ? styles.valid : styles.invalid]}>
                                {requirements.lowercase ? '✔' : '✘'} At least one lowercase letter
                            </Text>
                            <Text style={[styles.requirementText, requirements.number ? styles.valid : styles.invalid]}>
                                {requirements.number ? '✔' : '✘'} At least one number
                            </Text>
                        </View>
                    </View>
                )}

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
        marginTop: "37%",
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
    },
    requirementsContainer: {
        position: "absolute",
        top: -150,
        backgroundColor: "#FFFBF0",
        padding: 15,
        borderRadius: 10,
        width: "140%",
        borderWidth: 1,
        borderColor: "#F0C674",
    },
    requirementsTitle: {
        fontWeight: "bold",
        fontSize: 12,
        color: "rgb(85, 70, 60)",
    },
    requirementsList: {
        marginTop: 10,
    },
    requirementText: {
        fontSize: 10,
        marginBottom: 5,
        color: "rgb(85, 70, 60)",
    },
    valid: {
        color: "green",
    },
    invalid: {
        color: "red",
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
