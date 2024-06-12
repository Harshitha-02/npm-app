import React from 'react';
import { View, Text } from 'react-native';

const HomeScreen = ({ user }) => {
  // Log the props received
  console.log("Props received by HomeScreen:", user);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {user.displayName}</Text>
    </View>
  );
};

export default HomeScreen;
