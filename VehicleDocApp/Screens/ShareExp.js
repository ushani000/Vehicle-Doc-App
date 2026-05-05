// ShareExp.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ShareExp({ navigation }) {
  const [approvedPosts, setApprovedPosts] = useState([]);

  // load approved posts from AsyncStorage
  const loadApproved = async () => {
    try {
      const json = await AsyncStorage.getItem('APPROVED_POSTS');
      setApprovedPosts(json ? JSON.parse(json) : []);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  useEffect(() => {
    loadApproved();

    // reload when this screen gains focus
    const unsubscribe = navigation.addListener('focus', loadApproved);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Top blue section */}
      <View style={styles.topSection}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/left.png')}
              style={styles.icon}
            />
          </Pressable>
          <Image
            source={require('../assets/profile.png')}
            style={styles.icon}
          />
        </View>

        <Pressable
          style={styles.myPostButton}
          onPress={() => navigation.navigate('TypePost')}
        >
          <Text style={styles.myPostText}>My Post</Text>
        </Pressable>

        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/img10.png')}
            style={styles.centerImage}
          />

          <Pressable
            style={styles.addYoursButton}
            onPress={() => navigation.navigate('TypePost')}
          >
            <Text style={styles.addYoursText}>Add Yours</Text>
          </Pressable>
        </View>
      </View>

      {/* Bottom white section */}
      <ScrollView style={styles.bottomSection}>
        {approvedPosts.length === 0 ? (
          <Text style={styles.noPosts}>
            No posts yet. Be the first to share!
          </Text>
        ) : (
          approvedPosts.map((post) => (
            <View key={post.id} style={styles.postContainer}>
              <View style={styles.postTop}>
                <Text style={styles.name}>{post.name}</Text>
                <Pressable
                  style={styles.commentButton}
                  onPress={() =>
                    navigation.navigate('Comments', { postId: post.id })
                  }
                >
                  <Text style={styles.commentText}>Comment</Text>
                </Pressable>
              </View>
              <Text style={styles.postText}>{post.content}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    backgroundColor: '#6E8CD7',
    paddingTop: 40,
    paddingBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  icon: {
    width: 35,
    height: 35,
  },
  myPostButton: {
    backgroundColor: '#3362A9',
    borderRadius: 40,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  myPostText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: -60, // overlap into white area
  },
  centerImage: {
    width: 380,
    height: 340,
    borderRadius: 20,
  },
  addYoursButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: -2,
    elevation: 4,
  },
  addYoursText: {
    color: '#3362A9',
    fontWeight: 'bold',
  },
  bottomSection: {
    marginTop: 100,
    paddingHorizontal: 20,
  },
  noPosts: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  postContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  postTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#6E8CD7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentButton: {
    backgroundColor: '#6E8CD7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  commentText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postText: {
    marginTop: 10,
    fontSize: 14,
    color: '#000',
  },
});