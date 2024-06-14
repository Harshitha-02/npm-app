import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { updateDoc, doc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this path matches your actual file structure
import { useRoute, useNavigation } from '@react-navigation/native';

const ShopDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params;
  console.log('User details in shopdetailsscreen:', user);

  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');

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
      });

      // Log the details to console
      console.log('Shop details:', { shopName, shopAddress, userName: user.displayName });

      // Add to npmshops collection
      const npmShopsCollectionRef = collection(db, 'npmshops');
      await addDoc(npmShopsCollectionRef, {
        vendorId: user.uid,
        userName: user.displayName, // Store the user's name
        shopName,
        shopAddress,
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
        placeholder="Shop Address"
        value={shopAddress}
        onChangeText={setShopAddress}
        multiline
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
