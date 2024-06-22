// AddressScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, Button } from 'react-native';
import * as Location from 'expo-location';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const AddressScreen = ({ route, navigation }) => {
  const { user } = route.params;

  const [houseNumber, setHouseNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const [formattedAddress, setFormattedAddress] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        let geocode = await Location.reverseGeocodeAsync(location.coords);

        if (geocode.length > 0) {
          const address = geocode[0];
          console.log('Fetched address:', address);

          // Set individual components
          setStreet(address.street || '');
          setDistrict(address.district || ''); // Use subregion for district
          setCity(address.city || '');
          setPostalCode(address.postalCode || '');
          setState(address.region || ''); // Use region for state
          setCountry(address.country || '');

          // Set formatted address
          const formatted = `${address.street || ''}, ${address.district || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`;
          setFormattedAddress(formatted);
        }
      } catch (error) {
        console.error('Error getting location', error);
        Alert.alert('Error getting location', error.message);
      }
    };

    fetchLocation();
  }, []);

  const saveAddress = async () => {
    try {
      setIsSaving(true);

      // Construct address object
      const addressData = {
        houseNumber,
        floor,
        street,
        district,
        city,
        postalCode,
        state,
        country,
        formattedAddress, // Include formatted address
      };

      // Save to Firestore under users > uid > address
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { address: addressData }, { merge: true });

      setIsSaving(false);
      Alert.alert('Address Saved Successfully');

      navigation.goBack();
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error saving address:', error.message);
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Enter Your Address</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>House or Flat Number</Text>
        <TextInput
          style={styles.input}
          value={houseNumber}
          onChangeText={setHouseNumber}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Floor</Text>
        <TextInput
          style={styles.input}
          value={floor}
          onChangeText={setFloor}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Street</Text>
        <TextInput
          style={styles.input}
          value={street}
          onChangeText={setStreet}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Locality</Text>
        <TextInput
          style={styles.input}
          value={district}
          onChangeText={setDistrict}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Postal Code</Text>
        <TextInput
          style={styles.input}
          value={postalCode}
          onChangeText={setPostalCode}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setState}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={country}
          onChangeText={setCountry}
        />
      </View>
      <Button
        title="Save Address"
        onPress={saveAddress}
        disabled={isSaving || !houseNumber || !street || !city || !country}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
});

export default AddressScreen;
