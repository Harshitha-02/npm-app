import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';

const HomeScreen = ({ user }) => {
  // Log the props received
  console.log("Props received by HomeScreen:", user);

  return (
    <View style={styles.container}>
      {/* Top section */}
      <View style={styles.topSection}>
        {/* Background image */}
        <ImageBackground source={require('../../images/homebg.png')} style={styles.backgroundImage}>
          {/* Logo */}
          <Image source={require('../../images/logo.png')} style={styles.logo} />
        </ImageBackground>
      </View>

      {/* Greeting section */}
      <View style={styles.greetingSection}>
        <Text style={[styles.greetingText, { fontWeight: 'bold' }]}>Hi {user.displayName}</Text>
        <Text style={styles.welcomeText}>Welcome back!</Text>
      </View>

      {/* Box section */}
      <View style={styles.box}>
        <View style={styles.divs}>
          <Text style={styles.divText}>Sales</Text>
        </View>
        <View style={[styles.divs, styles.incomeDiv]}>
          <Text style={styles.divText}>Income</Text>
        </View>
      </View>

      {/* Horizontal line */}
      <View style={styles.horizontalLine} />
      
      {/* New Orders section */}
      <View style={styles.newOrdersSection}>
        {/* Ensure textAlign style is applied to the container */}
        <View style={{ alignItems: 'flex-start' }}>
          <Text style={[styles.newOrdersHeading]}>New Orders!</Text>
        </View>
        <Text style={styles.noOrdersText}>No orders right now</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    marginTop: 30,
  },
  greetingSection: {
    flex: 0.2,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  greetingText: {
    color: 'black',
    fontSize: 24,
    marginBottom: 5,
  },
  welcomeText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 10,
  },
  box: {
    flexDirection: 'row',
  },
  divs: {
    flex: 1,
    height: '60%',
    backgroundColor: '#2E335A',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  divText: {
    color: 'white',
    fontSize: 18,
  },
  horizontalLine: {
    borderBottomColor: '#C1C0C9',
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginTop: -55,
  },
  newOrdersSection: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  newOrdersHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noOrdersText: {
    fontSize: 16,
    color: '#6D6D72',
  },
});

export default HomeScreen;
