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

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const HomeStackScreen = ({ user, navigation }) => {
  console.log('HomeStackScreen received user:', user);
  console.log('HomeStackScreen navigation:', navigation);

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
      component={ProfileScreen} 
      options={{ headerShown: false }} 
      initialParams={{ user }}
    />
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


const Uhome = ({ navigation, route }) => {
  const { user: routeUser } = route.params;
  console.log('Uhome received user:', routeUser);
  console.log('Uhome navigation:', navigation);

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
          {() => <CartScreen user={routeUser} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" >
          {() => <ProfileScreen user={routeUser} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default Uhome;
