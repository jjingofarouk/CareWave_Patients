
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Switch,
  KeyboardAvoidingView
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AppointmentStyles';
  
  export const PatientDetailsModal = () => (
    <Modal
      visible={showPatientDetailsModal && selectedAppointment !== null}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Patient Details</Text>
  
          {selectedAppointment?.patientDetails && (
            <ScrollView>
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Name:</Text>
                <Text style={styles.detailsText}>{selectedAppointment.patient}</Text>
  
                <Text style={styles.detailsLabel}>Age:</Text>
                <Text style={styles.detailsText}>
                  {selectedAppointment.patientDetails.age}
                </Text>
  
                <Text style={styles.detailsLabel}>Contact:</Text>
                <Text style={styles.detailsText}>
                  {selectedAppointment.patientDetails.contactNumber}
                </Text>
                <Text style={styles.detailsText}>
                  {selectedAppointment.patientDetails.email}
                </Text>
  
                <Text style={styles.detailsLabel}>Medical History:</Text>
                {selectedAppointment.patientDetails.medicalHistory.map((condition, index) => (
                  <Text key={index} style={styles.detailsText}>
                    • {condition}
                  </Text>
                ))}
  
                <Text style={styles.detailsLabel}>Allergies:</Text>
                {selectedAppointment.patientDetails.allergies.map((allergy, index) => (
                  <Text key={index} style={styles.detailsText}>
                    • {allergy}
                  </Text>
                ))}
  
                <Text style={styles.detailsLabel}>Current Medications:</Text>
                {selectedAppointment.patientDetails.medications.map((medication, index) => (
                  <Text key={index} style={styles.detailsText}>
                    • {medication}
                  </Text>
                ))}
  
                <Text style={styles.detailsLabel}>Insurance:</Text>
                <Text style={styles.detailsText}>
                  {selectedAppointment.patientDetails.insuranceProvider}
                </Text>
  
                <Text style={styles.detailsLabel}>Emergency Contact:</Text>
                <Text style={styles.detailsText}>
                  {selectedAppointment.patientDetails.emergencyContact.name} (
                  {selectedAppointment.patientDetails.emergencyContact.relation})
                </Text>
                <Text style={styles.detailsText}>
                  {selectedAppointment.patientDetails.emergencyContact.phone}
                </Text>
              </View>
            </ScrollView>
          )}
  
          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={() => setShowPatientDetailsModal(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );