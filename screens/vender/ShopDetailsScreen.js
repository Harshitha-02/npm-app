import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateDoc, doc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const ShopDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params;
  console.log('User details in shopdetailsscreen:', user);

  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [locality, setLocality] = useState('');
  const [formattedAddress, setFormattedAddress] = useState(''); // State for formatted address

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log('Geocode data:', geocode);

      if (geocode.length > 0) {
        const { street, city, region, postalCode, country, formattedAddress } = geocode[0];

        setStreet(street || '');
        setCity(city || '');
        setRegion(region || '');
        setPostalCode(postalCode || '');
        setCountry(country || '');
        setLocality(locality || '');

        // Set formatted address
        setFormattedAddress(formattedAddress || '');

        setShopAddress(`${street || ''}, ${locality || ''}, ${city || ''}, ${region || ''}, ${postalCode || ''}, ${country || ''}`);
        
        // Optionally, inform the user or provide a fallback mechanism if district is not found
        
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const updateShopDetails = async () => {
    try {
      if (!user || !user.uid) {
        console.error('User information is missing or invalid');
        return;
      }

      const vendorRef = doc(db, 'vendors', user.uid);
      await updateDoc(vendorRef, {
        shopName,
        shopAddress,
        userName: user.displayName, // Store the user's name
        formattedAddress, // Save formatted address to Firestore
      });

      // Log the details to console
      console.log('Shop details:', { shopName, shopAddress, userName: user.displayName, formattedAddress });

      // Add to npmshops collection
      const npmShopsCollectionRef = collection(db, 'npmshops');
      await addDoc(npmShopsCollectionRef, {
        vendorId: user.uid,
        userName: user.displayName, // Store the user's name
        shopName,
        shopAddress,
        formattedAddress, // Save formatted address to Firestore
      });

      // Navigate back to ProfileScreen
      navigation.goBack();
    } catch (error) {
      console.error('Error updating shop details:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Shop Name"
        value={shopName}
        onChangeText={setShopName}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Street Address"
        value={street}
        onChangeText={setStreet}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Locality / District"
        value={locality}
        onChangeText={setLocality}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="State / Province / Region"
        value={region}
        onChangeText={setRegion}
      />
      <TextInput
        style={styles.input}
        placeholder="Postal Code"
        value={postalCode}
        onChangeText={setPostalCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />
      <Button title="Save Details" onPress={updateShopDetails} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default ShopDetailsScreen;
