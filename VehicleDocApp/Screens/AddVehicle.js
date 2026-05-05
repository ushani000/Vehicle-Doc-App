// VehicleDocApp/Screens/AddVehicle.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddVehicle({ navigation }) {
  const [ownerName, setOwnerName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [province, setProvince] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser.id);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (navigateNext = false) => { // ✅ UPDATED (added navigateNext param)
    if (!ownerName || !vehicleType || !vehicleBrand || !vehicleNumber || !province) {
      Alert.alert('Missing fields', 'Please fill all the fields.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.3:5000/api/vehicle/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ownerName,
          vehicleType,
          vehicleBrand,
          vehicleNumber,
          province,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        Alert.alert('Success', 'Details saved');
        if (navigateNext) { // ✅ UPDATED (navigate after save only if next button pressed)
          navigation.navigate('AddDocument', { vehicleNumber });
        }
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Network error occurred');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/rename1.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Top Navigation Icons */}
      <View style={styles.topIcons}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image source={require('../assets/left.png')} style={styles.icon} />
        </Pressable>
        <Image source={require('../assets/profile.png')} style={styles.icon} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Vehicle Details</Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        <Image
         // source={require('../assets/.png')}
          style={styles.carImage}
          resizeMode="contain"
        />

        {/* Inputs */}
        <View style={styles.inputGroup}>
          <TextInput placeholder="Owner Name" style={styles.input} value={ownerName} onChangeText={setOwnerName} />
          <TextInput placeholder="Vehicle Type" style={styles.input} value={vehicleType} onChangeText={setVehicleType} />
          <TextInput placeholder="Vehicle Brand" style={styles.input} value={vehicleBrand} onChangeText={setVehicleBrand} />
          <TextInput placeholder="Vehicle Number" style={styles.input} value={vehicleNumber} onChangeText={setVehicleNumber} />
          <TextInput placeholder="Province" style={styles.input} value={province} onChangeText={setProvince} />

          {/* Save Button */}
          <Pressable style={styles.nextButton} onPress={() => handleSave(false)}> 
            {/* ✅ UPDATED: now calls handleSave with navigateNext = false */}
            <Text style={styles.nextText}>Save</Text>
          </Pressable>
           
          {/* Next Button */}
           <Pressable
              style={styles.nextButton}
              onPress={() => navigation.navigate('AddDocument', { vehicleNumber })}
          >
            <Text style={styles.nextText}>Next</Text>
          </Pressable>

        </View>
      </View>
    </ImageBackground>
  );
}



const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    //marginTop: -10,
    marginTop: 40,
    marginBottom: 20,
  },
  formContainer: {
    alignItems: 'center',
    marginTop: 0,
    position: 'relative',
  },
  carImage: {
    width:500,
    height: 520,
    position: 'absolute',
    zIndex: 0,
  },
  inputGroup: {
    paddingTop: 100,
    marginTop:0,
    marginBottom:0,
    width: 300,
    zIndex: 1,
    //borderWidth:1,
    //borderColor:'#000',
  },
  input: {
    backgroundColor: 'hsla(218, 33%, 94%, 0.19)',
    borderRadius: 8,
    height: 45,
    marginVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    borderWidth:1,
    borderColor:'#000',
  },
  nextButton: {
    backgroundColor: '#3362A9',
    borderRadius: 6,
    marginVertical: 16,
    height:50,
    width:180,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginLeft:60
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
