import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

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
      <ImageBackground
        source={require('../../images/homebg.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.topSection}>
          <Image
            source={require('../../images/logo.png')}
            style={styles.logo}
          />
        </View>
      </ImageBackground>
      <Text style={styles.greeting}>Your Wishlist</Text>
      {wishlistProducts.length === 0 ? (
        <Text style={styles.text}>Your wishlist is empty.</Text>
      ) : (
        <FlatList
          data={wishlistProducts}
          keyExtractor={(item) => item.id}
          numColumns={2} // Set number of columns
          key={(wishlistProducts.length % 2).toString()} // Force a fresh render when numColumns changes
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <TouchableOpacity style={styles.heartIcon} onPress={() => toggleWishlist(item.id)}>
                <Icon
                  name={wishlistProducts.some(product => product.id === item.id) ? 'heart' : 'heart-o'}
                  size={30}
                  color={wishlistProducts.some(product => product.id === item.id) ? '#4ADE80' : 'black'}
                />
              </TouchableOpacity>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>Rs.{item.price}</Text>
              </View>
              <TouchableOpacity style={styles.cartIcon}>
                <Icon name="shopping-cart" size={30} color="black" />
              </TouchableOpacity>
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
  bgImage: {
    height: height * 0.21, // Set height to 21% of the screen height
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 40,
  },
  logo: {
    width: 70,
    height: 70,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  productItem: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    elevation: 3,
    width: width / 2 - 20, // Adjust width to fit two columns
    height: 220, // Adjust height to match the dimension used in ProductsListScreen
    position: 'relative',
    backgroundColor: '#fff',
  },
  productInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    width: '80%',
    padding: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  cartIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 20,
  },
});

export default WishlistScreen;
