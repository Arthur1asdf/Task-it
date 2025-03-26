import React, { useState } from 'react';
import { registerUser } from '../api/auth';
import { View, TextInput, Button } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';


const RegisterScreen = ({ navigation }) => {
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
        <View>
            <TextInput 
                value={username} 
                onChangeText={setUsername} 
                placeholder="Username"
            />
            <TextInput 
                value={email} 
                onChangeText={setEmail} 
                placeholder="Email"
            />
            <TextInput 
                value={password} 
                onChangeText={setPassword} 
                placeholder="Password" 
                secureTextEntry
            />
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

export default RegisterScreen;
