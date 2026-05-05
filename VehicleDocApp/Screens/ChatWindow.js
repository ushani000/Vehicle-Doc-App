import React, { useEffect, useRef, useState } from 'react';
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
  Linking,
} from 'react-native';
import io from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';           // ← Added for image picking

const socket = io('http://192.168.1.3:5000');

export default function ChatWindow({ route, navigation }) {
  const { selectedUser, officerId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef();

  // receive incoming messages
  useEffect(() => {
    if (!selectedUser || !officerId) return;

    const handleReceive = (data) => {
      if (
        (data.senderId === selectedUser.id && data.receiverId === officerId) ||
        (data.senderId === officerId && data.receiverId === selectedUser.id)
      ) {
        setMessages((prev) => {
          if (
            prev.some(
              (msg) =>
                String(msg.id) === String(data.id) ||
                (data.tempId && String(msg.id) === String(data.tempId))
            )
          ) {
            console.log('⚠️ Duplicate message ignored:', data.id || data.tempId);
            return prev;
          }
          return [...prev, data];
        });
      }
    };

    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [selectedUser, officerId]);

  // load historical messages
  useEffect(() => {
    if (selectedUser) {
      fetch(
        `http://192.168.1.3:5000/api/chat/messages?senderId=${officerId}&receiverId=${selectedUser.id}`
      )
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Server error: ${res.status}\n${text}`);
          }
          return res.json();
        })
        .then((data) => setMessages(data))
        .catch((err) => {
          console.error('❌ Error fetching messages:', err.message);
          Alert.alert('Error', 'Failed to load messages');
        });
    }
  }, [selectedUser]);

  // auto-scroll on new messages
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // send text message
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const tempId = Date.now().toString();
    const tempMessage = { id: tempId, content: newMessage, senderId: officerId };
    setMessages((prev) => [...prev, tempMessage]);
    socket.emit('send_message', {
      senderId: officerId,
      receiverId: selectedUser.id,
      content: newMessage,
      tempId,
    });
    setNewMessage('');
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // ← Added: pick image and send
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.cancelled) {
      const tempId = Date.now().toString();
      const imageMessage = { id: tempId, image: result.uri, senderId: officerId };
      setMessages((prev) => [...prev, imageMessage]);
      socket.emit('send_message', {
        senderId: officerId,
        receiverId: selectedUser.id,
        image: result.uri,
        tempId,
      });
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderId === officerId ? styles.rightBubble : styles.leftBubble,
      ]}
    >
      { /* ← Render inline images if URL ends with common image extensions */ }
      {(item.image ||
        (item.fileUrl && /\.(jpe?g|png|gif)$/.test(item.fileUrl))) && (
        <Image
          source={{ uri: item.image || item.fileUrl }}
          style={styles.imagePreview}
        />
      )}

      { /* ← For non-image files, show download link with error handling */ }
      {item.fileUrl &&
        !item.image &&
        !/\.(jpe?g|png|gif)$/.test(item.fileUrl) && (
          <TouchableOpacity
            onPress={async () => {
              try {
                const supported = await Linking.canOpenURL(item.fileUrl);
                if (!supported) throw new Error();
                await Linking.openURL(item.fileUrl);
              } catch {
                Alert.alert('Error', 'Cannot open file URL');
              }
            }}
          >
            <Text style={styles.fileLink}>Download File</Text>
          </TouchableOpacity>
        )}

      <Text style={styles.messageText}>{item.content}</Text>
      {item.status && <Text style={styles.statusText}>{item.status}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}     // ← Modified to push up on Android
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}    // ← Adjusted offset
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/left.png')} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.username}>{selectedUser?.name || 'User'}</Text>
          <Text style={styles.subtitle}>Chat started</Text>
        </View>
        <Image source={require('../assets/profile.png')} style={styles.profile} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10, paddingBottom: 100 }}  // ← Added bottom padding
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"                          // ← Allow taps when keyboard open
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            style={styles.textInput}
          />
          <TouchableOpacity onPress={handlePickImage}>             // ← Now opens image picker
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
    backgroundColor: '#3362A9',
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
  },
  rightBubble: {
    backgroundColor: '#d1f5d3',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 18,
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
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  fileLink: {
    color: '#3362A9',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});