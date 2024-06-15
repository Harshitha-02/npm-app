import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db, firebaseConfig } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const BusinessAccountScreen = () => {
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+91\d{10}$/;
    const plainPhoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone) || plainPhoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const createUserAccount = async () => {
    if (!username || !password || !input) {
      Alert.alert('Missing Information', 'Please enter a username, email/phone number, and password.');
      return;
    }
    
    try {
      let userCredential;
      let userEmail = null;
      let userPhone = null;

      if (validatePhoneNumber(input)) {
        userEmail = `${input.replace('+', '')}@example.com`;
        userPhone = input;
      } else if (validateEmail(input)) {
        userEmail = input;
      } else {
        Alert.alert('Invalid Input', 'Please enter a valid email or phone number.');
        return;
      }

      // Create user account
      userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);

      // Update user profile with username
      await updateProfile(userCredential.user, { displayName: username });

      // Determine user type (vendor)
      const userType = 'vendor';

      // Add user to Firestore collection with document ID as UID
      await setDoc(doc(db, 'vendors', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userEmail,
        phone: userPhone,
        displayName: username,
        type: userType,
      });

      console.log('User account created & signed in');
      navigation.navigate('Vhome', {
        user: {
          uid: userCredential.user.uid,
          email: userEmail,
          phone: userPhone,
          displayName: username,
          type: userType,
        },
      });
    } catch (error) {
      console.error('Error creating user account:', error);
      Alert.alert('Error', 'Failed to create user account. Please try again.');
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate('SigninScreen');
  };

  const navigateToBusinessAccount = () => {
    navigation.navigate('SignupScreen');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../images/logo.png')} // Make sure to replace with the actual path to your logo
        style={styles.logo}
      />
      <Text style={styles.joinCommunity}>Set up your business</Text>
      <Text style={styles.startDemo}>Start your demo version</Text>
      <Text style={styles.text}>Name</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#8896AB"
          style={styles.input}
        />
      </View>
      <Text style={styles.text}>Email/Phone No.</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email or Phone Number"
          value={input}
          onChangeText={setInput}
          placeholderTextColor="#8896AB"
          style={styles.input}
        />
      </View>
      <Text style={styles.text}>Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#8896AB"
          style={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={createUserAccount}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Sign Up</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={navigateToSignIn}>
          <Text style={styles.signIn}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={navigateToBusinessAccount}>
        <Text style={styles.createBusinessAccount}>Create an account</Text>
      </TouchableOpacity>
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
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginBottom: 20,
  },
  joinCommunity: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  startDemo: {
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
    marginBottom: 5,
  },
  input: {
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#22C55E',
    padding: 13,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: 'white',
  },
  signIn: {
    color: '#22C55E',
  },
  createBusinessAccount: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  infoText: {
    color: '#8896AB',
    fontSize: 12,
    textAlign: 'left',
    marginBottom: 30,
  },  
});

export default BusinessAccountScreen;
