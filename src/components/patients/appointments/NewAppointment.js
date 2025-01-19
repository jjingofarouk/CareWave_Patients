import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView
} from 'react-native';
import { styles } from './AppointmentStyles';

export const NewAppointmentModal = ({
  visible = false,
  onClose = () => {},
  onCreateAppointment = () => {},
  appointment = {
    patientName: '',
    reason: '',
    type: 'regular',
    priority: 'medium',
    duration: 30,
    notes: '',
    date: '',
    time: ''
  },
  onUpdateAppointment = () => {},
  appointmentTypes = {},
  priorityLevels = {}
}) => {
  // Add validation to ensure appointment object exists
  const safeAppointment = appointment || {
    patientName: '',
    reason: '',
    type: 'regular',
    priority: 'medium',
    duration: 30,
    notes: '',
    date: '',
    time: ''
  };

  const handleUpdateAppointment = (updates) => {
    onUpdateAppointment(prev => ({...(prev || {}), ...updates}));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>New Appointment</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Patient Name"
            value={safeAppointment.patientName}
            onChangeText={(text) => handleUpdateAppointment({ patientName: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Reason for Visit"
            value={safeAppointment.reason}
            onChangeText={(text) => handleUpdateAppointment({ reason: text })}
          />

          <View style={styles.rowContainer}>
            <Text>Appointment Type:</Text>
            <FlatList
              horizontal
              data={Object.values(appointmentTypes)}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    safeAppointment.type === item && styles.selectedTypeButton
                  ]}
                  onPress={() => handleUpdateAppointment({ type: item })}
                >
                  <Text style={styles.typeButtonText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
            />
          </View>

          <View style={styles.rowContainer}>
            <Text>Priority:</Text>
            <FlatList
              horizontal
              data={Object.values(priorityLevels)}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    safeAppointment.priority === item && styles.selectedPriorityButton
                  ]}
                  onPress={() => handleUpdateAppointment({ priority: item })}
                >
                  <Text style={styles.priorityButtonText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Duration (minutes)"
            keyboardType="numeric"
            value={String(safeAppointment.duration)}
            onChangeText={(text) => handleUpdateAppointment({ duration: parseInt(text) || 30 })}
          />

          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notes"
            multiline
            value={safeAppointment.notes}
            onChangeText={(text) => handleUpdateAppointment({ notes: text })}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={onCreateAppointment}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};