import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this path matches your actual file structure

const InventoryScreen = ({ navigation, user }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, `vendors/${user.uid}/products`)), (querySnapshot) => {
      const fetchedProducts = [];
      querySnapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() });
      });
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const navigateToAddProduct = () => {
    navigation.navigate('AddProductScreen', { user });
  };

  const navigateToEditProduct = (productId) => {
    console.log(`Product ID clicked: ${productId}`);
    navigation.navigate('EditProductScreen', { user, productId });
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <View>
        {item.imageURL ? (
          <Image
            source={{ uri: item.imageURL }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Text>No Product Image</Text>
          </View>
        )}
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDetails}>Rs.{item.price}</Text>
      </View>
      <TouchableOpacity onPress={() => {
          console.log(`Edit button pressed for product: ${item.id}`);
          navigateToEditProduct(item.id);
        }}
        style={styles.editButton}>
        <Image source={require('../../images/edit.png')} style={styles.editIcon} />
      </TouchableOpacity>
    </View>
  );

  const renderProductRow = ({ item }) => (
    <View style={styles.productRow}>
      {item.map((product, index) => (
        <View key={index} style={styles.productContainer}>
          {renderProductItem({ item: product })}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  const groupedProducts = [];
  for (let i = 0; i < filteredProducts.length; i += 2) {
    groupedProducts.push(filteredProducts.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <ImageBackground source={require('../../images/homebg.png')} style={styles.backgroundImage}>
          <Image source={require('../../images/logo.png')} style={styles.logo} />
        </ImageBackground>
      </View>

      <View style={styles.searchBox}>
        <Image source={require('../../images/search.png')} style={styles.searchIcon} />
        <TextInput
          placeholder="Search products..."
          style={styles.searchInput}
          placeholderTextColor="#999"
          underlineColorAndroid="transparent"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.productsSection}>
        <Text style={styles.productsHeading}>Products You Sell</Text>

        {filteredProducts.length === 0 ? (
          <Text>No products found.</Text>
        ) : (
          <FlatList
            data={groupedProducts}
            renderItem={renderProductRow}
            keyExtractor={(item, index) => index.toString()}
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
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    marginTop: 3,
    marginLeft: -5,
    tintColor: '#999',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  productImage: {
    width: 130,
    height: 170,
    borderRadius: 10,
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  productsHeading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4ADE80',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'semibold',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productContainer: {
    flex: 1,
    maxWidth: '49.5%', // Adjust as needed to avoid stretching
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    height: 240,
    width: 155,
  },
  editButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    padding: 8,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#3A3A3A',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: 5,
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
  },
  noImageContainer: {
    width: 130,
    height: 170,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
});

export default InventoryScreen;
