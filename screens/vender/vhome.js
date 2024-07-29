import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeIcon, InventoryIcon, FeedbackIcon, ProfileIcon } from './CustomIcons';
import HomeScreen from './HomeScreen';
import InventoryScreen from './InventoryScreen';
import AddProductScreen from './AddProductScreen';
import EditProductScreen from './EditProductScreen';
import FeedbackScreen from './FeedbackScreen';
import ProfileScreen from './ProfileScreen';
import ShopDetailsScreen from './ShopDetailsScreen';
import HistoryScreen from './HistoryScreen';

const Tab = createBottomTabNavigator();
const InventoryStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const InventoryStackScreen = ({ user }) => (
  <InventoryStack.Navigator>
    <InventoryStack.Screen
      name="Inventory"
      options={{ headerShown: false }}
    >
      {props => <InventoryScreen {...props} user={user} />}
    </InventoryStack.Screen>
    <InventoryStack.Screen
      name="AddProduct"
      component={AddProductScreen}
      options={{ title: 'Add Product', headerShown: true }}
    />
    <InventoryStack.Screen
      name="EditProduct"
      component={EditProductScreen}
      options={{ title: 'Edit Product', headerShown: true }}
    />
  </InventoryStack.Navigator>
);

const ProfileStackScreen = ({ user }) => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="Profile"
    >
      {props => <ProfileScreen {...props} user={user} />}
    </ProfileStack.Screen>
    <ProfileStack.Screen
      name="ShopDetail"
      component={ShopDetailsScreen}
      options={{ title: 'Shop Detail', headerShown: true }}
    />
    <ProfileStack.Screen
      name="History"
      component={HistoryScreen}
      options={{ title: 'History', headerShown: true }}
    />
  </ProfileStack.Navigator>
);

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
          {() => <InventoryStackScreen user={routeUser} />}
        </Tab.Screen>
        <Tab.Screen name="Feedback" options={{ headerShown: false }}>
          {() => <FeedbackScreen user={routeUser} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" options={{ headerShown: false }}>
          {() => <ProfileStackScreen user={routeUser} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default Vhome;
