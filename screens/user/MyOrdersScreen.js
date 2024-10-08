import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../../firebaseConfig';

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  // Fetch orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = auth.currentUser.uid; // Get the current user's ID
        const ordersRef = collection(db, 'users', userId, 'orders'); // Reference to the user's 'orders' collection
        const snapshot = await getDocs(ordersRef);
        const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map the documents to your local state

        setOrders(ordersList); // Set the fetched orders to state
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Function to get the color based on the order status
  const renderStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return styles.statusDelivered;
      case 'Confirmed':
        return styles.statusConfirmed;
      case 'Refund Completed':
        return styles.statusRefund;
      case 'Canceled':
        return styles.statusCanceled;
      default:
        return styles.statusDefault;
    }
  };

  // Render each order item
  const renderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      {/* Product Image */}
      <Image source={{ uri: item.cartItems[0].imageURL }} style={styles.productImage} />

      <View style={styles.detailsContainer}>
        {/* Order Status */}
        <Text style={[styles.statusText, renderStatusColor(item.status)]}>
          {item.status}
        </Text>

        {/* Product Name */}
        <Text style={styles.productName}>
          {item.cartItems[0].name}
        </Text>

        {/* Stars and Feedback */}
        <View style={styles.ratingContainer}>
          {/* Star Ratings (Static for now) */}
          {[...Array(5)].map((_, index) => (
            <Image
              key={index}
              source={require('../../images/star.png')}
              style={styles.starIcon}
            />
          ))}
          <TouchableOpacity>
            <Text style={styles.feedbackText}>Write a feedback</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Arrow button to go to Order Details */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => navigation.navigate('OrderDetailsScreen', { order: item })}
      >
        <Image source={require('../../images/arrow.png')} style={styles.arrowIcon} />
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.emptyMessage}>You have no orders yet.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

// Styles for the screen and components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingTop: 10,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  orderContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusDelivered: {
    color: '#4ADE80', // Green for Delivered
  },
  statusConfirmed: {
    color: '#00AEEF', // Blue for Confirmed
  },
  statusRefund: {
    color: '#FFA500', // Orange for Refund Completed
  },
  statusCanceled: {
    color: '#FF4D4D', // Red for Canceled
  },
  productName: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  feedbackText: {
    color: '#00AEEF',
    fontSize: 12,
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  arrowButton: {
    marginLeft: 10,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    tintColor: '#888',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MyOrdersScreen;
