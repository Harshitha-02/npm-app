import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Dimensions, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebaseConfig'; // Adjust this path according to your actual file structure
import { updateDoc, doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebaseConfig'; // Import auth from your firebaseConfig

const ProfileScreen = ({ user }) => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  useEffect(() => {
    console.log('User details in ProfileScreen:', user);
  }, [user]);

  const pickImage = async () => {
    console.log('Opening image picker...');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log('Image picker result:', result);

      if (!result.cancelled) {
        const uri = result.assets[0].uri;
        console.log('Image picked:', uri);
        setImage(uri); // Update state with the picked image URI
        uploadImage(uri); // Pass URI to upload function
      } else {
        console.log('Image picking cancelled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const uploadImage = async (uri) => {
    console.log('Uploading image:', uri);

    try {
      const storage = getStorage();
      const response = await fetch(uri);

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const blob = await response.blob();
      console.log('Blob created:', blob);

      // Upload to vendors/useruid/shopImage
      const vendorsRef = doc(db, 'vendors', user.uid);
      await setDoc(vendorsRef, { shopImage: uri }, { merge: true });
      console.log('Shop Image URL updated in vendors collection');

      // Upload to npm_shops/useruid/shopImage
      const npmShopsRef = doc(db, 'npmshops', user.uid);
      await setDoc(npmShopsRef, { shopImage: uri }, { merge: true });
      console.log('Shop Image URL updated in npm_shops collection');

      Alert.alert('Success', 'Shop image uploaded successfully.');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload shop image. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully');
      navigation.reset({
        index: 0,
        routes: [{ name: 'SigninScreen' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Logout Failed', 'Failed to log out. Please try again.');
    }
  };
  
  const screenHeight = Dimensions.get('window').height;

  const handlePress = (section) => {
    if (section === 'My Address') {
      console.log(`${section} pressed`);
      console.log('User details in ProfileScreen:', user);
      navigation.navigate('ShopDetailsScreen', { user });
    } else if (section === 'My Language') {
      navigation.navigate('MyLanguageScreen');
    } else if (section === 'Logout') {
      handleLogout();
    } else {
      console.log(`${section} pressed`);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../images/profilebg.png')} style={[styles.backgroundImage, { height: screenHeight * 0.2 }]}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <Text style={styles.imagePlaceholder}>+</Text>
            )}
            <Image
              source={require('../../images/pen.png')} // Adjust this path according to your actual file structure
              style={styles.penIcon}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <Text style={styles.userName}>{user.displayName}</Text>
      <View style={styles.bottomContainer}>
        {['My Address', 'My History', 'My Language', 'Customer Support', 'Logout'].map((section) => (
          <TouchableOpacity key={section} style={styles.section} onPress={() => handlePress(section)}>
            <Text style={styles.sectionText}>{section}</Text>
            <Image
              source={require('../../images/arrow.png')} // Adjust this path according to your actual file structure
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'absolute',
    top: '70%', // Positions the circle 20% from the top of the screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white', // Adds a white border for better visibility
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    textAlign: 'center',
    lineHeight: 100,
    fontSize: 40,
    color: '#888888',
    borderWidth: 3,
    borderColor: 'white', // Adds a white border for better visibility
  },
  penIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 60, // Adjust to place the name below the profile image
  },
  bottomContainer: {
    width: '90%',
    backgroundColor: '#19263C',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,

  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3E50',
  },
  sectionText: {
    fontSize: 16,
    color: 'white',
  },
  arrowIcon: {
    width: 16,
    height: 16,
  },
});

export default ProfileScreen;
