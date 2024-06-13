import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this path matches your actual file structure

const InventoryScreen = ({ navigation, user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, `vendors/${user.uid}/products`)), (querySnapshot) => {
      const fetchedProducts = [];
      querySnapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() });
      });
      setProducts(fetchedProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const navigateToAddProduct = () => {
    navigation.navigate('AddProductScreen', { user });
  };

  const navigateToEditProduct = (productId) => {
    console.log(`Product ID clicked: ${productId}`);
    navigation.navigate('EditProductScreen', { user, productId });
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <TouchableOpacity onPress={() => {
          console.log(`Edit button pressed for product: ${item.id}`);
          navigateToEditProduct(item.id);
        }}
        style={styles.editButton}>
        <Image source={require('../../images/edit.png')} style={styles.editIcon} />
      </TouchableOpacity>
      <View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDetails}>{item.description}</Text>
        <Text style={styles.productDetails}>Quantity: {item.quantity}</Text>
        <Text style={styles.productDetails}>Price: ${item.price}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <ImageBackground source={require('../../images/homebg.png')} style={styles.backgroundImage}>
          <Image source={require('../../images/logo.png')} style={styles.logo} />
        </ImageBackground>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search products..."
          style={styles.searchInput}
          placeholderTextColor="#999"
          underlineColorAndroid="transparent"
        />
      </View>

      <View style={styles.productsSection}>
        <Text style={styles.productsHeading}>Products You Sell</Text>

        {products.length === 0 ? (
          <Text>No products found.</Text>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 10 }}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={navigateToAddProduct}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    marginTop: 30,
  },
  searchBox: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  productsHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#3F51B5',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  productItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row', // Added for aligning edit icon
    alignItems: 'center', // Added for aligning edit icon
  },
  editButton: {
    padding: 8,
    marginRight: 10,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#3F51B5', // Adjust color as needed
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default InventoryScreen;
