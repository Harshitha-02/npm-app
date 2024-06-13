import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebaseConfig'; // Ensure this path matches your actual file structure
import { updateDoc, doc } from 'firebase/firestore';

const ProfileScreen = ({ user }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    console.log('User details in ProfileScreen:', user);
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const storage = getStorage();
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profile_images/${user.uid}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    updateProfileImage(downloadURL);
  };

  const updateProfileImage = async (url) => {
    const userRef = doc(db, 'users', user.uid); // Adjust this path according to your Firestore structure
    await updateDoc(userRef, {
      profileImage: url,
    });
  };

  const screenHeight = Dimensions.get('window').height;

  const handlePress = (section) => {
    console.log(`${section} pressed`);
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
              source={require('../../images/pen.png')} // Ensure this path matches your actual file structure
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
              source={require('../../images/arrow.png')} // Ensure this path matches your actual file structure
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
    flexGrow: 1,
    height: '50%',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
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
