import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, TextInput, ImageBackground, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { forgotPassword } from "../api/auth";

const ForgotPassword: React.FC = () => {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');

    // POST request to forgot password endpoint
    const handleForgotPassword = async (): Promise<void> => {
        try {
            const result = await forgotPassword(email);
            if (result.success) {
                Alert.alert("Check your email for password reset instructions.");
            } else {
                Alert.alert("Error", result.error || "An unexpected error occurred.");
            }
        } catch (error) {
            console.error("Forgot Password Error:", error);
            Alert.alert("Error", "An unexpected error occurred.");
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/images/BackgroundColor.png")}
            style={styles.background}
            resizeMode='cover'
        >
            <View style={styles.imageContainer}>
                <Image source={require("../../assets/images/largeStickyNote.png")} style={styles.image} />
            </View>
                <View style={styles.container}>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.description}>Enter your email address and we will send you instructions to reset your password.</Text>
                    

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={setEmail}
                        value={email}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => { handleForgotPassword }} style={styles.resetButton}>
                            <Text style={styles.buttonText}>Send Reset Email</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => router.navigate("./Login")} style={styles.loginButton}>
                            <Text style={styles.buttonText}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '120%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    image: {
        width: '90%',
        height: '40%',
        position: 'absolute',
        top: '25%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        padding: 20,
        marginTop: '-10%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'rgb(85, 70, 60)',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 30,
        color: 'rgb(85, 70, 60)',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'rgb(85, 70, 60)',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: 'rgb(85, 70, 60)',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        width: "60%",
        height: 100,
        marginTop: 8,
    },
    loginButton: {
        flex: 1,
        padding: 2,
        height: 80,
        backgroundColor: "rgb(128, 106, 91)",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
    },
    resetButton: {
        flex: 1,
        padding: 2,
        height: 80,
        backgroundColor: "rgb(85, 70, 60)",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
    },
    buttonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
});
           
export default ForgotPassword;