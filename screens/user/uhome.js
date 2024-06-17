import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { HomeIcon, WishlistIcon, CartIcon, ProfileIcon } from './CustomIcons';
import HomeScreenComponent from './HomeScreen';
import WishlistScreen from './WishlistScreen';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';
import ProductsListScreen from './ProductsListScreen';
import ProductDetailsScreen from './ProductDetailsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const HomeScreen = ({ user }) => {
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
        options={{ headerShown: true }} // Ensure header is shown
      />
      <HomeStack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen} 
        options={{ headerShown: true }} // Ensure header is shown
      />
    </HomeStack.Navigator>
  );
};

const Uhome = ({ navigation, route }) => {
  const { user: routeUser } = route.params;
  console.log('User details received in Uhome:', routeUser);

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
          {() => <HomeScreen user={routeUser} />}
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
