// LiveChat.js
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import io from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';

const socket = io('http://192.168.1.3:5000');

export default function LiveChat({ route, navigation }) {
  const { receiverId } = route?.params || {};  
  const [senderId, setSenderId] = useState(null);
  const [chatUserName, setChatUserName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef();

  // 1) Load current user from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const { id, name } = JSON.parse(userData);
          setSenderId(id);
          setChatUserName(name);
        }
      } catch (err) {
        console.error('Error loading user:', err);
      }
    })();
  }, []);

  // 2) Compute a stable room key for this pair
  const room = useMemo(() => {
    if (!senderId || !receiverId) return null;
    return [senderId, receiverId].sort().join('_');
  }, [senderId, receiverId]);

  // 3) Join that room and listen only for messages in it
  useEffect(() => {
    if (!room) return;

    socket.emit('join_room', room);
    console.log('🔑 Joined room:', room);

    const handleReceive = (data) => {
      if (data.room !== room) return;
      console.log('📩 Incoming:', data);

      setMessages((prev) => {
        const incomingId     = String(data.id || '');
        const incomingTempId = String(data.tempId || '');
        let matched = false;

        const newList = prev.map(m => {
          if (String(m.id) === incomingTempId) {
            matched = true;
            return {
              id: incomingId,
              text: data.content,
              image: data.fileUrl
                ? `http://192.168.1.3:5000${data.fileUrl}`
                : null,
              sender: String(data.senderId) === String(senderId)
                ? 'you'
                : 'other',
            };
          }
          return m;
        });

        if (!matched) {
          newList.push({
            id: incomingId,
            text: data.content,
            image: data.fileUrl
              ? `http://192.168.1.3:5000${data.fileUrl}`
              : null,
            sender: String(data.senderId) === String(senderId)
              ? 'you'
              : 'other',
          });
        }
        return newList;
      });
    };

    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [room, senderId]);

  // Fetch existing chat history
  useEffect(() => {
    if (!senderId || !receiverId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://192.168.1.3:5000/api/chat/messages?senderId=${senderId}&receiverId=${receiverId}`
        );
        const json = await res.json();
        const formatted = json.map(msg => ({
          id: msg.id,
          text: msg.content,
          image: msg.fileUrl
            ? `http://192.168.1.3:5000${msg.fileUrl}`
            : null,
          sender: String(msg.senderId) === String(senderId)
            ? 'you'
            : 'other',
        }));
        setMessages(formatted);
        console.log('✅ History fetched:', formatted);
      } catch (err) {
        console.error('❌ Error fetching history:', err);
      }
    };

    fetchMessages();
  }, [senderId, receiverId]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !room) return;
    const tempId = Date.now().toString();

    // local echo
    setMessages(prev => [
      ...prev,
      { id: tempId, text: message, sender: 'you' },
    ]);

    socket.emit('send_message', {
      room,
      senderId,
      receiverId,
      content: message,
      tempId,
    });

    setMessage('');
  };

  const pickImage = async () => {
    if (!room) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (result.canceled) return;

    const file = result.assets[0];
    const tempId = Date.now().toString();
    setMessages(prev => [
      ...prev,
      { id: tempId, image: file.uri, sender: 'you' },
    ]);

    socket.emit('send_message', {
      room,
      senderId,
      receiverId,
      content: '',
      fileUrl: file.uri,
      tempId,
    });

    const form = new FormData();
    form.append('senderId', senderId.toString());
    form.append('receiverId', receiverId.toString());
    form.append('file', {
      uri: file.uri,
      name: file.fileName || 'upload.jpg',
      type: file.mimeType || 'image/jpeg',
    });
    await fetch('http://192.168.1.3:5000/api/chat/send', {
      method: 'POST',
      body: form,
    });
  };

  const renderItem = ({ item }) => {
    const isYou = item.sender === 'you';
    return (
      <View
        style={[
          styles.messageBubble,
          isYou ? styles.rightBubble : styles.leftBubble,
        ]}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={{ width: 200, height: 200 }} />
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
      </View>
    );
  };

  if (!senderId) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}     // ← pushes up on Android
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}    // ← offset adjustment
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/left.png')} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.username}>{chatUserName}</Text>
          <Text style={styles.subtitle}>Hi there!</Text>
        </View>
        <Image source={require('../assets/profile.png')} style={styles.profile} />
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10, paddingBottom: 100 }}  // ← added bottom padding
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"                         // ← allow taps when keyboard open
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type here"
            style={styles.textInput}
          />
          <TouchableOpacity onPress={pickImage}>
            <Image source={require('../assets/plus.png')} style={styles.plusIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSend}>
          <Image source={require('../assets/send1.png')} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#53c1e2',
    padding: 20,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#f0f0f0',
  },
  profile: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  leftBubble: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
    borderWidth: 0,
    borderColor: 'red',
  },
  rightBubble: {
    backgroundColor: '#d1f5d3',
    alignSelf: 'flex-end',
    borderWidth: 0,
    borderColor: 'green',
  },
  messageText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    padding: 10,
  },
  plusIcon: {
    width: 24,
    height: 24,
  },
  sendIcon: {
    width: 32,
    height: 32,
    marginLeft: 10,
  },
});