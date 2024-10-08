import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrderConfirmedScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        {/* Circle around the checkmark */}
        <View style={styles.circle}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/100/00ff00/checkmark.png' }}
            style={styles.icon}
          />
        </View>
      </View>

      <View style={styles.bottomHalf}>
        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.subtitle}>Thank You</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Profile', { screen: 'MyOrders' })}>
          <Text style={styles.viewOrderText}>view your order here &gt;</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Overall background color will be white (bottom half)
  },
  topHalf: {
    flex: 1, // This will take half of the screen
    backgroundColor: '#0C1E30', // Dark blue background for the top half
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHalf: {
    flex: 1, // This will take the other half of the screen
    backgroundColor: '#FFFFFF', // White background for the bottom half
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75, // Makes the view a circle
    borderWidth: 5,
    borderColor: '#00FF85', // Bright green color for the circle border
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    tintColor: '#00FF85', // Bright green color for the checkmark
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#19263C',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#19263C',
    marginBottom: 20,
  },
  viewOrderText: {
    fontSize: 14,
    color: '#19263C',
    textDecorationLine: 'underline',
  },
});

export default OrderConfirmedScreen;
