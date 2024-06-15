import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from 'firebase/firestore';

const SignUpScreen = () => {
  const [input, setInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
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

  const proceedToCreateAccount = () => {
    if (validateEmail(input) || validatePhoneNumber(input)) {
      setIsVerified(true);
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid email or phone number.');
    }
  };

  const createUserAccount = async () => {
    if (!username || !password) {
      Alert.alert('Missing Information', 'Please enter a username and password.');
      return;
    }

    try {
      let userCredential;
      if (validateEmail(input)) {
        userCredential = await createUserWithEmailAndPassword(auth, input, password);
      } else if (validatePhoneNumber(input)) {
        const email = validatePhoneNumber(input) ? `${input}@example.com` : null;
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        Alert.alert('Invalid Input', 'Please enter a valid email or phone number.');
        return;
      }

      await updateProfile(userCredential.user, { displayName: username });

      // Add user to Firestore collection with UID as document ID
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: validateEmail(input) ? input : null,
        phone: validatePhoneNumber(input) ? input : null,
        displayName: username,
      });

      navigation.navigate('Uhome', { user: userCredential.user });
    } catch (error) {
      console.error('Error creating user account:', error);
      Alert.alert('Error', 'Failed to create user account. Please try again.');
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate('SigninScreen');
  };

  const navigateToBusinessAccount = () => {
    navigation.navigate('BusinessAccountScreen');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../images/logo.png')} // Make sure to replace with the actual path to your logo
        style={styles.logo}
      />
      <Text style={styles.joinCommunity}>Join our community</Text>
      <Text style={styles.startDemo}>Start your demo version</Text>
      {!isVerified ? (
        <>
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
          <TouchableOpacity style={styles.button} onPress={proceedToCreateAccount}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
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
        </>
      )}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={navigateToSignIn}>
          <Text style={styles.signIn}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={navigateToBusinessAccount}>
        <Text style={styles.createBusinessAccount}>Create a business account</Text>
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

export default SignUpScreen;
