import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { HomeIcon, InventoryIcon, FeedbackIcon, ProfileIcon } from './CustomIcons';

// Import your screens for Home, Inventory, Feedback, and Profile
import HomeScreen from './HomeScreen';
import InventoryScreen from './InventoryScreen';
import FeedbackScreen from './FeedbackScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const Vhome = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#19263C' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let iconComponent;

            if (route.name === 'Home') {
              iconComponent = <HomeIcon focused={focused} size={size} />;
            } else if (route.name === 'Inventory') {
              iconComponent = <InventoryIcon focused={focused} size={size} />;
            } else if (route.name === 'Feedback') {
              iconComponent = <FeedbackIcon focused={focused} size={size} />;
            } else if (route.name === 'Profile') {
              iconComponent = <ProfileIcon focused={focused} size={size} />;
            }

            return iconComponent;
          },
          tabBarActiveTintColor: '#4ADE80', // Active tint color
          tabBarInactiveTintColor: 'white', // Inactive tint color
          tabBarStyle: {
            backgroundColor: '#19263C', // Background color
            height: 80, // Adjust height here
            justifyContent: 'center',
          },
          tabBarLabelStyle: {
            fontWeight: 'bold', 
            marginBottom: 15, 
            marginBottom: 15, 
          },
          tabBarIconStyle: {
            marginBottom: -10, // Decrease space between icon and label
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Inventory" component={InventoryScreen} />
        <Tab.Screen name="Feedback" component={FeedbackScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
};

export default Vhome;
