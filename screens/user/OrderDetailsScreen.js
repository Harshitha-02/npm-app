import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const OrderDetailsScreen = ({ route }) => {
  const { order } = route.params;

  return (
    <View style={styles.container}>
      {/* Order Status */}
      <Text style={styles.orderStatus}>{order.status}</Text>
      <Text style={styles.orderId}>Order ID: #{order.id}</Text>

      {/* Product Info */}
      <View style={styles.productContainer}>
        <Image source={{ uri: order.cartItems[0].imageURL }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{order.cartItems[0].name}</Text>
          <Text style={styles.productDescription}>{order.cartItems[0].description}</Text>
        </View>
      </View>

      {/* Delivery Information */}
      <View style={styles.deliverySection}>
        <Text style={styles.sectionHeader}>Delivered to:</Text>
        <Text>{order.userAddress}</Text>

        <Text style={styles.sectionHeader}>Order placed on:</Text>
        <Text>{new Date(order.orderDate.seconds * 1000).toLocaleDateString()}</Text>

        <Text style={styles.sectionHeader}>Delivery on:</Text>
        <Text>{order.deliveryTime}</Text>
      </View>

      {/* Rating Section */}
      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>Rate the product</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Image
              key={index}
              source={require('../../images/star.png')}
              style={styles.starIcon}
            />
          ))}
        </View>
      </View>

      {/* Total Amount */}
      <View style={styles.totalAmountSection}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalText}>₹{order.totalAmount}</Text>
      </View>

      {/* Mode of Payment */}
      <Text style={styles.paymentText}>Mode of payment: {order.paymentMode || 'Cash on Delivery'}</Text>
    </View>
  );
};

// Styles for the detailed order view
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  orderStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00AEEF',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  deliverySection: {
    marginVertical: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  ratingSection: {
    marginTop: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  totalAmountSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentText: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default OrderDetailsScreen;
