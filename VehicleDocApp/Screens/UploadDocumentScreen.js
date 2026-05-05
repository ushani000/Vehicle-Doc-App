// VehicleDocApp/Screens/UploadDocumentScreen.js
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';

export default function UploadDocumentScreen({ navigation, route }) {
  const { vehicleNumber, docType } = route.params;
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocUrl, setUploadedDocUrl] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
       //const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
       //const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted') Alert.alert('Camera permission is required.');
      if (libraryStatus !== 'granted') Alert.alert('Media library permission is required.');
    

    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //mediaTypes: ImagePicker.MediaType.IMAGE, // ✅ Updated
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
      setUploadedDocUrl(null); // reset preview
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //mediaTypes: ImagePicker.MediaType.IMAGE, // ✅ Updated
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
      setUploadedDocUrl(null); // reset preview
    }
  };

  const compressImage = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert('Please select an image first.');
      return;
    }

    setUploading(true);
    const start = Date.now();

    try {
      const localUri = image.uri.startsWith('file://') ? image.uri : 'file://' + image.uri;
      const compressedUri = await compressImage(localUri);
      const filename = compressedUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      const formData = new FormData();
      formData.append('vehicleNumber', vehicleNumber);
      formData.append('docType', docType);
      formData.append('document', { uri: compressedUri, name: filename, type });

      const res = await axios.post(
        'http://192.168.1.3:5000/api/vehicle/upload-document',
        formData,
        { headers: { Accept: 'application/json' } }
      );

      const duration = Date.now() - start;
      console.log(`✅ Upload took ${duration}ms`);

      if (res.data.message && res.data.document) {
        Alert.alert('Success', res.data.message);
        setUploadedDocUrl(`http://192.168.1.3:5000${res.data.document.docUrl}`);
        setImage(null); // clear local image
      } else {
        Alert.alert('Upload failed', 'No message returned from server.');
      }
    } catch (err) {
      console.error('Upload error', err);
      Alert.alert('Upload failed', err.message || 'Network error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{docType}</Text>
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
        onPress={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadText}>Upload</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  subtitle: { marginBottom: 12, color: '#333' },
  imageBox: {
    width: '100%',
    height: 320,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  preview: { width: '100%', height: '100%', resizeMode: 'contain' },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    padding: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    borderRadius: 8,
  },
  btnText: { color: '#333' },
  uploadBtn: {
    width: '100%',
    padding: 14,
    backgroundColor: '#2b8a3e',
    alignItems: 'center',
    borderRadius: 10,
  },
  uploadText: { color: '#fff', fontWeight: '600' },
});