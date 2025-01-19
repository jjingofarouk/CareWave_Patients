import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import CustomSelect from '../../utils/CustomSelect';

const BookAppointmentModal = ({
  visible = false,
  onClose = () => {},
  newAppointment = {},
  onUpdateAppointment = () => {},
  onBookAppointment = () => {},
  APPOINTMENT_TYPES = {},
  SPECIALTIES = {},
  DURATION_OPTIONS = []
}) => {
  // Convert APPOINTMENT_TYPES object to array of options
  const appointmentTypeOptions = Object.entries(APPOINTMENT_TYPES).map(([value, label]) => ({
    value,
    label
  }));

  // Convert SPECIALTIES object to array of options
  const specialtyOptions = Object.entries(SPECIALTIES).map(([value, label]) => ({
    value,
    label
  }));

  // Convert DURATION_OPTIONS array to array of option objects
  const durationOptions = DURATION_OPTIONS.map(duration => ({
    value: duration,
    label: `${duration} minutes`
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>Book New Appointment</Text>

            <CustomSelect
              label="Appointment Type"
              options={appointmentTypeOptions}
              value={appointmentTypeOptions.find(option => option.value === newAppointment.type)}
              onSelect={(option) => onUpdateAppointment('type', option.value)}
              placeholder="Select appointment type"
            />

            <CustomSelect
              label="Specialty"
              options={specialtyOptions}
              value={specialtyOptions.find(option => option.value === newAppointment.specialty)}
              onSelect={(option) => onUpdateAppointment('specialty', option.value)}
              placeholder="Select specialty"
            />

            <CustomSelect
              label="Duration"
              options={durationOptions}
              value={durationOptions.find(option => option.value === newAppointment.duration)}
              onSelect={(option) => onUpdateAppointment('duration', option.value)}
              placeholder="Select duration"
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reason for Visit</Text>
              <TextInput
                style={styles.textInput}
                value={newAppointment.reason}
                onChangeText={(text) => onUpdateAppointment('reason', text)}
                multiline
                numberOfLines={3}
                placeholder="Enter reason for visit"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={onBookAppointment}
              >
                <Text style={styles.buttonText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F8FAFC',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },
  bookButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
};

export default BookAppointmentModal;