import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Adjust path as per your actual file structure
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming FontAwesome icons are used

const ProductsListScreen = ({ navigation, route }) => {
  const { shopId, user } = route.params; // Assuming you're passing shopId and user from navigation

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
    console.log('User Details:', user); // Log user details
  }, []);

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, `npmshops/${shopId}/products`);
      const productsSnapshot = await getDocs(productsRef);
      const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched Products:', productsList);
      setProducts(productsList);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const wishlistRef = collection(db, `users/${user.uid}/wishlist`);
      const wishlistSnapshot = await getDocs(wishlistRef);
      const wishlistItems = wishlistSnapshot.docs.map(doc => doc.id); // Assuming you want to store only document IDs in the state
      console.log('Fetched Wishlist:', wishlistItems);
      setWishlist(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const wishlistDocRef = doc(db, `users/${user.uid}/wishlist/${productId}`);
      const docSnapshot = await getDoc(wishlistDocRef);
  
      if (docSnapshot.exists()) {
        // Product already in wishlist, remove it
        await deleteDoc(wishlistDocRef);
        setWishlist(wishlist.filter(item => item !== productId));
        console.log('Removed from wishlist:', productId);
      } else {
        // Fetch product details
        const productDocRef = doc(db, `npmshops/${shopId}/products/${productId}`);
        const productSnapshot = await getDoc(productDocRef);
        
        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          // Store product details in wishlist
          await setDoc(wishlistDocRef, {
            productId,
            name: productData.name,
            description: productData.description,
            price: productData.price,
          });
          setWishlist([...wishlist, productId]);
          console.log('Added to wishlist:', productId);
        } else {
          console.error('Product does not exist.');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <TouchableOpacity onPress={() => toggleWishlist(item.id)}>
              <Icon name={wishlist.includes(item.id) ? 'heart' : 'heart-o'} size={30} color={wishlist.includes(item.id) ? 'red' : 'black'} />
            </TouchableOpacity>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDescription}>{item.description}</Text>
              <Text style={styles.productPrice}>Price: ${item.price}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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

export default ProductsListScreen;
