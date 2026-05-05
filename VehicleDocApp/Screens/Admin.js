import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Admin() {
  const [posts, setPosts] = useState([]);

  // load pending posts from AsyncStorage
  const loadPending = async () => {
    try {
      const json = await AsyncStorage.getItem('PENDING_POSTS');
      setPosts(json ? JSON.parse(json) : []);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  // approve → move from pending to approved
  const handleConfirm = async (postId) => {
    try {
      // 1) get pending & approved
      const pendJSON = await AsyncStorage.getItem('PENDING_POSTS');
      const apprJSON = await AsyncStorage.getItem('APPROVED_POSTS');
      const pending = pendJSON ? JSON.parse(pendJSON) : [];
      const approved = apprJSON ? JSON.parse(apprJSON) : [];

      // 2) find the post
      const toApprove = pending.find(p => p.id === postId);
      if (!toApprove) throw new Error('Post not found');

      // 3) remove from pending, add to approved
      const newPending = pending.filter(p => p.id !== postId);
      const newApproved = [toApprove, ...approved];

      // 4) save both
      await AsyncStorage.setItem(
        'PENDING_POSTS',
        JSON.stringify(newPending)
      );
      await AsyncStorage.setItem(
        'APPROVED_POSTS',
        JSON.stringify(newApproved)
      );

      // 5) update UI
      setPosts(newPending);
      Alert.alert('Success', 'Posted successfully!');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  // reject → drop from pending
  const handleDelete = async (postId) => {
    try {
      const pendJSON = await AsyncStorage.getItem('PENDING_POSTS');
      const pending = pendJSON ? JSON.parse(pendJSON) : [];
      const newPending = pending.filter(p => p.id !== postId);

      await AsyncStorage.setItem(
        'PENDING_POSTS',
        JSON.stringify(newPending)
      );

      setPosts(newPending);
      Alert.alert('Deleted', 'Post has been removed');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Panel</Text>

      {posts.length === 0 ? (
        <Text style={styles.noPosts}>No pending posts to review</Text>
      ) : (
        <ScrollView style={styles.postsContainer}>
          {posts.map(post => (
            <View key={post.id} style={styles.postCard}>
              <Text style={styles.postName}>{post.name}</Text>
              <Text style={styles.postContent}>{post.content}</Text>

              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, styles.confirmButton]}
                  onPress={() => handleConfirm(post.id)}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDelete(post.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ... your existing StyleSheet below

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#6E8CD7',
    paddingTop: 50, // Reduced top padding
  },
  debugBanner: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  debugText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  debugButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginTop:28,
    marginBottom: 15,
    elevation: 2,
  },
  postName: {
    fontWeight: 'bold',
    color: '#6E8CD7',
    fontSize: 18,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noPosts: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});
