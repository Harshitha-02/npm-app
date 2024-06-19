import React from 'react';
import { View, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product, user, shopId } = route.params;
  console.log('ProductDetailsScreen received props:', { product, user, shopId });

  const addToCart = async () => {
    try {
      const cartDocRef = doc(db, `users/${user.uid}/cart/${product.id}`);
      await setDoc(cartDocRef, {
        productId: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        shopId: shopId,
      });
      Alert.alert('Added to cart', 'The product has been added to your cart.');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageURL }} style={styles.image} />
      <Text style={styles.heading}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>Price: ${product.price}</Text>
      <Button title="Add to Cart" onPress={addToCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300, // Adjust height as needed
    resizeMode: 'cover',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 10,
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ADE80',
    marginBottom: 20,
  },
});

export default ProductDetailsScreen;
