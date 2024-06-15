import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db, firebaseConfig } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';

const SignInScreen = () => {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+91\d{10}$/;
    const plainPhoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone) || plainPhoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    let email = input;

    if (validatePhoneNumber(input)) {
      email = `${input}@example.com`;
    } else if (!validateEmail(input)) {
      Alert.alert('Invalid Input', 'Please enter a valid email or phone number.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Signed in user:', user);

      const userId = user.uid;
      console.log('User ID (UID):', userId);

      const vendorsRef = collection(db, 'vendors');
      const usersRef = collection(db, 'users');

      const vendorQuery = query(vendorsRef, where('uid', '==', userId));
      const userQuery = query(usersRef, where('uid', '==', userId));

      console.log('Querying vendors collection...');
      const vendorSnapshot = await getDocs(vendorQuery);
      console.log('Vendor snapshot:', vendorSnapshot.docs.map(doc => doc.data()));

      console.log('Querying users collection...');
      const userSnapshot = await getDocs(userQuery);
      console.log('User snapshot:', userSnapshot.docs.map(doc => doc.data()));

      if (!vendorSnapshot.empty) {
        console.log('User is a vendor');
        navigation.navigate('Vhome', { user: user });
      } else if (!userSnapshot.empty) {
        console.log('User is a regular user');
        navigation.navigate('Uhome', { user: user });
      } else {
        console.log('User not found in any collection');
        Alert.alert('Error', 'User not found. Please contact support.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'Failed to sign in. Please check your email and password.');
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignupScreen'); // Corrected screen name
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen'); // Add navigation to Forgot Password screen
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../images/logo.png')} // Make sure to replace with the actual path to your logo
        style={styles.logo}
      />
      <Text style={styles.title}>Sign in to your account</Text>
      <Text style={styles.subtitle}>Start your journey with our product</Text>
      <Text style={styles.text}>Email/Phone No.</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email or Phone Number"
          value={input}
          onChangeText={setInput}
          keyboardType={validatePhoneNumber(input) ? 'phone-pad' : 'email-address'}
          placeholderTextColor="#8896AB"
          style={styles.input}
        />
      </View>
      <Text style={styles.text}>Password:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#8896AB"
          style={styles.input}
        />
        <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIconContainer}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#8896AB"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={navigateToForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Sign In</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={navigateToSignUp}>
          <Text style={styles.signUp}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#19263C',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    bottom: -10,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#8896AB',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    color: 'white',
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#22C55E',
    textAlign: 'right',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#22C55E',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: 'white',
  },
  signUp: {
    color: '#22C55E',
  },
});

export default SignInScreen;
