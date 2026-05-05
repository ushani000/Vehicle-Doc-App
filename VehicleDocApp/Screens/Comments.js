import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  NativeModules
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

/**
 * Safely extract your Metro host IP.
 * If scriptURL is unavailable, try Expo’s debuggerHost.
 * If that’s also unavailable, fall back to localhost (or 10.0.2.2 on Android).
 */
function getMetroHost() {
  // 1. Attempt React Native’s SourceCode.scriptURL
  const scriptURL = NativeModules.SourceCode?.scriptURL;
  if (scriptURL) {
    // e.g. "http://192.168.1.5:19000/index.bundle?platform=ios&dev=true"
    const [, hostAndPort] = scriptURL.split('://');
    const host = hostAndPort.split('/')[0].split(':')[0];
    return host;
  }

  // 2. Try Expo Constants manifest (Expo Go)
  const debuggerHost = Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    return debuggerHost.split(':').shift();
  }

  // 3. Final fallback
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

/**
 * Build the full URL to your API.
 * Replace port 5000 if your backend lives elsewhere.
 */
function getServerUrl(path) {
  let host = getMetroHost();

  // On Android emulators, localhost needs remapping
  if (
    Platform.OS === 'android' &&
    (host === 'localhost' || host === '127.0.0.1')
  ) {
    host = '10.0.2.2';
  }

  return `http://${host}:5000${path}`;
}

export default function Comments({ route, navigation }) {
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('🐛 [fetchComments] token:', token);

      if (!token) throw new Error('No auth token found – please log in');

      const res = await fetch(
        getServerUrl(`/api/posts/${postId}/comments`),
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 401) {
        await AsyncStorage.removeItem('token');
        throw new Error('Unauthorized – please log in again');
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }

      const data = await res.json();
      setComments(data);
    } catch (e) {
      Alert.alert('Error', e.message, [
        {
          text: 'OK',
          onPress: () => {
            if (e.message.toLowerCase().includes('login')) {
              navigation.replace('Login');
            }
          }
        }
      ]);
      console.error('fetchComments:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) return;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No auth token found – please log in');

      const res = await fetch(
        getServerUrl(`/api/posts/${postId}/comments`),
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ content: newComment })
        }
      );

      if (res.status === 401) {
        await AsyncStorage.removeItem('token');
        throw new Error('Unauthorized – please log in again');
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }

      const created = await res.json();
      setComments(prev => [...prev, created]);
      setNewComment('');
    } catch (e) {
      Alert.alert('Error', e.message);
      console.error('handleAddComment:', e);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        style={styles.commentsContainer}
        contentContainerStyle={styles.commentsContent}
      >
        {comments.map(c => (
          <View key={c.id} style={styles.commentItem}>
            <Text style={styles.commentAuthor}>{c.user.name}</Text>
            <Text style={styles.commentText}>{c.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <Pressable style={styles.commentButton} onPress={handleAddComment}>
          <Text style={styles.commentButtonText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  commentsContainer: { flex: 1 },
  commentsContent: { padding: 15, paddingBottom: 100 },

  commentItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  commentAuthor: {
    fontWeight: 'bold',
    color: '#6E8CD7',
    marginBottom: 4
  },
  commentText: { fontSize: 16 },

  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff'
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10
  },
  commentButton: {
    backgroundColor: '#6E8CD7',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  commentButtonText: { color: '#fff', fontWeight: 'bold' }
});