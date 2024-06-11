import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth,db, firebaseConfig } from '../../firebaseConfig';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider, signInWithCredential, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';

const SignUpScreen = () => {
  const [input, setInput] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const recaptchaVerifier = useRef(null);
  const navigation = useNavigation();

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+91\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendVerificationCode = async () => {
    let phoneNumber = input;
  
    // Check if the input is a number
    if (/^\d+$/.test(phoneNumber)) {
      // Check if the input has exactly 10 digits
      if (phoneNumber.length === 10) {
        // Add +91 country code to the phone number
        phoneNumber = `+91${phoneNumber}`;
        setInput(phoneNumber); // Update the input state with the new phone number format
      } else {
        Alert.alert('Invalid Phone Number', 'Please enter a 10-digit phone number.');
        return;
      }
    }
  
    // Validate the phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid phone number in the format +911234567890.'
      );
      return;
    }
  
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      Alert.alert('Code Sent', 'Please check your phone for the verification code.');
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    }
  };
  
  // In the JSX
  {!verificationId && (
    <TouchableOpacity style={styles.button} onPress={sendVerificationCode}>
      <Text style={styles.buttonText}>Send Code</Text>
    </TouchableOpacity>
  )}
  


  const confirmVerificationCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await signInWithCredential(auth, credential);
      setIsVerified(true);
      console.log('Phone number verified');
    } catch (error) {
      console.error('Error verifying verification code:', error);
      Alert.alert('Error', 'Failed to verify verification code. Please try again.');
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
        await updateProfile(userCredential.user, { displayName: username });
        console.log('User account created & signed in with email');
      } else if (validatePhoneNumber(input)) {
        const email = `${input.replace('+', '')}@example.com`;
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        console.log('User account created & signed in with phone number');
      } else {
        Alert.alert('Invalid Input', 'Please enter a valid email or phone number.');
        return;
      }
  
      // Add user to Firestore collection
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName
      });
  
      navigation.navigate('HomePage');
    } catch (error) {
      console.error('Error creating user account:', error);
      Alert.alert('Error', 'Failed to create user account. Please try again.');
    }
  };
  
  const navigateToSignIn = () => {
    navigation.navigate('SigninScreen');
  };

  const navigateToBusinessAccount = () => {
    // Assuming there is a separate screen for creating a business account
    navigation.navigate('BusinessAccountScreen');
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
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

          <Text style={styles.infoText}>
            If you're using a phone number, please make sure to add +91 before the number.
          </Text>


          {validatePhoneNumber(input) ? (
            <TouchableOpacity style={styles.button} onPress={sendVerificationCode}>
              <Text style={styles.buttonText}>Send Code</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => setIsVerified(true)}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          )}
          {verificationId && (
            <>
              <Text style={styles.text}>Enter verification code:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Verification code"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  placeholderTextColor="#8896AB"
                  style={styles.input}
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={confirmVerificationCode}>
                <Text style={styles.buttonText}>Verify Code</Text>
              </TouchableOpacity>
            </>
          )}
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
    marginTop:40,
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