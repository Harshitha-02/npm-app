import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
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
            imageUrl: productData.imageURL,
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
            size={21}
            color={wishlist.includes(item.id) ? '#4ADE80' : 'black'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>Price: Rs{item.price}</Text>
        <TouchableOpacity style={styles.cartIconContainer}>
          <Icon name="shopping-cart" size={21} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <TextInput 
        style={styles.searchBox}
        placeholder="Search products..."
      />
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingTop: 40, // Increased padding top for header
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  searchBox: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  productList: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'row', // Ensure items are aligned in rows
    flexWrap: 'wrap', // Wrap items to the next row when needed
  },
  productItem: {
    width: width / 2 - 20, // Each item takes 50% of the screen width minus margin
    margin: 5, // Adds space around the item
    borderWidth: 1, // Lighter border
    borderColor: '#ccc', // Light grey border color
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    margin: 7, // Adds space around the image
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
    padding: 5,
    borderRadius: 20,
  },
  productDetails: {
    paddingHorizontal: 10,
    paddingVertical: 5, // Reduce vertical padding
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 20,
  },
});

export default ProductsListScreen;
