import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const OrderReviewScreen = ({ route , navigation }) => {
  const { cartItems, totalAmount, userAddress, deliveryTime } = route.params;

  const handleProceedToPayment = () => {
    // Implement your logic to proceed with payment
    navigation.navigate('PaymentScreen');
    // Example: API call or navigation to payment gateway
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Order Review</Text>
      </View>

      <View style={styles.contentContainer}>
        {/* Display selected items */}
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemPrice}>Price: ${item.price}</Text>
            </View>
          )}
        />

        {/* Display total amount, user address, and delivery time */}
        <View style={styles.orderDetails}>
          <Text style={styles.totalText}>Total Amount: ${totalAmount}</Text>
          <Text style={styles.deliveryText}>Delivery Address: {userAddress}</Text>
          <Text style={styles.deliveryText}>Estimated Delivery Time: {deliveryTime}</Text>
        </View>

        {/* Proceed to Payment button */}
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToPayment}>
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  headerContainer: {
    backgroundColor: '#19263C',
    padding: 20,
    paddingTop: 40,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ADE80',
    marginBottom: 5,
  },
  orderDetails: {
    marginTop: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deliveryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  proceedButton: {
    backgroundColor: '#4ADE80',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  proceedButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default OrderReviewScreen;
