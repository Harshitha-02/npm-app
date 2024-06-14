import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeIcon, WishlistIcon, CartIcon, ProfileIcon } from './CustomIcons'; // Ensure you have appropriate icon components
import HomeScreen from './HomeScreen';
import WishlistScreen from './WishlistScreen';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const Uhome = ({ navigation, route }) => {
  const { user: routeUser } = route.params;
  console.log('User details received in uhome:', routeUser);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let iconComponent;

            if (route.name === 'Home') {
              iconComponent = <HomeIcon focused={focused} size={size} />;
            } else if (route.name === 'Wishlist') {
              iconComponent = <WishlistIcon focused={focused} size={size} />;
            } else if (route.name === 'Cart') {
              iconComponent = <CartIcon focused={focused} size={size} />;
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
          {() => <HomeScreen user={routeUser} navigation={navigation} />}
        </Tab.Screen>
        <Tab.Screen name="Wishlist" options={{ headerShown: false }}>
          {() => <WishlistScreen user={routeUser} />}
        </Tab.Screen>
        <Tab.Screen name="Cart" options={{ headerShown: false }}>
          {() => <CartScreen user={routeUser} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" options={{ headerShown: false }}>
          {() => <ProfileScreen user={routeUser} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default Uhome;
