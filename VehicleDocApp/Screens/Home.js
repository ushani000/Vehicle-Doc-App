import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  Platform,
} from 'react-native';

export default function Home({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/backg1.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.centerContent}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>DriveDocRenew</Text>

        {/* slogan with nested Text for indent + italic support */}
        <View style={styles.sloganContainer}>
          <Text style={styles.slogan} allowFontScaling={false}>
            "Documents Secured.
            <Text style={styles.indentedSlogan}>{'\n'}Renewals Reminded."</Text>
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate('SignIn')}
        >
          {({ pressed }) => (
            <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
              Sign in
            </Text>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate('SignUp')}
        >
          {({ pressed }) => (
            <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
              Sign up
            </Text>
          )}
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 200,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  sloganContainer: {
    marginTop: 10,
    width: '80%',
    alignItems: 'flex-start',
  },
  slogan: {
    fontSize: 20,
    color: '#000',
    marginVertical: 2,
    fontStyle: 'italic',           // iOS will pick this up
    ...Platform.select({
      android: { fontFamily: 'sans-serif-italic' }, // Android real italic
    }),
  },
  indentedSlogan: {
    marginLeft: 38,  // pushes second line to the right
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  button: {
    flex: 1,
    backgroundColor: 'rgba(65, 107, 150, 0.69)',
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPressed: {
    color: '#000',
  },
});