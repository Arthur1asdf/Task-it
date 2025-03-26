import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { View, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';

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
        <View>
            <TextInput 
                value={username} 
                onChangeText={setUsername} 
                placeholder="Username"
            />
            <TextInput 
                value={password} 
                onChangeText={setPassword} 
                placeholder="Password" 
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

export default LoginScreen;
