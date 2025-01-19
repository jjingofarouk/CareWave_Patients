import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign up
  const [loading, setLoading] = useState(false); // Loading state to show activity indicator

  const handleAuthentication = async () => {
    // Basic validation for email and password
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter both email and password');
    }

    setLoading(true); // Show loading indicator

    try {
      const response = await fetch(isLogin ? 'http://192.168.1.5:3000/login' : 'http://192.168.1.5:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send the email and password to the backend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication error');
      }

      const { token } = data;

      // Store the token (e.g., in AsyncStorage) for future requests
      await AsyncStorage.setItem('authToken', token); // Store the token

      // Navigate to the next screen (e.g., Main screen)
      navigation.replace('Main');
    } catch (error) {
      // Handle network error
      if (error.name === 'TypeError') {
        Alert.alert('Network Error', 'Please check your internet connection.');
      } else {
        Alert.alert(isLogin ? 'Login Failed' : 'Sign Up Failed', error.message);
      }
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isLogin ? 'Log In' : 'Sign Up'}</Text>

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#A4A4A4"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A4A4A4"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleAuthentication}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
        )}
      </TouchableOpacity>

      {/* Toggle between login and sign up */}
      <Text style={styles.toggleText}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Text
          style={styles.link}
          onPress={() => setIsLogin(!isLogin)} // Toggle between Login/SignUp
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF7043', // Accent color (orange)
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  toggleText: {
    textAlign: 'center',
    color: '#333',
  },
  link: {
    color: '#FF7043', // Accent color (orange)
    fontWeight: 'bold',
  },
});

export default Login;
