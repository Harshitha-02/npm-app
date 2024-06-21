import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const CartScreen = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const unsubscribe = listenToCartChanges();
    console.log('User details received in CartScreen:', user);

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    calculateTotalAmount();
  }, [itemQuantities]); // Recalculate total amount when itemQuantities change

  const listenToCartChanges = () => {
    const cartRef = collection(db, `users/${user.uid}/cart`);
    return onSnapshot(cartRef, (snapshot) => {
      const updatedCartItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCartItems(updatedCartItems);

      // Initialize selectedItemIds and itemQuantities from Firestore
      const initialSelectedIds = [];
      const initialQuantities = {};
      updatedCartItems.forEach(item => {
        initialSelectedIds.push(item.id);
        initialQuantities[item.id] = item.quantity || 1; // Default quantity to 1 if not defined
      });
      setSelectedItemIds(initialSelectedIds);
      setItemQuantities(initialQuantities);
    });
  };

  const toggleItemSelection = (itemId) => {
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(prevState => prevState.filter(id => id !== itemId));
    } else {
      setSelectedItemIds(prevState => [...prevState, itemId]);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      // Update locally first
      setItemQuantities(prevState => ({
        ...prevState,
        [itemId]: newQuantity
      }));

      // Update in Firestore
      const itemRef = doc(db, `users/${user.uid}/cart`, itemId);
      await updateDoc(itemRef, { quantity: newQuantity });

      // Recalculate total amount
      calculateTotalAmount();
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity.');
    }
  };

  const calculateTotalAmount = () => {
    let total = 0;
    cartItems.forEach(item => {
      if (selectedItemIds.includes(item.id)) {
        total += item.price * itemQuantities[item.id];
      }
    });
    setTotalAmount(total);
  };

  const removeItemFromCart = async (itemId) => {
    try {
      const itemRef = doc(db, `users/${user.uid}/cart`, itemId);
      await deleteDoc(itemRef);
      Alert.alert('Item removed', 'The item has been removed from your cart.');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      Alert.alert('Error', 'Failed to remove item from cart.');
    }
  };

  const handleProceed = () => {
    // Implement your logic to proceed with the order
    console.log('Proceed button pressed');
    // Example: Navigation logic or API call to place order
  };

  return (
    <View style={styles.container}>
      {/* Your Cart Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Your Cart</Text>
      </View>
      
      {/* Rest of the content with padding */}
      <View style={styles.contentContainer}>
        <Text style={styles.selectItemsText}>Select the items you want to order:</Text>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              {/* Close button to remove item */}
              <TouchableOpacity style={styles.closeButton} onPress={() => removeItemFromCart(item.id)}>
                <Text style={styles.closeButtonText}>x</Text>
              </TouchableOpacity>

              {/* Checkbox to select/deselect item */}
              <TouchableOpacity onPress={() => toggleItemSelection(item.id)} style={styles.checkboxContainer}>
                {selectedItemIds.includes(item.id) ? (
                  <Image source={require('../../images/tick.png')} style={styles.checkboxTick} />
                ) : (
                  <View style={styles.checkbox} />
                )}
              </TouchableOpacity>

              <Image source={{ uri: item.imageURL }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>Price: ${item.price}</Text>
                <Text style={styles.itemDescription}>Quantity: {itemQuantities[item.id]}</Text>
                {selectedItemIds.includes(item.id) && (
                  <View style={styles.selectionDetails}>
                    <View style={styles.quantityContainer}>
                      {/* Minus button */}
                      <TouchableOpacity onPress={() => updateQuantity(item.id, itemQuantities[item.id] - 1)}>
                        <Text style={styles.quantityBtn}>-</Text>
                      </TouchableOpacity>
                      {/* Quantity text */}
                      <Text style={styles.quantityText}>{itemQuantities[item.id]}</Text>
                      {/* Plus button */}
                      <TouchableOpacity onPress={() => updateQuantity(item.id, itemQuantities[item.id] + 1)}>
                        <Text style={styles.quantityBtn}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.selectedQuantity}>
                      Quantity: {itemQuantities[item.id]}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyCartText}>Your cart is empty.</Text>
          )}
        />
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total Amount: ${totalAmount}</Text>
          {/* Proceed button */}
          <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
            <Text style={styles.proceedButtonText}>Proceed</Text>
            <Image source={require('../../images/arrow.png')} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
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
  selectItemsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    flexDirection: 'row', // Ensure items are displayed in a row
    alignItems: 'center', // Align items vertically in the center
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 10,
    padding: 5,
    borderRadius: 15,
  },
  closeButtonText: {
    fontSize: 20,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#707070',
    borderRadius: 4,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
  },
  checkboxTick: {
    width: 14,
    height: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
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
    marginBottom: 5,
  },
  selectionDetails: {
    marginTop: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityBtn: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    color: '#4ADE80',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  selectedQuantity: {
    fontSize: 16,
    color: '#888888',
    marginTop: 5,
  },
  removeButton: {
    backgroundColor: '#FF6347', // Red color for remove button
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  proceedButton: {
    backgroundColor: '#4ADE80',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  proceedButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  arrowIcon: {
    width: 20,
    height: 13,
    tintColor: 'black',
  },
});

export default CartScreen;
