// VehicleDocApp/Screens/RevenueScanner.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { AntDesign } from '@expo/vector-icons';

export default function RevenueScanner({ route }) {
  const { vehicleNumber } = route.params;
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocUrl, setUploadedDocUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ for modal

  // Request permissions
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted')
        Alert.alert('Permission required', 'Camera permission is required.');
      if (libraryStatus !== 'granted')
        Alert.alert('Permission required', 'Media library permission is required.');
    })();
  }, []);

  // Open camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setUploadedDocUrl(null);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setUploadedDocUrl(null);
    }
  };

  // Upload image
  const upload = async () => {
    if (!image) return; // Skip if no image

    setUploading(true);
    try {
      let localUri = image.uri;
      if (!localUri.startsWith('file://')) localUri = 'file://' + localUri;

      const result = await ImageManipulator.manipulateAsync(
        localUri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      const compressedUri = result.uri;
      const filename = compressedUri.split('/').pop();

      const formData = new FormData();
      formData.append('document', { uri: compressedUri, name: filename, type: 'image/jpeg' });
      formData.append('vehicleNumber', vehicleNumber);
      formData.append('docType', 'Revenue License');

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const res = await fetch('http://192.168.1.3:5000/api/vehicle/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (data.docUrl) {
        setUploadedDocUrl(`http://192.168.1.3:5000${data.docUrl}`);
        setImage(null);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scan Revenue License</Text>
      <Text style={styles.subtitle}>Vehicle No: {vehicleNumber}</Text>

      <View style={styles.imageBox}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.preview} />
        ) : uploadedDocUrl ? (
          <Image source={{ uri: uploadedDocUrl }} style={styles.preview} />
        ) : (
          <Text style={{ color: '#666' }}>No image selected</Text>
        )}
      </View>

      <View style={styles.buttonsRow}>
        <Pressable style={styles.button} onPress={takePhoto}>
          <Text style={styles.btnText}>Open Camera</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={pickImage}>
          <Text style={styles.btnText}>Choose from Library</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.uploadBtn, uploading && { opacity: 0.6 }]}
        onPress={() => {
          setShowSuccess(true); // ✅ show modal immediately
          upload(); // call actual upload
        }}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadText}>Upload & Verify</Text>
        )}
      </Pressable>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AntDesign name="checkcircle" size={60} color="green" />
            <Text style={styles.modalText}>Uploaded Successfully</Text>
            <Pressable style={styles.modalButton} onPress={() => setShowSuccess(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 30, alignItems: 'center', marginTop: 90 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  imageBox: {
    width: '100%',
    height: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  preview: { width: '100%', height: '100%', resizeMode: 'contain' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    flex: 0.48,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  uploadBtn: {
    backgroundColor: '#3362A9',
    padding: 15,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: { marginTop: 15, fontSize: 18, fontWeight: 'bold' },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
