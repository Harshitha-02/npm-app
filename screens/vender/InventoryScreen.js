import React from 'react';
import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const InventoryScreen = ({ navigation }) => {
  const navigateToAddProduct = () => {
    navigation.navigate('AddProductScreen');
  };

  return (
    <View style={styles.container}>
      {/* Top section with background image */}
      <View style={styles.topSection}>
        <ImageBackground source={require('../../images/homebg.png')} style={styles.backgroundImage}>
          <Image source={require('../../images/logo.png')} style={styles.logo} />
        </ImageBackground>
      </View>

      {/* Search box */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search products..."
          style={styles.searchInput}
          placeholderTextColor="#999"
          underlineColorAndroid="transparent"
        />
      </View>

      {/* Products section */}
      <View style={styles.productsSection}>
        <Text style={styles.productsHeading}>Products You Sell</Text>
        {/* Add Product button */}
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
});

export default InventoryScreen;
