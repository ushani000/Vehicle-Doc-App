import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,               
} from 'react-native';

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Added: validation error states
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Added: success-modal visibility state
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleSignup = async () => {
    // Added: client-side validation
    let valid = true;

    // Name: required + letters only
    if (name.trim() === '') {
      setNameError('Name is required');
      valid = false;
    } else if (!/^[A-Za-z]+$/.test(name)) {
      setNameError('Name can only contain letters');
      valid = false;
    } else {
      setNameError('');
    }

    // Phone: required + numbers only
    if (phone.trim() === '') {
      setPhoneError('Phone is required');
      valid = false;
    } else if (!/^[0-9]+$/.test(phone)) {
      setPhoneError('Phone must contain only numbers');
      valid = false;
    } else {
      setPhoneError('');
    }

    // Password: required + alphanumeric + max 6 chars
    if (password.trim() === '') {
      setPasswordError('Password is required');
      valid = false;
    } else if (!/^[A-Za-z0-9]+$/.test(password)) {
      setPasswordError('Password can only contain letters and numbers');
      valid = false;
    } else if (password.length > 6) {
      setPasswordError('Password can be up to 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;  // stop here if any validation failed

    try {
      const response = await fetch('http://192.168.1.3:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password }),
      });
      const data = await response.json();

      if (response.status === 201) {
        // Changed: show modal instead of alert
        setSuccessModalVisible(true);
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error occurred');
    }
  };

  return (
    <ImageBackground source={require('../assets/backg1.jpeg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={require('../assets/left.png')} style={styles.leftImage} resizeMode="contain" />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Get Started</Text>

          {/* Name input w/ filter */}
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChangeText={text => {
              const lettersOnly = text.replace(/[^A-Za-z]/g, '');   // Added: filter non-letters
              setName(lettersOnly);
            }}
          />
          {/* Added: name-field error message */}
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          {/* Email unchanged */}
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Phone input w/ filter */}
          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            value={phone}
            onChangeText={text => {
              const numsOnly = text.replace(/[^0-9]/g, '');         // Added: filter non-digits
              setPhone(numsOnly);
            }}
            keyboardType="phone-pad"
          />
          {/* Added: phone-field error message */}
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

          {/* Password input w/ filter + maxLength */}
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={text => {
              const alnumOnly = text.replace(/[^A-Za-z0-9]/g, ''); // Added: filter non-alphanumeric
              setPassword(alnumOnly);
            }}
            maxLength={6}                                         // Added: max 6 chars
          />
          {/* Added: password-field error message */}
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <Pressable style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Sign up</Text>
          </Pressable>

          <View style={styles.signInRow}>
            <Text style={styles.accountText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Added: success modal */}
      <Modal transparent visible={successModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Logo on top */}
            <Image
              source={require('../assets/logo.png')}
              style={styles.modalLogo}                              // Changed: larger logo
              resizeMode="contain"
            />

            {/* Checkmark + text on same line */}
            <View style={styles.modalLogoRow}>                     // Reused row style
              <Text style={styles.checkSign}>✓</Text>
              <Text style={styles.modalText}>Registered Successfully</Text>
            </View>

            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate('SignIn');
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
    marginBottom: 0,
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
  signupButton: {
    width: 355,
    height: 54,
    backgroundColor: '#3362A9',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  signupButtonText: {
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

  // Added styles for validation errors
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 30,
    marginBottom: 10,
  },

  // Added styles for success modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 330,               // Changed: make dialog wider
    padding: 30,              // Changed: more padding
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalLogo: {
    width: 150,               // Changed: bigger logo
    height: 150,
    marginBottom: 20,         // Added: spacing below logo
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  modalLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,         // Changed: more space after success line
  },
  checkSign: {
    fontSize: 28,             // Changed: larger checkmark
    color: 'green',
    marginRight: 10,
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