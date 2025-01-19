// AppointmentModals.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import { styles } from './AppointmentStyles';
import DateTimePicker from '@react-native-community/datetimepicker';

export const BookAppointmentModal = ({ 
  visible, 
  onClose, 
  newAppointment, 
  onUpdateAppointment, 
  onBookAppointment,
  APPOINTMENT_TYPES,
  SPECIALTIES,
  DURATION_OPTIONS,
  availableDoctors,
  availableSlots
}) => (
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
        <Text style={styles.modalTitle}>Book an Appointment</Text>
        
        <View style={styles.stepSection}>
          <Text style={styles.stepTitle}>1. Select Appointment Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.values(APPOINTMENT_TYPES).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  newAppointment.type === type && styles.selectedTypeButton
                ]}
                onPress={() => onUpdateAppointment('type', type)}
              >
                <Text style={styles.typeButtonText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.stepSection}>
          <Text style={styles.stepTitle}>2. Choose Specialty (if applicable)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.values(SPECIALTIES).map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={[
                  styles.specialtyButton,
                  newAppointment.specialty === specialty && styles.selectedSpecialtyButton
                ]}
                onPress={() => onUpdateAppointment('specialty', specialty)}
              >
                <Text style={styles.specialtyButtonText}>{specialty}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.stepSection}>
          <Text style={styles.stepTitle}>3. Select Doctor</Text>
          <FlatList
            horizontal
            data={availableDoctors}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.doctorCard,
                  newAppointment.doctorId === item.id && styles.selectedDoctorCard
                ]}
                onPress={() => onUpdateAppointment('doctorId', item.id)}
              >
                <Text style={styles.doctorName}>{item.name}</Text>
                <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>

        <View style={styles.stepSection}>
          <Text style={styles.stepTitle}>4. Pick Date & Time</Text>
          <DateTimePicker
            value={newAppointment.date || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => onUpdateAppointment('date', date)}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {availableSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.timeSlot,
                  newAppointment.time === slot && styles.selectedTimeSlot
                ]}
                onPress={() => onUpdateAppointment('time', slot)}
              >
                <Text style={styles.timeSlotText}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Any additional notes or concerns? (optional)"
          multiline
          value={newAppointment.notes}
          onChangeText={(text) => onUpdateAppointment('notes', text)}
        />

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.bookButton]}
            onPress={onBookAppointment}
          >
            <Text style={styles.buttonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

export const AppointmentDetailsModal = ({ visible, onClose, appointment, onCancelAppointment, onReschedule }) => (
  <Modal
    visible={visible && appointment !== null}
    animationType="slide"
    transparent={true}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Appointment Details</Text>

        <ScrollView>
          <View style={styles.detailsSection}>
            <Text style={styles.detailsLabel}>Type:</Text>
            <Text style={styles.detailsText}>{appointment?.type}</Text>

            <Text style={styles.detailsLabel}>Doctor:</Text>
            <Text style={styles.detailsText}>{appointment?.doctorName}</Text>
            <Text style={styles.detailsText}>{appointment?.specialty}</Text>

            <Text style={styles.detailsLabel}>Date & Time:</Text>
            <Text style={styles.detailsText}>
              {appointment?.date} at {appointment?.time}
            </Text>

            <Text style={styles.detailsLabel}>Status:</Text>
            <Text style={styles.detailsText}>{appointment?.status}</Text>

            <Text style={styles.detailsLabel}>Location:</Text>
            <Text style={styles.detailsText}>{appointment?.location}</Text>

            {appointment?.notes && (
              <>
                <Text style={styles.detailsLabel}>Additional Notes:</Text>
                <Text style={styles.detailsText}>{appointment.notes}</Text>
              </>
            )}
          </View>
        </ScrollView>

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.button, styles.rescheduleButton]}
            onPress={() => onReschedule(appointment)}
          >
            <Text style={styles.buttonText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => onCancelAppointment(appointment)}
          >
            <Text style={styles.buttonText}>Cancel Appointment</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export const FilterModal = ({ 
  visible, 
  onClose, 
  filterOptions, 
  onUpdateFilters, 
  onApplyFilters, 
  onClearFilters,
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  STATUS_COLORS
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Filter My Appointments</Text>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Status</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.values(APPOINTMENT_STATUS).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  filterOptions.status === status && styles.filterChipSelected,
                  { backgroundColor: filterOptions.status === status ? STATUS_COLORS[status] : '#fff' }
                ]}
                onPress={() => onUpdateFilters('status', status)}
              >
                <Text style={styles.filterChipText}>{status}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.values(APPOINTMENT_TYPES).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterChip,
                  filterOptions.type === type && styles.filterChipSelected
                ]}
                onPress={() => onUpdateFilters('type', type)}
              >
                <Text style={styles.filterChipText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={onClearFilters}
          >
            <Text style={styles.buttonText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.applyButton]}
            onPress={onApplyFilters}
          >
            <Text style={styles.buttonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);