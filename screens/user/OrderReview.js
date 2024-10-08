import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const OrderReviewScreen = ({ route }) => {
  console.log(route);
  const navigation = useNavigation();
  const { cartItems, totalAmount, userAddress, deliveryTime, user } = route.params;
  console.log(user);

  const handleProceedToPayment = () => {
    Alert.alert(
      "Order Confirmation",
      "You have selected Cash on Delivery. Your order will be processed, and payment will be collected upon delivery.",
      [
        {
          text: "OK",
          onPress: async () => {  // Mark this as async
            try {
              const userId = user.uid; // Use the user prop passed from CartScreen

              const orderData = {
                cartItems: cartItems,
                totalAmount: totalAmount,
                userAddress: userAddress,
                deliveryTime: deliveryTime,
                orderDate: Timestamp.now(),
                status: 'Pending', // Add status field
              };

              // Reference to the user's orders collection
              const ordersRef = collection(db, 'users', userId, 'orders');

              // Add a new order document
              await addDoc(ordersRef, orderData); // Await is valid now

              console.log('Order successfully added to Firestore');
              
              // navigate to order confirmed page 
              navigation.navigate('OrderConfirmedScreen', { totalAmount, userAddress, deliveryTime });

              // and storing the orders in database

              // then notify the vendor that a new order is placed from their shop
              console.log('Order confirmed with Cash on Delivery');
              
            } catch (error) {
              console.error('Error adding order to Firestore: ', error);
              Alert.alert('Error', 'An error occurred while placing your order. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Order Review</Text>
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemPrice}>Price: ₹{item.price}</Text>
            </View>
          )}
        />

        <View style={styles.orderDetails}>
          <Text style={styles.totalText}>Total Amount: ₹{totalAmount}</Text>
          <Text style={styles.deliveryText}>Delivery Address: {userAddress}</Text>
          <Text style={styles.deliveryText}>Estimated Delivery Time: {deliveryTime}</Text>
        </View>

        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToPayment}>
          <Text style={styles.proceedButtonText}>Confirm Order (Cash on Delivery)</Text>
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
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    color: 'green',
  },
  orderDetails: {
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deliveryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  proceedButton: {
    backgroundColor: '#53a20e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderReviewScreen;
