import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this path matches your actual file structure

const HomeScreen = ({ navigation, user }) => {
  const [npmShops, setNpmShops] = useState([]);

  useEffect(() => {
    fetchNpmShops();
  }, []);

  const fetchNpmShops = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'npmshops'));
      const shops = [];
      querySnapshot.forEach((doc) => {
        shops.push({ id: doc.id, ...doc.data() });
      });
      setNpmShops(shops);
    } catch (error) {
      console.error('Error fetching npm shops:', error);
    }
  };

  const navigateToProductsList = (shopId) => {
    console.log('Clicked shop ID:', shopId); // Log the ID of the clicked shop
    navigation.navigate('ProductsListScreen', { shopId, user });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>NPM Shops</Text>
      <FlatList
        data={npmShops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.shopItem}
            onPress={() => navigateToProductsList(item.id)}
          >
            <Text style={styles.shopName}>{item.shopName}</Text>
            <Text style={styles.shopAddress}>{item.shopAddress}</Text>
          </TouchableOpacity>
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
  shopItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shopAddress: {
    fontSize: 14,
    color: '#888888',
  },
});

export default HomeScreen;
