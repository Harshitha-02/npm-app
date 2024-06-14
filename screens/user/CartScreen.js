import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CartScreen = ({ user }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to your Cart, {user.displayName}!</Text>
      <Text style={styles.text}>This is your Cart Screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default CartScreen;
