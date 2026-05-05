import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  Modal,
  TouchableOpacity,
} from 'react-native';
//import { Camera } from 'expo-camera';


export default function AddDocument({ navigation, route }) {

  const [modalVisible, setModalVisible] = useState(false);

  const { vehicleNumber } = route.params;


  //const handleAddPress = () => {
    //setModalVisible(true);
  //};
const handleAddPress = () => {
  console.log('Navigating with vehicleNumber:', vehicleNumber);
  navigation.navigate('RevenueScanner', { vehicleNumber });
};




  return (
    <ImageBackground
      source={require('../assets/backg2.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Back Button */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image source={require('../assets/left.png')} style={styles.icon} />
        </Pressable>
      </View>

      {/* Title with stroke */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleStroke}>Legal Documents</Text>
        <Text style={styles.title}>Legal Documents</Text>
      </View>

      {/* Transparent box */}
      <View style={styles.boxWrapper}>
        <Image source={require('../assets/back.png')} style={styles.carbBox} resizeMode="contain" />

        {/* Documents Grid */}
        <View style={styles.docGrid}>
          {[
            { label: 'License', img: require('../assets/img5.png') },
            { label: 'Revenue License', img: require('../assets/img6.png') },
            { label: 'Emission', img: require('../assets/img7.png') },
            { label: 'Insurance', img: require('../assets/img8.png') },
            { label: 'Other', img: require('../assets/img9.png') },
          ].map((doc, index) => (
            <View key={index} style={styles.docItem}>
              <Pressable
                  onPress={() => {
                    if (doc.label === 'Revenue License') {
                       handleAddPress();
                    } else {
                       setModalVisible(true);
                }
          }}
      >

                <View style={styles.imgContainer}>
                  <Image source={doc.img} style={styles.docImage} />
                  <Image source={require('../assets/plus.png')} style={styles.plusIcon} />
                </View>
              </Pressable>
              <Text style={styles.docLabel}>{doc.label}</Text>
            </View>
          ))}
        </View>

        {/* Save Button */}
        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Choose File</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: 'gray' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  topBar: {
    marginTop: 50,
    marginLeft: 20,
  },
  icon: {
    width: 35,
    height: 35,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  titleStroke: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    position: 'absolute',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 2,
  },
  boxWrapper: {
    alignItems: 'center',
    marginTop: 30,
    flex: 1,
    borderRadius:100,
  },
  carbBox: {
    width: 370,
    height: 600,
    borderRadius:60,
    position: 'absolute',
  },
  docGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 60,
    zIndex: 1,
    width: '90%',
  },
  docItem: {
    alignItems: 'center',
    width: '40%',
    marginVertical: 5,
  },
  imgContainer: {
    position: 'relative',
  },
  docImage: {
    width: 120,
    height: 120,
    borderRadius:10,
  },
  plusIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
  },
  docLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  saveButton: {
    backgroundColor: '#3362A9',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    width: '70%',
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#3362A9',
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
