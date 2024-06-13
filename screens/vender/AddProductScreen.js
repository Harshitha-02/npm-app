import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../../firebaseConfig'; // Ensure this path matches your actual file structure
import { addDoc, collection, doc } from 'firebase/firestore';

const AddProductScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [imageURL, setImageURL] = useState('');

  const handleAddProduct = async () => {
    // Log user details and input values for verification
    console.log('User Details:', user);
    console.log('Input Values:', { name, description, quantity, price, imageURL });

    try {
      // Access the 'products' collection under 'vendors/{user.uid}' in Firestore
      const vendorDocRef = doc(db, 'vendors', user.uid);
      const productsCollectionRef = collection(vendorDocRef, 'products');

      // Add a new document with the product details
      await addDoc(productsCollectionRef, {
        name,
        description,
        quantity: parseInt(quantity, 10), // ParseInt with base 10
        price: parseFloat(price), // ParseFloat for accurate decimal handling
        imageURL,
      });

      console.log('Product added successfully!');

      // Navigate to inventory screen after adding the product
      navigation.navigate('Inventory');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Product</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageURL}
        onChangeText={setImageURL}
      />
      
      <Button title="Save Product" onPress={handleAddProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddProductScreen;
