import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateDoc, doc } from 'firebase/firestore';
import { auth } from '../../firebaseConfig';

const ProfileScreen = ({ user }) => {
  const navigation = useNavigation();
  const [defaultProfileImage] = useState(require('../../images/profile.jpeg'));

  useEffect(() => {
    console.log('User details in ProfileScreen:', user);
  }, [user]);

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
      navigation.navigate('AddressScreen');
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
          <Image source={defaultProfileImage} style={styles.profileImage} />
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
