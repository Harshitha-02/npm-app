import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebaseConfig';
import { addDoc, collection, doc } from 'firebase/firestore';

const AddProductScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    console.log('Opening image picker...');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Image picker result:', result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      console.log('Image picked:', uri);
      setImage(uri);
    } else {
      console.log('Image picking cancelled');
    }
  };

  const uploadImage = async (uri) => {
    console.log('Uploading image:', uri);
    try {
      const storage = getStorage();
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log('Blob created:', blob);

      const storageRef = ref(storage, `product_images/${user.uid}/${Date.now()}`);
      const uploadTask = await uploadBytes(storageRef, blob);
      console.log('Image uploaded:', uploadTask);

      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleAddProduct = async () => {
    if (!name || !description || !quantity || !price || !image) {
      alert('Please fill in all fields and add an image.');
      return;
    }

    setUploading(true);

    try {
      console.log('Starting product upload process...');
      const imageURL = await uploadImage(image);

      const productData = {
        name,
        description,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
        imageURL,
      };

      // Add product to the 'products' subcollection under vendor's document in npmshops
      const npmshopsVendorDocRef = doc(db, 'npmshops', user.uid);
      const npmshopsProductsCollectionRef = collection(npmshopsVendorDocRef, 'products');
      const npmshopsNewProductRef = await addDoc(npmshopsProductsCollectionRef, productData);

      console.log('Product added to vendor\'s products in npmshops:', npmshopsNewProductRef.id);

      // Add product to the 'products' subcollection under vendor's document in vendors
      const vendorsVendorDocRef = doc(db, 'vendors', user.uid);
      const vendorsProductsCollectionRef = collection(vendorsVendorDocRef, 'products');
      const vendorsNewProductRef = await addDoc(vendorsProductsCollectionRef, productData);

      console.log('Product added to vendor\'s products in vendors:', vendorsNewProductRef.id);

      // Navigate to inventory screen after adding the product
      console.log('Navigating to Inventory screen...');
      navigation.navigate('InventoryScreen');
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setUploading(false);
      console.log('Product upload process finished');
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

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Pick an Image</Text>
        )}
      </TouchableOpacity>

      <Button title={uploading ? 'Saving...' : 'Save Product'} onPress={handleAddProduct} disabled={uploading} />
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
  imagePicker: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    height: 200,
    marginBottom: 20,
  },
  imagePlaceholder: {
    fontSize: 18,
    color: '#888',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default AddProductScreen;
