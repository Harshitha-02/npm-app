import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../../firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = ({ user }) => {
  const navigation = useNavigation();
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

    if (!result.cancelled) {
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
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      profileImage: url,
    });
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
    }
  };

  const handlePress = (section) => {
    if (section === 'My Address') {
      console.log(`${section} pressed`);
      console.log('User details in ProfileScreen:', user);
    } else if (section === 'My Language') {
      navigation.navigate('MyLanguageScreen');
    } else if (section === 'Logout') {
      handleLogout();
    } else {
      console.log(`${section} pressed`);
    }
  };

  const handleBecomeVendor = () => {
    console.log('Navigate to BecomeVendor screen or perform necessary actions');
  };

  const screenHeight = Dimensions.get('window').height;

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
              source={require('../../images/pen.png')}
              style={styles.penIcon}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <Text style={styles.userName}>{user.displayName}</Text>
      <View style={styles.bottomContainer}>
        {['My Address', 'My Orders', 'My Language', 'Customer Support', 'Logout'].map((section, index) => (
          <TouchableOpacity key={section} style={[styles.section, index === 4 ? { borderBottomWidth: 0 } : null]} onPress={() => handlePress(section)}>
            <Text style={styles.sectionText}>{section}</Text>
            <Image
              source={require('../../images/arrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={handleBecomeVendor}>
        <Text style={styles.becomeVendorText}>Become a Vendor?</Text>
      </TouchableOpacity>
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
    top: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
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
    borderColor: 'white',
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
    marginTop: 60,
  },
  bottomContainer: {
    width: '90%',
    backgroundColor: '#19263C',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    maxHeight: '50%',
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
  becomeVendorText: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default ProfileScreen;
