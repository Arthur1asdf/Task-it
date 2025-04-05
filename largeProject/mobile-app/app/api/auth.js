import axios from 'axios';  // Import axios
import { API_BASE_URL } from '../../config';  // Import the API base URL
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

// Helper function to handle errors
const handleError = (error) => {
    console.error("Error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Operation failed. Please try again." };
};

//  Login user
const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login/login`, { 
            Username: username, 
            Password: password 
        }); 

        if (response.data && response.data.token) {
            await AsyncStorage.setItem('token', response.data.token); // Store token
            await AsyncStorage.setItem("userId", response.data.userId);  // Store userId

            return response.data;
        } else {
            return { error: "Invalid response from server" };
        }
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        return { error: error.response?.data?.message || "Login failed. Please try again." };
    }
};

//  Register user
const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register/register`, { 
            Username: username, 
            Email: email, 
            Password: password 
        });

        if (response.data && response.data.message) {
            return { success: true, message: response.data.message };
        } else {
            return { error: "Invalid response from server" };
        }
    } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
        return { error: error.response?.data?.error || "Registration failed. Please try again." };
    }
};


//  Forgot password
const forgotPassword = async (Email) => {
    try {
        // Send POST request to backend
        const response = await axios.post(`${API_BASE_URL}/forgot-password`, { Email });
        return response.data;  // Return the response data
    } catch (error) {
        handleError(error);  // Handle error
    }
};

//  Reset password
const resetPassword = async (Password, Token) => {
    try {
        // Send POST request to backend
        const response = await axios.post(`${API_BASE_URL}/reset-password`, { Password, Token });
        return response.data;  // Return the response data
    } catch (error) {
        handleError(error);  // Handle error
    }
};

// Logout user
const logoutUser = async () => {
    try {
        // Remove token from AsyncStorage
        await AsyncStorage.removeItem("token");
        return { message: "User successfully logged out" };  // Return success message
    } catch (error) {
        handleError(error);  // Handle error
    }
};

// Export the functions
export { loginUser, registerUser, forgotPassword, resetPassword, logoutUser };