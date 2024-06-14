import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { setDoc, doc, getDoc, collection } from 'firebase/firestore';
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
  const [isEditing, setIsEditing] = useState(false); // State for editing mode

  useEffect(() => {
    checkExistingAddress();
  }, []);

  const checkExistingAddress = async () => {
    try {
      if (!user || !user.uid) {
        console.error('User information is missing or invalid');
        return;
      }

      const shopDocRef = doc(db, 'npmshops', user.uid);
      const shopDoc = await getDoc(shopDocRef);
      if (shopDoc.exists()) {
        const shopData = shopDoc.data();
        setShopName(shopData.shopName);
        setShopAddress(shopData.shopAddress);
        setStreet(shopData.street);
        setCity(shopData.city);
        setRegion(shopData.region);
        setPostalCode(shopData.postalCode);
        setCountry(shopData.country);
        setLocality(shopData.locality);
        setFormattedAddress(shopData.formattedAddress);
        setIsEditing(false);
      } else {
        getLocation();
      }
    } catch (error) {
      console.error('Error checking existing address:', error);
    }
  };

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
        const { street, city, region, postalCode, country, district } = geocode[0];

        setStreet(street || '');
        setCity(city || '');
        setRegion(region || '');
        setPostalCode(postalCode || '');
        setCountry(country || '');
        setLocality(district || '');

        // Set formatted address
        const formattedAddr = `${street || ''}, ${district || ''}, ${city || ''}, ${region || ''}, ${postalCode || ''}, ${country || ''}`;
        setFormattedAddress(formattedAddr);

        setShopAddress(formattedAddr);
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

      // Update or add to npmshops collection
      const npmShopsCollectionRef = doc(db, 'npmshops', user.uid);
      await setDoc(npmShopsCollectionRef, {
        vendorId: user.uid,
        userName: user.displayName, // Store the user's name
        shopName,
        shopAddress,
        street,
        city,
        region,
        postalCode,
        country,
        locality,
        formattedAddress, // Save formatted address to Firestore
      });

      // Log the details to console
      console.log('Shop details:', { shopName, shopAddress, userName: user.displayName, formattedAddress });

      // Navigate back to ProfileScreen
      navigation.goBack();
    } catch (error) {
      console.error('Error updating shop details:', error);
    }
  };

  const handleEdit = async () => {
    setIsEditing(true);
    await getLocation(); // Get location when edit button is clicked
  };

  return (
    <View style={styles.container}>
      {!isEditing ? (
        <View>
          <Text style={styles.label}>Shop Name: {shopName}</Text>
          <Text style={styles.label}>Address: {shopAddress}</Text>
          <Text style={styles.label}>Street: {street}</Text>
          <Text style={styles.label}>Locality: {locality}</Text>
          <Text style={styles.label}>City: {city}</Text>
          <Text style={styles.label}>Region: {region}</Text>
          <Text style={styles.label}>Postal Code: {postalCode}</Text>
          <Text style={styles.label}>Country: {country}</Text>
          <Button title="Edit" onPress={handleEdit} />
        </View>
      ) : (
        <View>
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
      )}
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
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ShopDetailsScreen;
