import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Menu({ navigation }) {
  const [userName, setUserName] = useState('');
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    console.log('✅ Menu screen loaded');
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserName(parsedUser.name || '');
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (err) {
      Alert.alert('Logout Failed', 'Something went wrong during logout.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.background}>
      {/* Top bar with profile and name */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Image source={require('../assets/left.png')} style={styles.icon} />
        </Pressable>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Pressable onPress={() => setShowLogout(!showLogout)}>
            <Image source={require('../assets/profile.png')} style={styles.icon} />
          </Pressable>
        </View>
      </View>

      {/* Logout Button */}
      {showLogout && (
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      )}

      {/* Title */}
      <Text style={styles.title}>Stay Compliant,{'\n'}Stay Safe</Text>

      {/* Horizontal scroll section */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Pressable onPress={() => navigation.navigate('AddVehicle')}>
          <Image source={require('../assets/img1.png')} style={styles.sliderImage} />
        </Pressable>

        <Pressable onPress={() => navigation.navigate('AddedVehicle')}>
          <Image source={require('../assets/img2.png')} style={styles.sliderImage} />
        </Pressable>

        <Pressable onPress={() => navigation.navigate('ShareExp')}>
          <Image source={require('../assets/img3.png')} style={styles.sliderImage} />
        </Pressable>
      </ScrollView>

      {/* Instruction text above chat image */}
      <Text style={styles.chatInstruction}>
        Chat with your renewal guide in real time and get instant guidance at your fingertips.
      </Text>

      {/* Chat image */}
      <Pressable
        onPress={() =>
          navigation.navigate('LiveChat', {
            senderId: '6', // dynamically fetched
            receiverId: '7',
          })
        }
      >
        <Image source={require('../assets/img4.png')} style={styles.chatImage} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginLeft: 0,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3362A9',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#F44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    marginRight: 10,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5C5CA1',
    marginTop: 40,
    marginBottom: 20,
  },
  scrollContainer: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 10,
  },
  sliderImage: {
    width: 240,
    height: 300,
    borderRadius: 12,
  },
  chatInstruction: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#3362A9',
    fontSize: 25,
    marginVertical: 27,
  },
  chatImage: {
    width: 340,
    height: 160,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 100,
    borderRadius: 20,
  },
});