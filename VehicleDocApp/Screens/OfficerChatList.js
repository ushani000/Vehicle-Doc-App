import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';

export default function OfficerChatList({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const officerId = 7;

  // ✅ Updated fetch URL with correct syntax
  const fetchUsers = async () => {
    try {
      console.log('Fetching conversations for officerId:', officerId);
      const response = await fetch(
        `http://192.168.1.3:5000/api/chat/conversations?officerId=${officerId}`
      );
      const data = await response.json();
      //setUsers(data);
      setUsers(
      data.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
   );
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserPress = (user) => {
    navigation.navigate('ChatWindow', {
      selectedUser: { id: user.userId, name: user.name },
      officerId,
    });
  };

  const handleLogout = () => {
    setShowLogout(false);
    navigation.navigate('SignIn');
  };

  const handleBackPress = () => {
    navigation.navigate('SignIn');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => handleUserPress(item)}>
      <Text style={styles.userName}>{item.name || item.userName}</Text>
      {item.email && <Text style={styles.userEmail}>{item.email}</Text>}
      <Text style={styles.lastMessage}>
        {item.lastMessage ? `"${item.lastMessage}"` : 'No messages yet'}
      </Text>
      {item.lastMessageTime && (
        <Text style={styles.timestamp}>
          {new Date(item.lastMessageTime).toLocaleString()}
        </Text>
      )}
      {item.unreadCount > 0 && (
        <Text style={styles.unreadBadge}>{item.unreadCount} unread</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image source={require('../assets/left.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Officer Chat List</Text>
        <TouchableOpacity onPress={() => setShowLogout(true)}>
          <Image source={require('../assets/profile.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Logout Modal */}
      <Modal visible={showLogout} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowLogout(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Chat List */}
      {loading ? (
        <ActivityIndicator size="large" color="#3362A9" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.userId.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
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
    padding: 15,
    backgroundColor: '#3362A9',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 20,
  },
  userCard: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: '#555',
  },
  lastMessage: {
    fontStyle: 'italic',
    color: '#333',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  unreadBadge: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 6,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#3362A9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#3362A9',
    fontWeight: '600',
  },
});