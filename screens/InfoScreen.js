import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function InfoScreen({ route }) {
  const { language } = route.params;
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('SigninScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require('../images/BGWaveinfopage1.png')} // Assuming you have a background image
          style={styles.backgroundImage}
        >
          <View style={styles.overlay}>
            <Image source={require('../images/background.png')} style={styles.icon} />
          </View>
        </ImageBackground>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Get your fresh farm products!!</Text>
        <Text style={styles.subText}>With the help of our app, you can locate npm shops around your vicinity</Text>
      </View>
      <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Adjust to match the wave's background
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items at the top
  },
  backgroundContainer: {
    width: '100%',
    height: '45%', // Half of the screen
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: '#ffffff', // Adjust this to match your wave's background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: 300,
    height: 400,
    justifyContent: 'flex-end', // Align the image at the bottom of the overlay
    alignItems: 'center',
  },
  icon: {
    width: 250,
    height: 250,
  },
  textContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 50, // Space between the image and text
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  subText: {
    color: '#8896AB',
    textAlign: 'center',
    width:200,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#4ADE80',
    padding: 15,
    borderRadius: 5,
    position: 'absolute',
    bottom: 50,
    right: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width:110,
  },
});
