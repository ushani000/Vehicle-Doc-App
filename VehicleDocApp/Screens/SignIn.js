// SignIn.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  Modal,                // ⚡️ Added
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ⚡️ Added: control modal visibility
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  // ⚡️ Added: remember where to go next
  const [nextRoute, setNextRoute] = useState(null);

  const handleSignin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.3:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.status === 200) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        // ⚡️ Decide destination and show modal
        let routeName;
        if (data.user.email === 'admin@gmail.com' || data.user.role === 'admin') {
          routeName = 'Admin';
        } else if (data.user.role === 'officer') {
          routeName = 'OfficerChatList';
        } else {
          routeName = 'Menu';
        }
        setNextRoute(routeName);
        setSuccessModalVisible(true);

      } else {
        console.log('Login failed', data);
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/backg1.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../assets/left.png')}
          style={styles.leftImage}
          resizeMode="contain"
        />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={styles.signinButton} onPress={handleSignin}>
            <Text style={styles.signinButtonText}>Sign in</Text>
          </Pressable>

          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Text style={{ color: 'blue', marginTop: 20 }}></Text>
          </TouchableOpacity>

          <View style={styles.signInRow}>
            <Text style={styles.accountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signInLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ⚡️ Success Modal */}
      <Modal
        transparent
        visible={successModalVisible}
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* App logo centered */}
            <Image
              source={require('../assets/logo.png')}
              style={styles.modalLogo}
              resizeMode="contain"
            />

            {/* Checkmark + success text */}
            <View style={styles.modalLogoRow}>
              <Text style={styles.checkSign}>✓</Text>
              <Text style={styles.modalText}>Logged in successfully!</Text>
            </View>

            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setSuccessModalVisible(false);
                if (nextRoute) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: nextRoute }],
                  });
                }
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  leftImage: {
    width: 50,
    height: 50,
    marginLeft: 20,
  },
  formContainer: {
    marginTop: 80,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 80,
    paddingHorizontal: 30,
    paddingBottom: 300,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    color: '#3362A9',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: 355,
    height: 54,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  signinButton: {
    width: 355,
    height: 54,
    backgroundColor: '#3362A9',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  signinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  accountText: {
    fontSize: 18,
    color: '#000',
  },
  signInLink: {
    fontSize: 18,
    color: '#3362A9',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 330,
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalLogo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  modalLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  checkSign: {
    fontSize: 28,
    color: 'green',
    marginRight: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  modalButton: {
    backgroundColor: '#3362A9',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});