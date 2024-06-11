import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './screens/LandingPage';
import InfoScreen from './screens/InfoScreen';
import LanguageSelectionScreen from './screens/LanguageSelectionScreen';
import SigninScreen from './screens/SignInScreen';
import SignupScreen from './screens/user/SignUpScreen';
import BusinessAccountScreen from './screens/vender/BusinessAccountScreen';
import Vhome from './screens/vender/vhome';
import HomePage from './screens/HomePage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
        <Stack.Screen name="LanguageSelectionScreen" component={LanguageSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InfoScreen" component={InfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SigninScreen" component={SigninScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BusinessAccountScreen" component={BusinessAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="Vhome" component={Vhome} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
