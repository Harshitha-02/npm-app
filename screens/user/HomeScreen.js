import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground, Image, TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this path matches your actual file structure
import ProductsListScreen from './ProductsListScreen';
import ProductDetailsScreen from './ProductDetailsScreen';

const HomeStack = createStackNavigator();

const HomeScreenComponent = ({ navigation, user }) => {
  const [npmShops, setNpmShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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
    navigation.navigate('ProductsList', { shopId, user });
  };

  const handleSearch = () => {
    // Implement your search functionality here based on searchQuery state
    console.log('Search query:', searchQuery);
    // You can filter npmShops based on searchQuery and update the list accordingly
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../images/homebg.png')} // Replace with your actual background image
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.topSection}>
          <Image
            source={require('../../images/logo.png')} // Replace with your actual logo image
            style={styles.logo}
          />
          
        </View>
      </ImageBackground>
      <Text style={styles.greeting}>Hi {user.displayName},</Text>
      <Text style={styles.welcomeBack}>Welcome back!</Text>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search NPM Shops"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={handleSearch}
        />
      </View>

      <View style={styles.bottomSection}>
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
    </View>
  );
};

const HomeScreen = ({ user }) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Home" 
        options={{ headerShown: false }}
      >
        {props => <HomeScreenComponent {...props} user={user} />}
      </HomeStack.Screen>
      <HomeStack.Screen 
        name="ProductsList" 
        component={ProductsListScreen} 
        options={{ headerShown: true }} // Ensure header is shown
      />
      <HomeStack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen} 
        options={{ headerShown: true }} // Ensure header is shown
      />
    </HomeStack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  bgImage: {
    flex: 0.3, // 30% of the screen height
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: -40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
  },
  welcomeBack: {
    fontSize: 18,
    marginLeft: 20,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 3,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  searchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#22C55E',
    borderRadius: 10,
    marginLeft: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomSection: {
    flex: 0.7, // 70% of the screen height
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
