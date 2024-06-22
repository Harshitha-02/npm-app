import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PaymentScreen = ({ navigation }) => {

  const handlePaymentOption = (paymentMethod) => {
    // Implement logic based on selected payment method
    console.log(`Selected payment method: ${paymentMethod}`);
    // Example: Navigate to payment processing screen or perform payment logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Select Payment Method</Text>
      </View>

      <View style={styles.contentContainer}>
        {/* Payment options */}
        <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentOption('Credit Card')}>
          <Text style={styles.paymentOptionText}>Credit Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentOption('Debit Card')}>
          <Text style={styles.paymentOptionText}>Debit Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentOption('PayPal')}>
          <Text style={styles.paymentOptionText}>PayPal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentOption('Google Pay')}>
          <Text style={styles.paymentOptionText}>Google Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentOption('Apple Pay')}>
          <Text style={styles.paymentOptionText}>Apple Pay</Text>
        </TouchableOpacity>
        
        {/* Add more payment options as needed */}

        {/* Cancel button */}
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
  paymentOption: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    alignItems: 'center',
  },
  paymentOptionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default PaymentScreen;
