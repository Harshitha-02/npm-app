import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeedbackScreen = ({ user }) => {
  useEffect(() => {
    console.log('User details in FeedbackScreen:', user);
  }, [user]);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feedback Screen</Text>
    </View>
  );
};

export default FeedbackScreen;
