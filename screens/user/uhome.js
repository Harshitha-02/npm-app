// AppNavigator.js or similar file

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { HomeIcon, WishlistIcon, CartIcon, ProfileIcon } from './CustomIcons';
import HomeScreenComponent from './HomeScreen';
import WishlistScreen from './WishlistScreen';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';
import ProductsListScreen from './ProductsListScreen';
import ProductDetailsScreen from './ProductDetailsScreen';
import AddressScreen from './AddressScreen';
import MyOrdersScreen from './MyOrdersScreen';
import OrderReviewScreen from './OrderReview'; // Import OrderReviewScreen here
import PaymentScreen from './PaymentScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CartStack = createStackNavigator(); // New stack navigator for Cart and OrderReview

const HomeStackScreen = ({ user }) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        options={{ headerShown: false }}
      >
        {props => <HomeScreenComponent {...props} user={user} />}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="ProductsList"
        component={ProductsListScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ headerShown: true }} // Ensure header is shown for ProductDetails
      />
    </HomeStack.Navigator>
  );
};

const ProfileStackScreen = ({ user }) => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="Profile"
    >
      {props => <ProfileScreen {...props} user={user} />}
    </ProfileStack.Screen>
    <ProfileStack.Screen
      name="MyOrders"
      component={MyOrdersScreen}
      options={{ title: 'My Orders', headerShown: true }}
    />
    <ProfileStack.Screen
      name="Address"
      component={AddressScreen}
      options={{ title: 'My Address', headerShown: true }}
    />
  </ProfileStack.Navigator>
);

// Cart stack navigator for CartScreen and OrderReviewScreen
const CartStackScreen = ({ user }) => (
  <CartStack.Navigator>
    <CartStack.Screen
      name="Cart"
      options={{ headerShown: false }} 
    >
      {props => <CartScreen {...props} user={user} />}
    </CartStack.Screen>

    <CartStack.Screen
      name="OrderReview"
      component={OrderReviewScreen}
      options={{ title: 'Order Review', headerShown: false }}
    />
    <CartStack.Screen
      name="PaymentScreen"
      component={PaymentScreen}
      options={{ title: 'Payment', headerShown: false }}
    />
  </CartStack.Navigator>
);

const Uhome = ({ navigation, route }) => {
  const { user: routeUser } = route.params;

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
          {() => <HomeStackScreen user={routeUser} />}
        </Tab.Screen>
        <Tab.Screen name="Wishlist" options={{ headerShown: false }}>
          {() => <WishlistScreen user={routeUser} />}
        </Tab.Screen>
        <Tab.Screen name="Cart" options={{ headerShown: false }}>
          {() => <CartStackScreen user={routeUser} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" options={{ headerShown: false }} >
          {() => <ProfileStackScreen user={routeUser} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default Uhome;
