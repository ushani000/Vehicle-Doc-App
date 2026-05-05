// VehicleDocApp/Screens/AddedDocument.js
import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Context for user data
const UserContext = React.createContext();

// Mock data - replace with your actual context implementation
const mockUserData = {
  id: 1,
  name: 'John Doe',
  vehicle: {
    plateNumber: 'ABC-1234',
  },
  email: 'johndoe@example.com',
  phone: '+1 234 567 8901'
};

const UserProvider = ({ children }) => (
  <UserContext.Provider value={mockUserData}>
    {children}
  </UserContext.Provider>
);

const useUserData = () => useContext(UserContext);

const AddedDocument = () => {
  const navigation = useNavigation();
  const currentUser = useUserData();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [documents, setDocuments] = useState([
    { id: 1, title: 'License', subtitle: currentUser.name },
    { id: 2, title: 'Revenue License', subtitle: currentUser.vehicle.plateNumber },
    { id: 3, title: 'Insurance', subtitle: currentUser.vehicle.plateNumber },
    { id: 4, title: 'Emission Certificate', subtitle: currentUser.vehicle.plateNumber },
    { id: 5, title: 'Vehicle Registration', subtitle: currentUser.vehicle.plateNumber },
    { id: 6, title: 'Inspection Report', subtitle: currentUser.vehicle.plateNumber },
  ]);

  const [deleteMode, setDeleteMode] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const handleDelete = (id) => {
    setDocToDelete(id);
    setDeleteMode(true);
  };

  const confirmDelete = () => {
    setDocuments(documents.filter(doc => doc.id !== docToDelete));
    setDeleteMode(false);
    setDocToDelete(null);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleImageClick = (doc) => {
    // ✅ fixed template string
    Alert.alert('Document View', `Would show document: ${doc.title}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Documents</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Document List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {documents.map((doc) => (
          <View key={doc.id} style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.docTitle}>{doc.title}</Text>
                <Text style={styles.docSubtitle}>{doc.subtitle}</Text>
              </View>

              {/* Menu Button */}
              <TouchableOpacity onPress={() => toggleMenu(doc.id)} style={styles.menuButton}>
                <Icon name="more-vert" size={24} color="#666" />
              </TouchableOpacity>

              {/* Dropdown Menu */}
              {openMenuId === doc.id && (
                <View style={styles.menuDropdown}>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text>Update</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Image Placeholder */}
            <TouchableOpacity 
              onPress={() => handleImageClick(doc)}
              style={styles.imagePlaceholder}
            >
              <Text style={styles.placeholderText}>Document Preview</Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => handleDelete(doc.id)}
              style={styles.deleteButton}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteMode}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteMode(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDeleteMode(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Confirm Delete</Text>
                <Text style={styles.modalText}>Are you sure you want to delete this document?</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setDeleteMode(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={confirmDelete}
                  >
                    <Text style={styles.confirmText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 22, fontWeight: 'bold', color: 'black', textDecorationLine: 'underline', marginTop: 10 },
  backButton: { padding: 4 },
  listContainer: { padding: 16 },
  card: { width: width - 32, height: 250, backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  docTitle: { fontWeight: 'bold', fontSize: 18 },
  docSubtitle: { color: '#666', fontSize: 15, marginTop: 18 },
  menuButton: { padding: 4 },
  menuDropdown: { position: 'absolute', top: 35, right: 0, backgroundColor: 'white', borderRadius: 6, padding: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5, width: 150 },
  menuItem: { paddingVertical: 8, paddingHorizontal: 6 },
  imagePlaceholder: { height: 95, width: 95, alignSelf: 'flex-end', backgroundColor: '#f5f5f5', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 7 },
  placeholderText: { color: '#888', fontSize: 10 },
  deleteButton: { backgroundColor: '#999BFF', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  deleteText: { color: 'black', fontWeight: '600', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 24, width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalText: { fontSize: 16, marginBottom: 24, textAlign: 'center', color: '#555', lineHeight: 24 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, minWidth: 100, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f0f0f0' },
  confirmButton: { backgroundColor: '#999BFF' },
  cancelText: { color: '#333', fontWeight: '500' },
  confirmText: { color: 'black', fontWeight: '600' },
});

// Wrap with UserProvider
export default function AppWrapper() {
  return (
    <UserProvider>
      <AddedDocument />
    </UserProvider>
  );
}
