import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

export default function MyLanguageScreen() {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleSave = () => {
    if (selectedLanguage) {
      // Perform save action here (if needed)
      // For demonstration, navigate back to the previous screen
      navigation.goBack();
    } else {
      alert('Please select a language');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Select your preferred language</Text>
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

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
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
  saveButton: {
    backgroundColor: '#4ADE80',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
