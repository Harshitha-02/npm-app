import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeIcon, InventoryIcon, FeedbackIcon, ProfileIcon } from './CustomIcons';
import HomeScreen from './HomeScreen';
import InventoryScreen from './InventoryScreen';
import FeedbackScreen from './FeedbackScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const Vhome = ({ navigation, route }) => {
  const { user: routeUser } = route.params;
  console.log('User details received in vhome:', routeUser);
  return (
    <View style={{ flex: 1 }}>
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
          tabBarActiveTintColor: '#4ADE80',
          tabBarInactiveTintColor: 'white',
          tabBarStyle: {
            backgroundColor: '#19263C',
            height: 80,
            justifyContent: 'center',
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
            marginBottom: 15,
          },
          tabBarIconStyle: {
            marginBottom: -10,
          },
        })}
      >
        <Tab.Screen name="Home" options={{ headerShown: false }}>
          {() => <HomeScreen user={routeUser} />}
        </Tab.Screen>
        <Tab.Screen name="Inventory" options={{ headerShown: false }}>
          {() => <InventoryScreen user={routeUser} navigation={navigation} />}
        </Tab.Screen>
        <Tab.Screen name="Feedback" component={FeedbackScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
};

export default Vhome;
