import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TypePost({ navigation }) {
  const [postContent, setPostContent] = useState('');

  const handlePost = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty');
      return;
    }

    try {
      // load the current user
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      const userName = user?.name ?? 'Anonymous';

      //fetch existing pending posts
      const json = await AsyncStorage.getItem('PENDING_POSTS');
      const pending = json ? JSON.parse(json) : [];

      // create new post record
      const newPost = {
        id: Date.now(),
        name: userName,
        content: postContent,
      };

      // save it back
      await AsyncStorage.setItem(
        'PENDING_POSTS',
        JSON.stringify([newPost, ...pending])
      );

      Alert.alert('Success', 'Your post has been submitted for approval');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };





//
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../assets/left.png')} style={styles.icon} />
      </Pressable>

      <Text style={styles.title}>Type Your Post</Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your post here..."
        value={postContent}
        onChangeText={setPostContent}
      />

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.postButton]}
          onPress={handlePost}
        >
          <Text style={styles.buttonText}>Post</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ... your existing StyleSheet below

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  icon: {
    width: 35,
    height: 35,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    textAlignVertical: 'top',
    marginBottom: 30,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  postButton: {
    backgroundColor: '#6E8CD7',
  },
  cancelButton: {
    backgroundColor: '#6E8CD7',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
