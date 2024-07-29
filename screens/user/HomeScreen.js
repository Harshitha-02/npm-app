import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground, Image, TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import * as Location from 'expo-location';
import ProductsListScreen from './ProductsListScreen';
import ProductDetailsScreen from './ProductDetailsScreen';
import haversine from 'haversine';

const HomeStack = createStackNavigator();

const HomeScreenComponent = ({ navigation, user }) => {
  const [npmShops, setNpmShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchNpmShops();
    getUserLocation();
  }, []);

  useEffect(() => {
    filterShops();
  }, [searchQuery, npmShops]);

  const fetchNpmShops = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'npmshops'));
    const shops = [];
    querySnapshot.forEach((doc) => {
      shops.push({ id: doc.id, ...doc.data() });
    });

    if (userLocation) {
      // Calculate distances and sort by distance
      const shopsWithDistance = shops.map(shop => {
        const distance = calculateDistance(shop);
        console.log(`Shop: ${shop.shopName}, Distance: ${distance}`); // Debugging line
        return {
          ...shop,
          distance
        };
      });
      shopsWithDistance.sort((a, b) => a.distance - b.distance);
      setNpmShops(shopsWithDistance);
    } else {
      setNpmShops(shops); // Fallback if userLocation is not available
    }
  } catch (error) {
    console.error('Error fetching npm shops:', error);
  }
};

const calculateDistance = (shop) => {
  if (!userLocation || !shop.latitude || !shop.longitude) {
    console.log(`No location or shop coordinates available for shop: ${shop.shopName}`); // Debugging line
    return Infinity;
  }

  const shopLocation = {
    latitude: shop.latitude,
    longitude: shop.longitude,
  };

  const distance = haversine(userLocation, shopLocation, { unit: 'kilometer' });
  console.log(`User Location: ${JSON.stringify(userLocation)}, Shop Location: ${JSON.stringify(shopLocation)}, Distance: ${distance}`); // Debugging line
  return distance;
};

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      // Refetch shops after setting location
      fetchNpmShops();
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };

  const filterShops = () => {
    if (searchQuery === '') {
      setFilteredShops(npmShops);
    } else {
      const filtered = npmShops.filter(shop =>
        shop.shopName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredShops(filtered);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const navigateToProductsList = (shopId) => {
    console.log('Clicked shop ID:', shopId);
    navigation.navigate('ProductsList', { shopId, user });
  };

  const renderShopItem = ({ item }) => (
    <TouchableOpacity
      style={styles.shopItem}
      onPress={() => navigateToProductsList(item.id)}
    >
      <ImageBackground
        source={require('../../images/shopdefault_shop.png')}
        style={styles.bgImageItem}
        resizeMode="cover"
      >
        <View style={styles.shopDetails}>
          <Text style={styles.shopName}>{item.shopName || 'Unknown Shop'}</Text>
          <Text style={styles.shopAddress}>{item.shopAddress || 'No Address Provided'}</Text>
          <Text style={styles.distance}>{item.distance !== undefined ? item.distance.toFixed(2) + ' km' : '0 km'}</Text>
        </View>
        {item.shopImage ? (
          <Image
            source={{ uri: item.shopImage }}
            style={styles.shopImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.shopImage, { backgroundColor: '#C8C8C8', justifyContent: 'center', alignItems: 'center' }]}>
            <Image source={require('../../images/shopdefault_shop.png')} style={{ width: 80, height: 80 }} resizeMode="cover" />
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );  

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
      <Text style={styles.greeting}>Hi {user.displayName},</Text>
      <Text style={styles.welcomeBack}>Welcome back!</Text>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search NPM Shops"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.heading}>NPM Shops</Text>
        <FlatList
          data={filteredShops}
          keyExtractor={(item) => item.id}
          renderItem={renderShopItem}
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
        options={{ headerShown: true }}
      />
      <HomeStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ headerShown: true }}
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
    marginBottom: 20,
  },
  bgImageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shopAddress: {
    fontSize: 14,
    color: '#888888',
  },
  distance: {
    fontSize: 12,
    color: '#888888',
  },
  shopImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 10,
  },
});

export default HomeScreen;
