import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const EditProductScreen = ({ route, navigation }) => {
  const { user, productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, `vendors/${user.uid}/products`, productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const productData = docSnap.data();
        console.log('Fetched product data:', productData);
        setProduct({ id: docSnap.id, ...productData });
        setImage(productData.imageURL); // Set initial image
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [user.uid, productId]);

  const pickImage = async () => {
    console.log('Opening image picker...');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log('Image picker result:', result);
  
    if (!result.cancelled) {
      const pickedImageUri = result.assets[0].uri;
      console.log('Image picked:', pickedImageUri);
      setImage(pickedImageUri);
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

  const handleSave = async () => {
    if (!product.name || !product.description || isNaN(product.quantity) || isNaN(product.price)) {
      alert('Please enter valid product details.');
      return;
    }

    setUploading(true);

    try {
      let imageURL = product.imageURL;

      if (image && image !== product.imageURL) {
        // Upload the new image to Firebase Storage
        imageURL = await uploadImage(image);
      }

      // Update product in the vendor's products subcollection
      const vendorDocRef = doc(db, `vendors/${user.uid}/products`, productId);
      await updateDoc(vendorDocRef, {
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        imageURL: imageURL,
      });

      console.log('Product updated in vendor\'s products subcollection.');

      // Update product in the global products collection
      const globalProductRef = doc(db, 'products', productId);
      await setDoc(globalProductRef, {
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        vendorId: user.uid,
        imageURL: imageURL,
      });

      console.log('Product updated in global products collection.');

      // Navigate back to previous screen (inventory or product list)
      navigation.goBack();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading product...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={product.name}
        onChangeText={(text) => setProduct({ ...product, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={product.description}
        onChangeText={(text) => setProduct({ ...product, description: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={product.quantity.toString()}
        keyboardType="numeric"
        onChangeText={(text) => {
          const numericValue = parseInt(text.replace(/[^0-9]/g, ''));
          setProduct({ ...product, quantity: isNaN(numericValue) ? '' : numericValue });
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={product.price.toString()}
        keyboardType="numeric"
        onChangeText={(text) => {
          const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
          setProduct({ ...product, price: isNaN(numericValue) ? '' : numericValue });
        }}
      />
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Image source={{ uri: product.imageURL }} style={styles.image} />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={uploading}>
        <Text style={styles.saveButtonText}>{uploading ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  imagePicker: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  saveButton: {
    backgroundColor: '#3F51B5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProductScreen;
