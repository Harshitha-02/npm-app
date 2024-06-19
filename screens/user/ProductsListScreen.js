import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const ProductsListScreen = ({ navigation, route }) => {
  const { shopId, user } = route.params;
  console.log('ProductsListScreen received props:', { shopId, user });

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
    console.log('User Details:', user);
  }, []);

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, `npmshops/${shopId}/products`);
      const productsSnapshot = await getDocs(productsRef);
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        imageUrl: doc.data().imageURL, // Assuming imageUrl is stored in Firestore
      }));
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
      const wishlistItems = wishlistSnapshot.docs.map(doc => doc.id);
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
        await deleteDoc(wishlistDocRef);
        setWishlist(wishlist.filter(item => item !== productId));
        console.log('Removed from wishlist:', productId);
      } else {
        const productDocRef = doc(db, `npmshops/${shopId}/products/${productId}`);
        const productSnapshot = await getDoc(productDocRef);

        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
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

  const navigateToProductDetails = (product) => {
    console.log('Navigating to ProductDetailsScreen with:', { product, user, shopId });
    navigation.navigate('ProductDetails', { product, user, shopId });
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToProductDetails(item)} style={styles.productItem}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <TouchableOpacity onPress={() => toggleWishlist(item.id)} style={styles.iconContainer}>
          <Icon
            name={wishlist.includes(item.id) ? 'heart' : 'heart-o'}
            size={20}
            color={wishlist.includes(item.id) ? 'red' : 'black'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>Price: ${item.price}</Text>
        <TouchableOpacity style={styles.cartIconContainer}>
          <Icon name="shopping-cart" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  productList: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'row', // Ensure items are aligned in rows
    flexWrap: 'wrap', // Wrap items to the next row when needed
  },
  productItem: {
    width: '50%', // Each item takes 50% of the screen width
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    marginVertical: 10,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 20,
  },
  productDetails: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ADE80',
  },
  cartIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4ADE80',
    padding: 8,
    borderRadius: 20,
  },
});

export default ProductsListScreen;
