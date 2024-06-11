// LandingPage.js
import React from 'react';
import { View, ImageBackground, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('LanguageSelectionScreen');
  };

  return (
    <ImageBackground source={require('../images/background.png')} style={styles.background}>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Image source={require('../images/logo.png')} style={styles.logo} />
        <View style={styles.textContainer}>
          <Text style={styles.farmText}>Farm</Text>
          <Text style={styles.appText}>App</Text>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  textContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  farmText: {
    color: '#19263C',
    fontSize: 50,
    fontWeight: 'bold',
    marginRight: 5,
  },
  appText: {
    color: '#4ADE80',
    fontSize: 50,
    fontWeight: 'bold',
  },
});

export default LandingPage;
