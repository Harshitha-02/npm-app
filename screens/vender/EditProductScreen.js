import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this path matches your actual file structure

const EditProductScreen = ({ route, navigation }) => {
  const { user, productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, `vendors/${user.uid}/products`, productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [user.uid, productId]);

  const handleSave = async () => {
    if (!product.name || !product.description || isNaN(product.quantity) || isNaN(product.price)) {
      alert('Please enter valid product details.');
      return;
    }

    try {
      // Update product in the vendor's products subcollection
      const vendorDocRef = doc(db, `vendors/${user.uid}/products`, productId);
      await updateDoc(vendorDocRef, {
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
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
      });

      console.log('Product updated in global products collection.');

      // Navigate back to previous screen (inventory or product list)
      navigation.goBack();
    } catch (error) {
      console.error('Error updating product:', error);
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
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
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
