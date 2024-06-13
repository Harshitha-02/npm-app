import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../../firebaseConfig';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

const AddProductScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [imageURL, setImageURL] = useState('');

  const handleAddProduct = async () => {
    console.log('User Details:', user);
    console.log('Input Values:', { name, description, quantity, price, imageURL });

    try {
      // Step 1: Add product to the 'products' collection
      const productsCollectionRef = collection(db, 'products');
      const newProductRef = await addDoc(productsCollectionRef, {
        name,
        description,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
        imageURL,
        vendorId: user.uid, // Add vendorId to associate product with vendor
      });

      console.log('Product added to products collection:', newProductRef.id);

      // Step 2: Add product to the 'products' subcollection under vendor's document
      const vendorDocRef = doc(db, 'vendors', user.uid);
      const vendorProductsCollectionRef = collection(vendorDocRef, 'products');
      const vendorProductRef = await addDoc(vendorProductsCollectionRef, {
        name,
        description,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
        imageURL,
        productId: newProductRef.id, // Add productId to link with product document in 'products' collection
      });

      console.log('Product added to vendor\'s products:', vendorProductRef.id);

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
