import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddedVehicle({ navigation }) {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null); // ✅ store user id
  const [vehicles, setVehicles] = useState([]); // ✅ store vehicles

  // ✅ Load user details from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserName(parsedUser.name || '');
          setUserId(parsedUser.id); // ✅ store id for API call
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  // ✅ Fetch vehicle details for current user
  useEffect(() => {
    if (!userId) return; // Wait until userId is loaded
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`http://192.168.1.3:5000/api/vehicle/user/${userId}`);
        if (!response.ok) {
          const text = await response.text();
          console.error('Error fetching vehicles:', text);
          return;
        }
        const data = await response.json();
        console.log('Fetched vehicles:', data); // ✅ Debug log
        setVehicles(data); // ✅ Save fetched vehicles
      } catch (error) {
        console.error('Network error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, [userId]);

  return (
    <ImageBackground
      source={require('../assets/backg2.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image source={require('../assets/left.png')} style={styles.icon} />
        </Pressable>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Image source={require('../assets/profile.png')} style={styles.icon} />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>My vehicles</Text>

      {/* ✅ Dynamically render fetched vehicles */}
      <ScrollView contentContainerStyle={styles.vehicleContainer}>
        {vehicles.length === 0 ? (
          <Text style={{ color: '#fff', fontSize: 18, marginTop: 20 }}>
            No vehicles found.
          </Text>
        ) : (
          vehicles.map((vehicle) => (
            <Pressable
              key={vehicle.id}
              style={styles.vehicleBox} // ✅ Updated styling
              onPress={() =>
                navigation.navigate('AddedDocument', { vehicleId: vehicle.id })
              }
            >
              {/* ✅ Vehicle number at the top, bold */}
              <Text style={styles.vehicleNumber}>{vehicle.vehicleNumber}</Text>

              {/* ✅ Other details below, normal font */}
              <Text style={styles.vehicleInfo}>
                {vehicle.vehicleBrand} - {vehicle.vehicleType}{"\n"}
                {vehicle.ownerName} - {vehicle.province}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  icon: {
    width: 35,
    height: 35,
    marginLeft: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 30,
    alignSelf: 'center',
  },
  vehicleContainer: {
    alignItems: 'center',
    gap: 20,
  },
  vehicleBox: {
    backgroundColor: '#fff', // ✅ White background
    borderRadius: 12, // ✅ Rounded corners
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '90%', // ✅ Wide box
    // ✅ Small shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // ✅ Android shadow
  },
  vehicleNumber: {
    fontWeight: 'bold', // ✅ Bold vehicle number
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  vehicleInfo: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    lineHeight: 22, // ✅ Slight spacing for readability
  },
});
