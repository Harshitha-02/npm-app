// HistoryScreen.js

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const historyData = [
  { id: '1', title: 'Order #1', date: '2024-07-01', description: 'Ordered 3 items' },
  { id: '2', title: 'Order #2', date: '2024-07-02', description: 'Ordered 2 items' },
  { id: '3', title: 'Order #3', date: '2024-07-03', description: 'Ordered 5 items' },
];

const HistoryScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={historyData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  description: {
    fontSize: 16,
  },
});

export default HistoryScreen;
