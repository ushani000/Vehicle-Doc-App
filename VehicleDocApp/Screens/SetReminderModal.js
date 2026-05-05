// SetReminderModal.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const SetReminderModal = ({ 
  visible, 
  onClose, 
 
}) => {
  const [expireDate, setExpireDate] = useState(new Date());
  const [reminderDate, setReminderDate] = useState(new Date());
  const [reminderTime, setReminderTime] = useState(new Date());
  const [emailChecked, setEmailChecked] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);
  const [showExpireDatePicker, setShowExpireDatePicker] = useState(false);
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSetReminder = () => {
    // Mock success message
    Alert.alert(
      'Reminder Set', 
      'This would call your backend API in a real implementation',
      [{ text: 'OK', onPress: onClose }]
    );
    
    
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleEmail = () => setEmailChecked(!emailChecked);
  const togglePhone = () => setPhoneChecked(!phoneChecked);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Title */}
              <Text style={styles.modalTitle}>Set Reminder</Text>
              
              {/* Bell Icon */}
              <View style={styles.bellContainer}>
                <Icon name="notifications" size={60} color="#999BFF" />
              </View>
              
              {/* Document Expire Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Document Expire Date</Text>
                <TouchableOpacity 
                  style={styles.dateInput} 
                  onPress={() => setShowExpireDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(expireDate)}</Text>
                  <Icon name="calendar-today" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {/* Reminder Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reminder Date</Text>
                <TouchableOpacity 
                  style={styles.dateInput} 
                  onPress={() => setShowReminderDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(reminderDate)}</Text>
                  <Icon name="calendar-today" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {/* Reminder Time */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reminder Time</Text>
                <TouchableOpacity 
                  style={styles.dateInput} 
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.dateText}>{formatTime(reminderTime)}</Text>
                  <Icon name="access-time" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {/* Get Reminder To */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Get reminder to</Text>
                
                <View style={styles.checkboxGroup}>
                  <TouchableOpacity 
                    style={styles.checkboxRow} 
                    onPress={toggleEmail}
                  >
                    <View style={[styles.checkbox, emailChecked && styles.checkedBox]}>
                      {emailChecked && <Icon name="check" size={18} color="white" />}
                    </View>
                    <Text style={styles.checkboxLabel}>Email</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.checkboxRow} 
                    onPress={togglePhone}
                  >
                    <View style={[styles.checkbox, phoneChecked && styles.checkedBox]}>
                      {phoneChecked && <Icon name="check" size={18} color="white" />}
                    </View>
                    <Text style={styles.checkboxLabel}>Phone</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Buttons */}
              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={onClose}
                  // disabled={isLoading} // 👈 COMMENTED OUT
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.setButton}
                  onPress={handleSetReminder}
                  // disabled={isLoading} // 👈 COMMENTED OUT
                >
                  {/* 👇 REMOVED LOADING STATE */}
                  <Text style={styles.setButtonText}>Set Reminder</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      
      {/* Date and Time Pickers */}
      {showExpireDatePicker && (
        <DateTimePicker
          value={expireDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowExpireDatePicker(false);
            if (date) setExpireDate(date);
          }}
        />
      )}
      
      {showReminderDatePicker && (
        <DateTimePicker
          value={reminderDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowReminderDatePicker(false);
            if (date) setReminderDate(date);
          }}
        />
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display="default"
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (date) setReminderTime(date);
          }}
        />
      )}
    </Modal>
  );
};



const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  bellContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  checkboxGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#999BFF',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#999BFF',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  setButton: {
    backgroundColor: '#999BFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
  },
  setButtonText: {
    color: 'black',
    fontWeight: '600',
  },
});

export default SetReminderModal;