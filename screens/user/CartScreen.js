import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const CartScreen = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
    console.log('User details received in CartScreen:', user);
  }, []);

  const fetchCartItems = async () => {
    try {
      const cartRef = collection(db, `users/${user.uid}/cart`);
      const cartSnapshot = await getDocs(cartRef);
      const cartItemsList = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched Cart Items:', cartItemsList);
      setCartItems(cartItemsList);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>Price: ${item.price}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyCartText}>Your cart is empty.</Text>
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
  cartItem: {
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
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ADE80',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#888888',
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CartScreen;
