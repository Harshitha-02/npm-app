import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Adjust path as per your actual file structure
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming FontAwesome icons are used

const WishlistScreen = ({ user }) => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fetchWishlistProducts(); // Initialize listener
    return () => unsubscribe(); // Unsubscribe when component unmounts
  }, []);

  const fetchWishlistProducts = () => {
    const wishlistRef = collection(db, `users/${user.uid}/wishlist`);

    // Set up snapshot listener for real-time updates
    return onSnapshot(wishlistRef, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWishlistProducts(products);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching wishlist products:', error);
      setLoading(false);
    });
  };

  const toggleWishlist = async (productId) => {
    try {
      const wishlistDocRef = doc(db, `users/${user.uid}/wishlist/${productId}`);
      const docSnapshot = await getDoc(wishlistDocRef);

      if (docSnapshot.exists()) {
        await deleteDoc(wishlistDocRef);
        console.log('Removed from wishlist:', productId);
      } else {
        // Here you would add the product details to the wishlist subcollection
        // This example assumes the product details are available elsewhere and added directly
        const productToAdd = { productId, name: 'Sample Product', description: 'Sample Description', price: 10.0 };
        await setDoc(wishlistDocRef, productToAdd);
        console.log('Added to wishlist:', productId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {wishlistProducts.length === 0 ? (
        <Text style={styles.text}>Your wishlist is empty.</Text>
      ) : (
        <FlatList
          data={wishlistProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <TouchableOpacity onPress={() => toggleWishlist(item.id)}>
                <Icon
                  name={wishlistProducts.some(product => product.id === item.id) ? 'heart' : 'heart-o'}
                  size={30}
                  color={wishlistProducts.some(product => product.id === item.id) ? 'red' : 'black'}
                />
              </TouchableOpacity>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDescription}>{item.description}</Text>
                <Text style={styles.productPrice}>Price: ${item.price}</Text>
                {/* Render other product details here */}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ADE80',
  },
});

export default WishlistScreen;
