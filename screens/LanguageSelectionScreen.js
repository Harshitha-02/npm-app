import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

export default function LanguageSelectionScreen() {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleNextPress = () => {
    if (selectedLanguage) {
      navigation.navigate('InfoScreen', { language: selectedLanguage });
    } else {
      alert('Please select a language');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome to Farm App!</Text>
        <Text style={styles.instructionText}>Please select your preferred language</Text>
        <Text style={styles.subText}>You can change your app language at any time from Profile &gt; Language</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleLanguageSelect('English')}
          style={[
            styles.languageButton,
            selectedLanguage === 'English' && styles.selectedButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              selectedLanguage === 'English' && styles.selectedButtonText,
            ]}
          >
            English
          </Text>
          {selectedLanguage === 'English' && (
            <Ionicons name="checkmark" size={24} color="#4ADE80" style={styles.icon} />
          )}
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          onPress={() => handleLanguageSelect('Telugu')}
          style={[
            styles.languageButton,
            selectedLanguage === 'Telugu' && styles.selectedButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              selectedLanguage === 'Telugu' && styles.selectedButtonText,
            ]}
          >
            తెలుగు
          </Text>
          {selectedLanguage === 'Telugu' && (
            <Ionicons name="checkmark" size={24} color="#4ADE80" style={styles.icon} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={require('../images/language.png')} style={styles.image} />
        <TouchableOpacity onPress={handleNextPress} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
    position: 'relative',
  },
  textContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#3A3A3A',
    textAlign: 'left',
    marginBottom: 5,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  languageButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#4ADE80',
  },
  icon: {
    marginLeft: 10,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ADE80',
    padding: 15,
    borderRadius: 5,
    position: 'absolute',
    bottom:100,
    alignSelf: 'center',
    zIndex: 1,
    width:"80%",
    justifyContent: 'center', 
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '115%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 0,
  },
});
