// App.js
import React from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Import screens
import LandingPage from './screens/LandingPage';
import InfoScreen from './screens/InfoScreen';
import LanguageSelectionScreen from './screens/LanguageSelectionScreen';
import SigninScreen from './screens/SignInScreen';
import SignupScreen from './screens/user/SignUpScreen';
import BusinessAccountScreen from './screens/vender/BusinessAccountScreen';
import Vhome from './screens/vender/vhome';
import Uhome from './screens/user/uhome';
import ProductsListScreen from './screens/user/ProductsListScreen';
import ProductDetailsScreen from './screens/user/ProductDetailsScreen';

import AddProductScreen from './screens/vender/AddProductScreen';
import EditProductScreen from './screens/vender/EditProductScreen';
import ShopDetailsScreen from './screens/vender/ShopDetailsScreen';

import MyLanguageScreen from './screens/MyLanguageScreen';
// Import reducers
import vendorReducer from './redux/reducers/vendorReducer'; // Adjust the path if necessary

// Combine reducers
const rootReducer = {
  vendor: vendorReducer,
};

// Create Redux store using configureStore
const store = configureStore({
  reducer: rootReducer,
});

// Create navigation stack
const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LandingPage">
          <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
          <Stack.Screen name="LanguageSelectionScreen" component={LanguageSelectionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="InfoScreen" component={InfoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SigninScreen" component={SigninScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="BusinessAccountScreen" component={BusinessAccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Vhome" component={Vhome} options={{ headerShown: false }} />
          <Stack.Screen name="Uhome" component={Uhome} options={{ headerShown: false }} />
          <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
          <Stack.Screen name="EditProductScreen" component={EditProductScreen} />
          <Stack.Screen name="ShopDetailsScreen" component={ShopDetailsScreen} />

          <Stack.Screen name="MyLanguageScreen" component={MyLanguageScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

// Ensure the main component is registered correctly
import { name as appName } from './app.json';
AppRegistry.registerComponent(appName, () => App);

export default App;
